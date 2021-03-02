const axios = require("axios");
const Discord = require('discord.js');

const news = require('./news.js');
const shop = require('./shop.js')
const newCos = require('./newCosmetics.js');
const { Bot, Kevin } = require("..");

module.exports = {
    async reloadData() {
        axios({
            method: 'get',
            url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
            headers: { 
                'Accept-Language': 'fr-FR', 
            }
        }).then(async function(response) {
            if(response.status !== 200) return
            
            let channel = Bot.channels.cache.get(Kevin.Channels.battleroyalenews)
            if(response.data.battleroyalenewsv2["jcr:baseVersion"] !== channel.topic && response.data.battleroyalenewsv2.news.motds.length !== 0) {
                await news.generateNews(response.data.battleroyalenewsv2).then(async (value) => {
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Battle Royale")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://br-news.gif')
                    .setFooter(response.data.battleroyalenewsv2["jcr:baseVersion"], Bot.user.displayAvatarURL())
                    await channel.send(embed).then(msg => msg.crosspost())
                    await channel.setTopic(response.data.battleroyalenewsv2["jcr:baseVersion"])
                })
            }

            channel = Bot.channels.cache.get(Kevin.Channels.creativenews)
            if(response.data.creativenewsv2["jcr:baseVersion"] !== channel.topic && response.data.creativenewsv2.news.motds.length !== 0) {
                await news.generateNews(response.data.creativenewsv2).then(async (value) => {
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Fortnite Créatif")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://creatif-news.gif')
                    .setFooter(response.data.creativenewsv2["jcr:baseVersion"], Bot.user.displayAvatarURL())
                    await channel.send(embed).then(msg => msg.crosspost())
                    await channel.setTopic(response.data.creativenewsv2["jcr:baseVersion"])
                })
            }

            channel = Bot.channels.cache.get(Kevin.Channels.savetheworldnews)
            if(response.data.savetheworldnews["jcr:baseVersion"] !== channel.topic && response.data.savetheworldnews.news.messages.length !== 0) {
                await news.generateNewsSTW(response.data.savetheworldnews).then(async (value) => {
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Fortnite Sauver le Monde")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://stw-news.gif')
                    .setFooter(response.data.savetheworldnews["jcr:baseVersion"], bot.user.displayAvatarURL())
                    await channel.send(embed).then(msg => msg.crosspost())
                    await channel.setTopic(response.data.savetheworldnews["jcr:baseVersion"])
                })
            }
            
            await news.emergencyMessage(response.data.emergencynotice)
            return
        })
    },

    async reloadShop() {
        const channel = Bot.channels.cache.get(Kevin.Channels.shop)
        axios({
            method: 'get',
            url: 'https://fortnite-api.com/v2/shop/br/combined?language=fr',
        }).then(async function(response) {
            if(response.status !== 200) return
            if(response.data.data.hash === channel.topic) return 
            await shop.genratateShop(response.data.data).then(async (value) => {
                const embed = new Discord.MessageEmbed()
                .setTitle(`Shop Fortnite Battle Royale`)
                .attachFiles(value)
                .setImage("attachment://shop.png")
                .setColor("#bf9322")
                .setFooter(response.data.data.hash, Bot.user.displayAvatarURL())
                await channel.send(embed).then(msg => msg.crosspost())
            })
            return await channel.setTopic(response.data.data.hash)
        })
    },

    async reloadNewCos() {
        const channel = Bot.channels.cache.get(Kevin.Channels.newCos)
        axios({
            method: 'get',
            url: 'https://fortnite-api.com/v2/cosmetics/br/new?language=fr',
        }).then(async function(response) {
            if(response.status !== 200) return
            if(response.data.data.hash === channel.topic) return 
            await newCos.generateNewCos(response.data.data).then(async (value) => {
                const embed = new Discord.MessageEmbed()
                .setTitle(`Nouveaux cosmétiques Fortnite Battle Royale`)
                .attachFiles(value)
                .setImage("attachment://newCos.png")
                .setColor("#bf9322")
                .setFooter(response.data.data.hash, Bot.user.displayAvatarURL())
                await channel.send(embed).then(msg => msg.crosspost())
            })
            return await channel.setTopic(response.data.data.hash)
        })
    },
}