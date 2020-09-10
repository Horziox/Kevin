const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const { genratateShop } = require('../../functions/shop.js')

module.exports = {
    name: "shop",
    cooldown: 10,
    async execute(message, args, bot, prefix) {

        message.channel.startTyping()
        let embed = new Discord.MessageEmbed()
        .setTitle(`Shop Fortnite Battle Royale`)
        .setColor("#bf9322")
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        fs.stat('./final/shop.png', async function(err, stats) {
            if(!err) {
                embed.attachFiles('./final/shop.png')
                .setImage('attachment://shop.png')
            }
            else {
                var response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/shop/br/combined?language=fr'})
                await genratateShop(response.data.data).then(async (value) => {
                    embed.attachFiles(value)
                    .setImage("attachment://shop.png")
                })
            }
            await message.channel.send(embed)
            return message.channel.stopTyping()
        })
    }
}