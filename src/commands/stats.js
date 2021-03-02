const Discord = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");
const { Kevin } = require("..");

module.exports = {
    name: "stats",
    cooldown: 10,
    async execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        if(args.length == 0) {
            embed.setTitle("Commandes Stats Fortnite")
            .setDescription(`${Kevin.Param.prefix}stats Votre pseudo Epic Games\n\nEx: ${Kevin.Param.prefix}stats Ninja`)
            .setColor("#0078ff")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed)
        }
        axios({
            method: 'get',
            url: 'https://fortnite-api.com/v1/stats/br/v2?name='+encodeURIComponent(args.join(" "))
        }).then(async function(response) {
            let text = "Cliquez sur la réaction correspondant aux stats que vous voulez afficher :\n\n<:global:744916178081939477> Toutes les plateformes"
            if(response.data.data.stats.keyboardMouse !== null) text = text + "\n<:cs:744916159752699904> Clavier/Souris"
            if(response.data.data.stats.gamepad !== null) text = text + "\n<:manette:744916145034756126> Manette"
            if(response.data.data.stats.touch !== null) text = text + "\n<:mobile:744916201301606520> Tactile"
            embed.setTitle("Selectionnez votre plateforme")
            .setDescription(text)
            .setColor("#0078ff")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            const botmsg = await message.channel.send(embed)

            if(response.data.data.stats.keyboardMouse !== null) await botmsg.react("744916159752699904")
            if(response.data.data.stats.gamepad !== null) await botmsg.react("744916145034756126")
            if(response.data.data.stats.touch !== null) await botmsg.react("744916201301606520")
            await botmsg.react("744916178081939477")

            const filter = (user) => user.id !== message.author.id
            const collector = botmsg.createReactionCollector(filter, {time: 20000, max: 1})

            collector.on('end', async (collected) => {
                await botmsg.reactions.removeAll()
                if(collected.size == 0) {
                    embed.setDescription("Vous avez mis trop de temps à me répondre ! :/\nPour voir vos statistiques, merci de recommencer !")
                    .setColor("#0078ff")
                    .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    return await botmsg.edit(embed)
                } else {
                    let plat;
                    const emoji = {
                        "744916159752699904": {
                            "api" : "keyboardMouse",
                            "name": "Clavier/Souris"
                        },
                        "744916145034756126": {
                            "api": "gamepad",
                            "name": "Manette"
                        },
                        "744916201301606520": {
                            "api": "touch",
                            "name": "Tactile"
                        },
                        "744916178081939477": {
                            "api": "all",
                            "name": "Général"
                        }
                    }
                    plat = emoji[collected.array()[0].emoji.id].api
                    const data = response.data.data

                    if(data.stats[plat] == null) {
                        embed.setDescription(`Vous n'avez pas de statistiques sur **${emoji[collected.array()[0].emoji.id].name}**`)
                        .setColor("#cf3419")
                        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return await botmsg.edit(embed)
                    }
                    message.channel.startTyping()

                    const canvas = Canvas.createCanvas(1390, 920);
                    const ctx = canvas.getContext('2d');

                    ctx.strokeStyle = "#0078ff";
                    ctx.fillStyle = '#0078ff';
                    ctx.lineJoin = "round";
                    ctx.lineWidth = 20;
                    ctx.globalAlpha = 0.7
                    ctx.strokeRect(710, 160, 600, 390);
                    ctx.fillRect(720, 170, 580, 370);

                    ctx.strokeStyle = "black";
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 0.2
                    ctx.strokeRect(710, 160, 600, 390);
                    ctx.fillRect(720, 170, 580, 370);

                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#292828';
                    ctx.strokeStyle = "#292828";
                    ctx.strokeRect(710, 610, 600, 250);
                    ctx.fillRect(720, 620, 580, 230);

                    ctx.strokeRect(50, 610, 600, 250);
                    ctx.fillRect(60, 620, 580, 230);

                    ctx.strokeRect(50, 300, 600, 250);
                    ctx.fillRect(60, 310, 580, 230);

                    ctx.font = 'italic 60px Burbank Big Rg Bd'
                    ctx.fillStyle = '#ffffff'
                    ctx.fillText("SOLO", 70, 310)
                    ctx.fillText("DUO", 70, 620)
                    ctx.fillText("SQUAD", 730, 620)
                    ctx.fillText("GÉNÉRAL", 730, 170)

                    ctx.globalAlpha = 0.9
                    ctx.font = 'italic 70px Burbank Big Rg Bd'
                    ctx.fillText(data.account.name, 80, 140)
                    ctx.globalAlpha = 1
                    const platform = await Canvas.loadImage(`./assets/plateform/${plat}.png`);
                    ctx.drawImage(platform, 70, 150, 70, 70)
                    ctx.font = 'italic 20px Burbank Big Rg Bd'
                    ctx.globalAlpha = 0.7;
                    const refresh = new Date(data.stats.all.overall.lastModified)
                    const stringDate = refresh.toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                    ctx.fillText("Actualisé le "+stringDate, 155, 195)

                    const stats = data.stats[plat]

                    //OVERALL
                    if(stats.overall !== null) {
                        ctx.globalAlpha = 0.7;
                        ctx.font = 'italic 25px Burbank Big Rg Bd'
                        ctx.fillText("Victoires\n\n\n\nParties\n\n\n\nPasse de Combat", 740, 240)
                        ctx.fillText("Kills\n\n\n\nK/D", 940, 240)
                        ctx.fillText("Taux Victoires\n\n\n\nTemps de Jeu", 1110, 240)
    
                        ctx.globalAlpha = 1;
                        ctx.font = 'italic 40px Burbank Big Rg Bd'
                        ctx.fillText(`${stats.overall.wins}`, 740, 280)
                        ctx.fillText(`${stats.overall.matches}`, 740, 380)
                        ctx.fillText(`${stats.overall.kills}`, 940, 280)
                        ctx.fillText(`${stats.overall.kd.toFixed(2)}`, 940, 380)
                        ctx.fillText(`${stats.overall.winRate.toFixed(2)}%`, 1110, 280)
                        ctx.font = 'italic 30px Burbank Big Rg Bd'
                        ctx.textAlign = "right";
                        ctx.fillText(`${((stats.overall.minutesPlayed/60)/24).toFixed(0)}j ${((stats.overall.minutesPlayed/60)%24).toFixed(0)}h ${(stats.overall.minutesPlayed%60).toFixed(0)}min`, 1280, 375)
                    } else {
                        ctx.font = 'italic 40px Burbank Big Rg Bd'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 680, 400)
                    }

                    ctx.font = 'italic 25px Burbank Big Rg Bd'
                    ctx.textAlign = "left";
                    ctx.fillStyle = '#ffffff'
                
                    ctx.lineJoin = "round";
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 10;
                    ctx.globalAlpha = 0.5

                    ctx.strokeRect(870, 500, 300, 0);
                    ctx.fillRect(870, 500, 300, 0);

                    ctx.globalAlpha = 1
                    let lineaire = ctx.createLinearGradient(850, 500, 1200, 500);
                    lineaire.addColorStop(0,'#c2611b')
                    lineaire.addColorStop(1,'#eb1d1a')
                    ctx.fillStyle = lineaire;
                    ctx.strokeStyle = lineaire;

                    ctx.strokeRect(870, 500, data.battlePass.progress*3, 0);
                    ctx.fillRect(870, 500, data.battlePass.progress*3, 0);

                    ctx.font = 'italic 40px Burbank Big Rg Bd'
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign = "right";
                    ctx.fillText(data.battlePass.level, 850, 510)
                    ctx.textAlign = "left";
                    ctx.fillText(data.battlePass.level+1, 1185, 510)


                    let mode = 'solo';
                    let x = 0;
                    let decalLeft = 70;
                    let decalHeight = 365;
                    while(x <= 2) {
                        if(stats[mode] !== null) {
                            ctx.globalAlpha = 0.7;
                            ctx.font = 'italic 25px Burbank Big Rg Bd'
                            ctx.fillText("Victoires\n\n\n\nParties", decalLeft, decalHeight)
                            ctx.fillText("Kills\n\n\n\nK/D", decalLeft+190, decalHeight)
                            ctx.fillText("Taux Victoires\n\n\n\nK/M", decalLeft+360, decalHeight)
    
                            ctx.globalAlpha = 1;
                            ctx.font = 'italic 40px Burbank Big Rg Bd'
                            ctx.fillText(`${stats[mode].wins}`, decalLeft, decalHeight+40)
                            ctx.fillText(`${stats[mode].kills}`, decalLeft+190, decalHeight+40)
                            ctx.fillText(`${stats[mode].winRate.toFixed(2)}%`, decalLeft+360, decalHeight+40)
                            ctx.fillText(`${stats[mode].matches}`, decalLeft, decalHeight+140)
                            ctx.fillText(`${stats[mode].kd.toFixed(2)}`, decalLeft+190, decalHeight+140)
                            ctx.fillText(`${stats[mode].killsPerMatch.toFixed(2)}`, decalLeft+360, decalHeight+140) 
                        } else {
                            ctx.font = 'italic 40px Burbank Big Rg Bd'
                            ctx.fillText("Aucunes statistiques n'as été trouvées", 50, 250)
                        }

                        x++
                        if(x == 1) {
                            mode = 'duo';
                            decalHeight = 680
                        }
                        if(x == 2) {
                            mode = 'squad';
                            decalLeft = 730
                        }
                    }
                    const img = new Discord.MessageAttachment(canvas.toBuffer(), 'stats.png')
                    embed.setTitle(`Statistiques de ${data.account.name} sur ${emoji[collected.array()[0].emoji.id].name}`)
                    .attachFiles(img)
                    .setImage("attachment://stats.png")
                    .setDescription("")
                    .setColor("#0078ff")
                    .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    await botmsg.delete()
                    await message.channel.send(embed)
                    return message.channel.stopTyping()
                }
            });
        }).catch((e) => {
            console.log(e)
            if(e.response.status == 404) {
                embed.setTitle("Compte introuvable !")
                .setDescription(":warning: Vérifiez le nom du compte !")
                .setColor("#cf3419")
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                return message.channel.send(embed)
            } else if(e.response.status == 403) {
                embed.setTitle("Statistiques du compte privées !")
                .setDescription(":warning: Vos statistiques sont en privées !\nVoici l'astuce pour les avoir en publique ! ^^")
                .setImage("https://media.discordapp.net/attachments/715327691842256906/732932511352750100/fortnite-stats-public.gif")
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
    }
}