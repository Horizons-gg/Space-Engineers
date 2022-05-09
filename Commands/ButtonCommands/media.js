const fs = require('fs')


module.exports = async (interaction, flag) => {

    const Uploads = await process.db.collection('uploads')


    flag.shift() //? Remove the Media Definition

    const Request = flag.shift() //? Get the request type (Approve/Deny)
    const UUID = flag.join('-') //? Get the UUID

    if (Request === 'approve') {
        Uploads.updateOne({ _id: UUID }, { $set: { approved: true, approved_by: interaction.user.id } })
            .then(() => {
                interaction.update({
                    embeds: [{
                        title: `Upload Approved by ${interaction.user.username}`,
                        description: `This upload has been approved by <@${interaction.user.id}>\n\nYou can view the image [here](${process.env.api.steam.realm}/uploads/${UUID}.jpg)`,
                        color: '#3ba55c',
                        image: {
                            url: `${process.env.api.steam.realm}/uploads/${UUID}.jpg`
                        }
                    }],
                    components: []
                })
            })
            .catch(err => interaction.reply(`An error occurred:\n\`\`\`${err}\`\`\``, { ephemeral: true }))
    }

    if (Request === 'deny') {
        Uploads.deleteOne({ _id: UUID })
            .then(() => {
                interaction.message.delete()
                fs.unlink(`./public/uploads/${UUID}.jpg`, err => {
                    if (err) console.log(err)
                })
            })
            .catch(err => interaction.reply(`An error occurred:\n\`\`\`${err}\`\`\``, { ephemeral: true }))
    }

}