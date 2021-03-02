const Discord = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");
const humanize = require('humanize-duration');

const { Kevin } = require('..');

module.exports = {
    name: "cos",
    cooldown: 10,
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
        if(!args.length) {
            embed.setTitle("Commandes Info Fortnite")
            .setDescription(`${Kevin.Param.prefix}cos Nom de la cosmétique\n\nEx: ${Kevin.Param.prefix}info Floss`)
            .setColor("#0078ff")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed)
        }
        let botmsg;

        const infoCosmetics = new Promise(async (resolve, reject) => {
            const language =  new Promise(async(resolve, reject) => {
                embed.setTitle("Langue de recherche")
                .setDescription("Sélectionnez en quelle langue vous avez tapé le nom du cosmétique à rechercher !")
                .setTimestamp()
                botmsg = await message.channel.send(embed);
                await botmsg.react("🇫🇷")
                await botmsg.react("🇬🇧")

                const filter = (user) => user.id = message.author.id
                const collector = botmsg.createReactionCollector(filter, {time: 20000, max: 1})

                collector.on('end', async(collected) => {
                
                    await botmsg.reactions.removeAll()
                    if(collected.size == 0) {
                        embed.setDescription(`Tu as mis trop de temps à me répondre ! :/\nSi tu veux avoir les informations, merci de recommencer !`)
                        .setColor("#0078ff")
                        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return await botmsg.edit(embed)
                    } else {
                        let emoji = {"🇫🇷":"fr","🇬🇧":"en"}
                        resolve(emoji[collected.array()[0].emoji.name])
                    }
                })
            })

            language.then(async(value) => {
                await axios({
                    method: 'get',
                    url: `https://fortnite-api.com/v2/cosmetics/br/search/all?name=${encodeURIComponent(args.join(" "))}&matchMethod=contains&searchLanguage=${value}&language=fr`,
                }).then(async function(response) {
                    var data = response.data.data
                    if(data.length > 1) {
                        let text = `**${data.length}** cosmétiques correspondent avec votre recherche : \`${args.join(" ")}\`\n`
                        embed.setTitle("Résultats de la recherche")
                        for(let e = 0; e<data.length; e++) {
                            if((text + `\n\`${e+1}\` ${data[e].name} (${data[e].type.displayValue})`).length < 1800) text += `\n\`${e+1}\` ${data[e].name} (${data[e].type.displayValue})`
                            else break
                        }
                        embed.setDescription(text)
                        .setTimestamp()
                        await botmsg.edit(embed)
                        const filter = m => m.author.id === message.author.id
                        const collector = message.channel.createMessageCollector(filter, { time: 20000, max: 1});
    
                        collector.on('collect', m => m.delete());
    
                        collector.on('end', async(msg) => {
                            if(msg.length == 0) {
                                embed.setDescription(`Tu as mis trop de temps à me répondre ! :/\nSi tu veux avoir les informations, merci de recommencer !`)
                                .setColor("#0078ff")
                                .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                return await choiceMessage.edit(endEmbed)
                            } else {
                                if(msg.array()[0].content > data.length+1 || msg.array()[0].content <= 0) {
                                    embed.setDescription(`Le nombre saisi est impossible...`)
                                    .setColor("#0078ff")
                                    .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    return await botmsg.edit(embed)
                                } else return resolve(data[msg.array()[0].content-1])
                            }
                        })
                    } else return resolve(data[0])

                }).catch((e) => {
                    console.error(e)
                    if(e.response.status == 404) {
                        embed.setTitle("Cosmétique introuvable !")
                        .setDescription(":warning: Vérifiez le nom du cosmétique recherché !")
                        .setColor("#cf3419")
                        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return botmsg.edit(embed)
                    } else {
                        embed.setTitle(`Erreur ${e.response.status}`)
                        .setDescription(`\`${e.resonse.data.error}\`\nRéessayez et contactez Horziox si le problème persiste !`)
                        .setColor("#cf3419")
                        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return botmsg.edit(embed)
                    }
                });
            })
        })

        infoCosmetics.then(async (value) => {
            message.channel.startTyping()
            let canvasH = 600

            if(value.variants !== null) for(let e = 0; e!== value.variants.length; e++) canvasH = canvasH + 140;
    
            const canvas = Canvas.createCanvas(1280, canvasH);
            const ctx = canvas.getContext('2d');
            let cosmetic;

            if(value.images.featured !== null) cosmetic = await Canvas.loadImage(value.images.featured)
            else if(value.images.icon !== null) cosmetic = await Canvas.loadImage(value.images.icon)
            else cosmetic = await Canvas.loadImage(value.images.smallIcon)

            ctx.drawImage(cosmetic, 5, 50, 500, 500)

            ctx.textAlign = "center";

            ctx.font = 'italic 80px Burbank Big Rg Bk'
            ctx.fillStyle = '#ffffff'

            ctx.fillText(value.name.toUpperCase(), 820, 90)

            ctx.font = 'italic 30px Burbank Big Rg Bk'
            ctx.fillText(`${value.description}`, 820, 140)
            ctx.fillText(`${value.type.displayValue} ${value.rarity.displayValue}`, 820, 250)
            if(value.set == null) ctx.fillText(`Ne fait partie d'aucun ensemble`, 820, 300)
            else ctx.fillText(`${value.set.text}`, 820, 300)
            if(value.introduction !== null) ctx.fillText(`${value.introduction.text}`, 820, 350)
            if(value.shopHistory !== null) {
                let date = new Date(value.shopHistory[value.shopHistory.length-1])
                const time = humanize(Date.now()-Date.parse(date), { language: 'fr', largest: 2, round: true, units: ["mo", "d"] })
                date = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
                ctx.fillText(`Sortie ${value.shopHistory.length} fois dans le shop`, 820, 400)
                ctx.fillText(`Dernière sortie le ${date} (${time})`, 820, 440)
            }

            ctx.textAlign = "left";

            if(value.variants !== null) {
                let h = 600
                for(let e = 0; e!== value.variants.length; e++) {
                    let decal = 50
                    ctx.font = '30px Burbank Big Rg Bk'
                    ctx.fillText(value.variants[e].type, 50, h)
                    for(let i =0; i!==value.variants[e].options.length; i++) {
                        var variant = await Canvas.loadImage(value.variants[e].options[i].image)
                        ctx.drawImage(variant, decal, h, 80, 80)
                        ctx.font = '20px Burbank Big Rg Bk'
                        ctx.fillText(value.variants[e].options[i].name, decal, h+90)
                        decal += 100
                    }
                    h += 140
                }
            }
            const img = new Discord.MessageAttachment(canvas.toBuffer(), 'info.png')
            embed.setTitle("Information cosmétique")
            .setDescription("")
            .setColor('#0078ff')
            .addField("Identifiant", `\`${value.id}\``)
            .addField("Définition", "`"+value.path+"`")
            .addField("Tags", `\`\`\`JSON\n${JSON.stringify(value.gameplayTags, null, 2)}\n\`\`\``)
            .attachFiles(img)
            .setImage('attachment://info.png')
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            await message.channel.stopTyping()
            await botmsg.delete()
            return await message.channel.send(embed)
        })
    }
}