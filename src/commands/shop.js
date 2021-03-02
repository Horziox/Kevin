const Discord = require("discord.js");
const axios = require('axios');
const fs = require('fs');
const { generateShop } = require('../functions/shop.js')

module.exports = {
    name: "shop",
    cooldown: 10,
    async execute(message, args) {

        message.channel.startTyping()
        const embed = new Discord.MessageEmbed()
        .setTitle(`Shop Fortnite Battle Royale`)
        .setColor("#0078ff")
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        fs.stat('./final/shop.png', async function(err, stats) {
            if(!err) {
                embed.attachFiles('./final/shop.png')
                .setImage('attachment://shop.png')
            }
            else {
                const response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/shop/br?language=fr'})
                await generateShop(response.data.data).then(async (value) => {
                    const attach = new Discord.MessageAttachment(value, 'shop.png')
                    embed.attachFiles(attach)
                    .setImage("attachment://shop.png")
                })
            }
            await message.channel.send(embed)
            return message.channel.stopTyping()
        })
    }
}