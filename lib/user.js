const Crypto = require('crypto')


async function Login(SteamId, profile) {

    const Users = await process.db.collection('users')
    const User = await Users.findOne({ _id: SteamId })
    
    if (User) return User.token
    
    const Account = {
        _id: SteamId,
        token: Crypto.randomBytes(64).toString('base64url'),
        steam: profile,
        discord: {},
        patreon: {}
    }

    await Users.insertOne(Account)

    return Account.token

}



module.exports = {
    Login
}