const Discord = require("discord.js");
const axios = require("axios");
const fs = require("fs");

const { generateNewsBR, generateNewsCreatif, generateNewsSTW } = require('../../functions/news.js')

module.exports = {
    name: "news",
    cooldown: 3,
    async execute(message, args, bot, prefix) {

        message.channel.startTyping()

        let embed = new Discord.MessageEmbed()
        .setColor('#bf9322')
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
    
        if(!args.length || args[0] == 'br') {
            embed.setTitle("Actualités Fortnite Battle Royale")
            fs.stat('./final/br-news.gif', async function(err, stats) {
                if(!err) {
                    embed.attachFiles('./final/br-news.gif')
                    .setImage('attachment://br-news.gif')
                }
                else {
                    const request = await axios({
                        method: 'get',
                        url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
                        headers: { 
                            'Accept-Language': 'fr-FR', 
                        }
                    })
                    if(request.data.battleroyalenewsv2.news.motds.length == 0) {
                        message.channel.stopTyping()
                        return message.reply("il n'y a actuellement aucune actualité en jeu")
                    }
                    await generateNewsBR(request.data.battleroyalenewsv2).then(async (value) => {
                        embed.attachFiles(value)
                        .setImage('attachment://br-news.gif')
                    })
                }
                await message.channel.stopTyping()
                return await message.channel.send(embed)
            })
        } else if(args[0] == 'creatif') {
            embed.setTitle("Actualités Fortnite Créatif")
            fs.stat('./final/creatif-news.gif', async function(err, stats) {
                if(!err) {
                    embed.attachFiles('./final/creatif-news.gif')
                    .setImage('attachment://creatif-news.gif')
                }
                else {
                    const request = await axios({
                        method: 'get',
                        url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
                        headers: { 
                            'Accept-Language': 'fr-FR', 
                        }
                    })
                    if(request.data.creativenewsv2.news.motds.length == 0) {
                        message.channel.stopTyping()
                        return message.reply("il n'y a actuellement aucune actualité en jeu")
                    }
                    await generateNewsCreatif(request.data.creativenewsv2).then(async (value) => {
                        embed.attachFiles(value)
                        .setImage('attachment://creatif-news.gif')
                    })
                }
                await message.channel.stopTyping()
                return await message.channel.send(embed)
            })
        } else if(args[0] == 'stw') {
            embed.setTitle("Actualités Fortnite Sauver le Monde")
            fs.stat('./final/stw-news.gif', async function(err, stats) {
                if(!err) {
                    embed.attachFiles('./final/stw-news.gif')
                    .setImage('attachment://stw-news.gif')
                }
                else {
                    const request = await axios({
                        method: 'get',
                        url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
                        headers: { 
                            'Accept-Language': 'fr-FR', 
                        }
                    })
                    if(request.data.savetheworldnews.news.messages.length == 0) {
                        message.channel.stopTyping()
                        return message.reply("il n'y a actuellement aucune actualité en jeu")
                    }
                    await generateNewsSTW(request.data.savetheworldnews).then(async (value) => {
                        embed.attachFiles(value)
                        .setImage('attachment://stw-news.gif')
                    })
                }
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