const Discord = require("discord.js");
const axios = require("axios");

const { generateNewsBR, generateNewsCreatif, generateNewsSTW } = require('../../functions/news.js')

module.exports = {
    name: "news",
    cooldown: 5,
    async execute(message, args, bot, prefix) {

        message.channel.startTyping()

        var request = await axios({
            method: 'get',
            url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
            headers: { 
                'Accept-Language': 'fr-FR', 
            }
        })

        if(!args.length || args[0] == 'br') {
            if(request.data.battleroyalenews.news["platform_motds"].length == 0) {
                await message.channel.stopTyping()
                return message.reply("il n'y a actuellement aucune actualité en jeu")
            }
            generateNewsBR(request.data.battleroyalenews).then(async (value) => {
                let embed = new Discord.MessageEmbed()
                .setTitle("Actualités Fortnite Battle Royale")
                .setColor('#bf9322')
                .attachFiles(value)
                .setImage('attachment://br-news.gif')
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                await message.channel.stopTyping()
                return await message.channel.send(embed)
            })
        } else if(args[0] == 'creatif') {
            if(request.data.creativenews.news["platform_motds"].length == 0) {
                await message.channel.stopTyping()
                return message.reply("il n'y a actuellement aucune actualité en jeu")
            }
            generateNewsCreatif(request.data.creativenews).then(async (value) => {
                let embed = new Discord.MessageEmbed()
                .setTitle("Actualités Fortnite Créatif")
                .setColor('#bf9322')
                .attachFiles(value)
                .setImage('attachment://creatif-news.gif')
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                await message.channel.stopTyping()
                return await message.channel.send(embed)
            })
        } else if(args[0] == 'stw') {
            if(request.data.savetheworldnews.news.messages.length == 0) {
                await message.channel.stopTyping()
                return message.reply("il n'y a actuellement aucune actualité en jeu")
            }
            generateNewsSTW(request.data.savetheworldnews).then(async (value) => {
                let embed = new Discord.MessageEmbed()
                .setTitle("Actualités Fortnite Sauver le Monde")
                .setColor('#bf9322')
                .attachFiles(value)
                .setImage('attachment://stw-news.gif')
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                await message.channel.stopTyping()
                return await message.channel.send(embed)
            })
        } else {
            let embed = new Discord.MessageEmbed()
            .setTitle("Commande News")
            .setColor('#bf9322')
            .setDescription("Seules les actualitées \`br\`, \`creatif\` et \`stw\` sont prises en charge !")
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            await message.channel.stopTyping()
            return await message.channel.send(embed)
        }
    }
}
