const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const { generateNewCos } = require('../functions/newCosmetics.js')

module.exports = {
    name: "leaks",
    cooldown: 10,
    async execute(message, args) {

        message.channel.startTyping()
        const embed = new Discord.MessageEmbed()
        .setTitle(`Leaks Fortnite Battle Royale`)
        .setColor("#0078ff")
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        fs.stat('./final/leaks.png', async function(err, stats) {
            if(!err) {
                embed.attachFiles('./final/leaks.png')
                .setImage('attachment://leaks.png')
            }
            else {
                const response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/cosmetics/br/new?language=fr'})
                await generateNewCos(response.data.data).then(async (value) => {
                    const attach = new Discord.MessageAttachment(value, 'leaks.png')
                    embed.attachFiles(attach)
                    .setImage("attachment://leaks.png")
                })
            }
            await message.channel.send(embed)
            return message.channel.stopTyping()
        })
    }
}