const fs = require('fs')


async function Authorize(req, res) {

    if (!res.locals.user) return res.redirect('/auth/steam')

    const Code = req.query.code
    if (!Code) return res.status(400).send('No callback code found!')

    const Data = await fetch(`https://www.patreon.com/api/oauth2/token?code=${Code}&grant_type=authorization_code&client_id=${process.env.api.patreon.client_id}&client_secret=${process.env.api.patreon.client_secret}&redirect_uri=${process.env.api.patreon.callback_uri}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.json())
        .catch(err => res.status(500).send(err))

    if (Data.error) return res.status(400).send(Data.error)
    if (!Data.access_token) return res.status(400).send('No access token found!')


    const User = await fetch(`https://www.patreon.com/api/oauth2/api/current_user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${Data.access_token}`
        }
    })
        .then(res => res.json())
        .catch(err => res.status(500).send(err))

    if (!User) return res.status(400).send('No user found!')

    await UpdateUser(User, res.locals.user._id) ? res.redirect('/?response=true') : res.redirect('/?response=false')

}

async function UpdateUser(User, Id) {

    if (!Id) return false

    try {
        const RelationshipId = User.data.relationships.pledges.data[0].id
        const RewardId = User.included.find(x => x.id === RelationshipId).relationships.reward.data.id
        const Pledge = User.included.find(x => x.id === RewardId).attributes.amount_cents

        const Data = {
            id: User.data.id,
            pledge: Pledge
        }

        await process.db.collection('users').updateOne({ _id: Id }, { $set: { patreon: Data } })

        return true
    } catch {
        await process.db.collection('users').updateOne({ _id: Id }, { $set: { patreon: { id: User.data.id, pledge: 0 } } })
        return false
    }

}



module.exports = {
    Authorize
}