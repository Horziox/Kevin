const Discord = require("discord.js");
const axios = require('axios');
const { genratateShop } = require('../../functions/shop.js')

module.exports = {
    name: "shop",
    cooldown: 60,
    async execute(message, args, bot, prefix) {
        var response = await axios({method: 'get',url: 'https://fortnite-api.com/v2/shop/br/combined?language=fr'})

        message.channel.startTyping()

        await genratateShop(response.data.data).then(async (value) => {
            let embed = new Discord.MessageEmbed()
            .setTitle(`Shop Fortnite Battle Royale`)
            .attachFiles(value)
            .setImage("attachment://shop.png")
            .setColor("#bf9322")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            await message.channel.send(embed)
            return message.channel.stopTyping()
        })
    }
}