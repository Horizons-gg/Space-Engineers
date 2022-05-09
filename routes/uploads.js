const { MessageActionRow, MessageButton } = require('discord.js')

const fs = require('fs')
const Crypto = require('crypto')


async function Upload(req, res) {

    if (!res.locals.user) return res.status(403).send('/auth/steam')

    if (!req.files) return res.status(404).send('No file uploaded.')
    if (!req.files.file) return res.status(404).send('No file uploaded.')


    const Uploads = await process.db.collection('uploads')

    let UUID = Crypto.randomUUID()
    while (await Uploads.findOne({ _id: UUID })) UUID = Crypto.randomUUID()

    const File = req.files.file
    if (File.size > 5000000) return res.status(400).send('File too large, MAX 5MB')
    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(File.mimetype)) return res.status(400).send('Invalid file type! Only JPG, JPEG, and PNG are allowed.')

    await File.mv(`./public/uploads/${UUID}.jpg`, err => {
        if (err) return res.status(500).send(err)

        Uploads.insertOne({
            _id: UUID,
            user: {
                id: res.locals.user._id,
                name: res.locals.user.steam.displayName,
                avatar: res.locals.user.steam._json.avatar,
                profile: res.locals.user.steam._json.profileurl
            },
            approved: false,
            submitted: new Date()
        })
            .then(() => {

                const Row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`media-approve-${UUID}`)
                            .setLabel('Approve')
                            .setStyle('SUCCESS'),

                        new MessageButton()
                            .setCustomId(`media-deny-${UUID}`)
                            .setLabel('Deny')
                            .setStyle('DANGER')
                    )

                process.client.channels.cache.get(process.env.discord.media.channel).send({
                    embeds: [{
                        title: 'New Media Submission',
                        description: `[${res.locals.user.steam.displayName}](${res.locals.user.steam._json.profileurl}) has uploaded a new image to the Space Engineers Gallery.\n\nDiscord account is: ${`<@${res.locals.user.discord.id}>` || 'Unknown'}\n\nIf the image fails to load, you can visit the source [here](${process.env.api.steam.realm}/uploads/${UUID}.jpg)`,
                        color: '#2aaff7',
                        image: {
                            url: `${process.env.api.steam.realm}/uploads/${UUID}.jpg`
                        }
                    }],
                    components: [Row]
                })

                res.status(200).send('Photo has been uploaded for submission!')
            })
            .catch(err => res.status(500).send(err), console.log(err))

    })

}



module.exports = {
    Upload
}