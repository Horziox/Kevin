const Discord = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");

module.exports = {
    name: "info",
    cooldown: 10,
    async execute(message, args, bot, prefix) {
        const infoCosmetics = new Promise(async (resolve, reject) => {
            const language =  new Promise(async(resolve, reject) => {
                let langEmbed = new Discord.MessageEmbed()
                .setTitle("Langue de recherche")
                .setDescription("Sélectionner en quelle langue vous avez tapé le nom du cosmétique à rechercher !")
                .setTimestamp()
                var langMessage = await message.channel.send(langEmbed)
                await langMessage.react("🇫🇷")
                await langMessage.react("🇬🇧")

                const filter = (user) => user.id = message.author.id
                const collector = langMessage.createReactionCollector(filter, {time: 20000, max: 1})

                collector.on('end', async(collected) => {
                
                    await langMessage.reactions.removeAll()
                    let endEmbed = new Discord.MessageEmbed()
                    if(collected.size == 0) {
                        endEmbed.setDescription(`La lenteur a un nom : **${message.author.username}** :joy:`)
                        .setColor("#bf9322")
                        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return await langMessage.edit(endEmbed)
                    } else {
                        let emoji = {"🇫🇷":"fr","🇬🇧":"en"}
                        resolve(emoji[collected.array()[0].emoji.name])
                        await langMessage.delete()
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
                        let choiceEmbed = new Discord.MessageEmbed()
                        .setTitle("Résultats de la recherche")
                        .setDescription(`**${data.length}** cosmétiques correspondent avec votre recherche : \`${args.join(" ")}\``)
                        for(let e = 0; e<data.length; e++) {
                            choiceEmbed.addField(`${data[e].name} (${data[e].type.displayValue})`, `Tapez ${e+1} pour plus d'informations`, true)
                        }
                        choiceEmbed.setTimestamp()
                        const choiceMessage = await message.channel.send(choiceEmbed)
                        const filter = m => m.author.id === message.author.id
                        const collector = message.channel.createMessageCollector(filter, { time: 20000, max: 1});
    
                        collector.on('collect', m => {
                            m.delete()
                        });
    
                        collector.on('end', async(msg) => {
                            let endEmbed = new Discord.MessageEmbed()
                            if(msg.length == 0) {
                                endEmbed.setDescription(`La lenteur a un nom : **${message.author.username}** :joy:`)
                                .setColor("#bf9322")
                                .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                return await choiceMessage.edit(endEmbed)
                            } else {
                                if(msg.array()[0].content > data.length+1 || msg.array()[0].content <= 0) {
                                    endEmbed.setDescription(`Le nombre saisi est impossible...`)
                                    .setColor("#bf9322")
                                    .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    return await choiceMessage.edit(endEmbed)
                                } else {
                                    await choiceMessage.delete()
                                    return resolve(data[msg.array()[0].content-1])
                                }
                            }
                        })
                    } else {
                        return resolve(data[0])
                    }
                }).catch((e) => {
                    console.error(e)
                    let embed = new Discord.MessageEmbed()
                    if(e.response.status == 404) {
                        embed.setTitle("Cosmétique introuvable !")
                        .setDescription(":warning: Vérifiez le nom du cosmétique recherché !")
                        .setColor("#cf3419")
                        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return message.channel.send(embed)
                    } else {
                        embed.setTitle(`Erreur ${e.response.status}`)
                        .setDescription(`\`${e.resonse.data.error}\`\nRéessayez et contactez Horziox si le problème persiste !`)
                        .setColor("#cf3419")
                        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return message.channel.send(embed)
                    }
                });
            })
        })

        if(args.length == 0) {
            let embed = new Discord.MessageEmbed()
            .setTitle("Commandes Info Fortnite")
            .setDescription(`${prefix}cos Nom de la cosmétique\n\nEx: ${prefix}cos FLoss`)
            .setColor("#bf9322")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed)
        }

        infoCosmetics.then(async (value) => {
            let embed = new Discord.MessageEmbed()
            let canvasH = 600

            if(value.variants !== null) {
                for(let e = 0; e!== value.variants.length; e++) {
                    canvasH = canvasH + 140
                }
            }
    
            const canvas = Canvas.createCanvas(1280, canvasH);
            const ctx = canvas.getContext('2d');
            var cosmetic;

            if(value.images.featured !== null) cosmetic = await Canvas.loadImage(value.images.featured)
            else if(value.images.icon !== null) cosmetic = await Canvas.loadImage(value.images.icon)
            else cosmetic = await Canvas.loadImage(value.images.smallIcon)

            ctx.drawImage(cosmetic, 5, 50, 500, 500)

            ctx.font = '80px Burbank Big Cd Bk'
            ctx.fillStyle = '#ffffff'

            ctx.fillText(value.name, 550, 90)

            ctx.font = '30px Burbank Big Cd Bk'
            ctx.fillText(`${value.description}`, 500, 150)
            ctx.fillText(`${value.type.displayValue} ${value.rarity.displayValue}`, 500, 250)
            if(value.set == null) ctx.fillText(`Ne fait partie d'aucun ensemble`, 500, 300)
            else ctx.fillText(`${value.set.text}`, 500, 300)
            ctx.fillText(`${value.introduction.text}`, 500, 350)
            if(value.shopHistory !== null) ctx.fillText(`Sortie ${value.shopHistory.length} fois dans le shop`, 500, 400)

            if(value.variants !== null) {
                let h = 600
                for(let e = 0; e!== value.variants.length; e++) {
                    let decal = 50
                    ctx.font = '30px Burbank Big Cd Bk'
                    ctx.fillText(value.variants[e].type, 50, h)
                    for(let i =0; i!==value.variants[e].options.length; i++) {
                        var variant = await Canvas.loadImage(value.variants[e].options[i].image)
                        ctx.drawImage(variant, decal, h, 80, 80)
                        ctx.font = '20px Burbank Big Cd Bk'
                        ctx.fillText(value.variants[e].options[i].name, decal, h+90)
                        decal = decal+100
                    }
                    h = h+140
                }
            }
            const img = new Discord.MessageAttachment(canvas.toBuffer(), 'info.png')
            embed.setTitle("Information cosmétique")
            .setColor('#bf9322')
            .addField("Nom", value.name)
            .addField("Identifiant", "`"+value.id+"`")
            .addField("Chemin", "`"+value.path+"`")
            .attachFiles(img)
            .setImage('attachment://info.png')
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return await message.channel.send(embed)
        })
    }
}