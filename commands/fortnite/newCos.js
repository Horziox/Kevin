const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const { generateNewCos } = require('../../functions/newCosmetics.js')

module.exports = {
    name: "leak",
    cooldown: 10,
    async execute(message, args, bot, prefix) {

        message.channel.startTyping()
        let embed = new Discord.MessageEmbed()
        .setTitle(`Nouveaux cosmétiques Fortnite Battle Royale`)
        .setColor("#bf9322")
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        fs.stat('./final/newCos.png', async function(err, stats) {
            if(!err) {
                embed.attachFiles('./final/newCos.png')
                .setImage('attachment://newCos.png')
            }
            else {
                const response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/cosmetics/br/new?language=fr'})
                await generateNewCos(response.data.data).then(async (value) => {
                    embed.attachFiles(value)
                    .setImage("attachment://newCos.png")
                })
            }
            await message.channel.send(embed)
            return message.channel.stopTyping()
        })
    }
}