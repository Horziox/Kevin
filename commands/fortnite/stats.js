const Discord = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");

module.exports = {
    name: "stats",
    cooldown: 10,
    havePermissions: true,
    async execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        if(args.length == 0) {
            embed.setTitle("Commandes Stats Fortnite")
            .setDescription(`${prefix}stats Votre pseudo Epic Games\n\nEx: ${prefix}stats Ninja`)
            .setColor("#bf9322")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed)
        }
        await axios({
            method: 'get',
            url: 'https://fortnite-api.com/v1/stats/br/v2?name='+encodeURIComponent(args.join(" "))
        }).then(async function(response) {
            let text = "Cliquez sur la réaction correspondant aux stats que vous voulez afficher :\n\n<:global:744916178081939477> Toutes les plateformes"
            if(response.data.data.stats.keyboardMouse !== null) text = text + "\n<:cs:744916159752699904> Clavier/Souris"
            if(response.data.data.stats.gamepad !== null) text = text + "\n<:manette:744916145034756126> Manette"
            if(response.data.data.stats.touch !== null) text = text + "\n<:mobile:744916201301606520> Tactile"
            embed.setTitle("Selectionnez votre plateforme")
            .setDescription(text)
            .setColor("#bf9322")
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            const botmsg = await message.channel.send(embed)

            if(response.data.data.stats.keyboardMouse !== null) await botmsg.react("744916159752699904")
            if(response.data.data.stats.gamepad !== null) await botmsg.react("744916145034756126")
            if(response.data.data.stats.touch !== null) await botmsg.react("744916201301606520")
            await botmsg.react("744916178081939477")

            const filter = (user) => user.id = message.author.id
            const collector = botmsg.createReactionCollector(filter, {time: 20000, max: 1})

            collector.on('end', async (collected) => {
                await botmsg.reactions.removeAll()
                if(collected.size == 0) {
                    embed.setDescription("Tu as mis trop de temps à me répondre ! :/\nSi tu veux avoir tes statistiques, merci de recommencer !")
                    .setColor("#bf9322")
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
                        embed.setDescription(`Vous n'avez pas de statistiques sur **${emoji[collected.array()[0].emoji.id].name}** :/`)
                        .setColor("#cf3419")
                        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        return await botmsg.edit(embed)
                    }
                    message.channel.startTyping()

                    const canvas = Canvas.createCanvas(1280, 920);
                    const ctx = canvas.getContext('2d');
                    const space = await Canvas.loadImage('./assets/space-background.png')
                    ctx.drawImage(space, 0, 0, canvas.width, canvas.height)
                    
                    let skins = ["https://media.discordapp.net/attachments/715327691842256906/749281675191779378/groot-rocket.png", "https://media.discordapp.net/attachments/715327691842256906/749282553155813476/ironman.png", "https://media.discordapp.net/attachments/715327691842256906/749285313339457601/punk-storm.png"]
                    let choice = skins[Math.floor(Math.random() * skins.length)];
                    const image = await Canvas.loadImage(choice);
                    ctx.drawImage(image, 950, 0, image.width/3, image.height/3)

                    ctx.strokeStyle = "#2a8491";
                    ctx.fillStyle = '#2a8491';
                    ctx.lineJoin = "round";
                    ctx.lineWidth = 20;
                    ctx.globalAlpha = 0.9
                    
                    ctx.strokeRect(670, 220, 580, 390);
                    ctx.fillRect(680, 230, 560, 370);

                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#292828';
                    ctx.strokeStyle = "#292828";
                    ctx.strokeRect(660+(20/2), 640+(20/2), 600-20, 250-20);
                    ctx.fillRect(660+(20/2), 640+(20/2), 600-20, 250-20);

                    ctx.strokeRect(30+(20/2), 640+(20/2), 600-20, 250-20);
                    ctx.fillRect(30+(20/2), 640+(20/2), 600-20, 250-20);

                    ctx.strokeRect(30+(20/2), 370+(20/2), 600-20, 250-20);
                    ctx.fillRect(30+(20/2), 370+(20/2), 600-20, 250-20);

                    ctx.strokeRect(30+(20/2), 100+(20/2), 600-20, 250-20);
                    ctx.fillRect(30+(20/2), 100+(20/2), 600-20, 250-20);

                    ctx.font = '60px Burbank Big Cd Bk'
                    ctx.fillStyle = '#ffffff'
                    ctx.fillText("Solo", 100, 130)
                    ctx.fillText("Duo", 100, 400)
                    ctx.fillText("Squad", 100, 670)
                    ctx.fillText("Modes Temp", 760, 670)
                    ctx.fillText("Général", 680, 240)

                    ctx.globalAlpha = 0.9
                    ctx.font = '80px Burbank Big Cd Bk'
                    ctx.fillStyle = '#2a8491'
                    ctx.fillText(data.account.name, 670, 120, 500)
                    ctx.globalAlpha = 1
                    const platform = await Canvas.loadImage(`./assets/plateform/${plat}.png`);
                    ctx.drawImage(platform, 660, 130, 50, 50)
                    ctx.font = '20px Burbank Big Cd Bk'
                    ctx.fillStyle = '#292828'
                    const refresh = new Date(data.stats.all.overall.lastModified)
                    const stringDate = refresh.toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
                    ctx.fillText("Actualisé le "+stringDate, 720, 165)

                    ctx.font = '30px Burbank Big Cd Bk'
                    ctx.fillStyle = '#ffffff'
                
                    ctx.lineJoin = "round";
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 10;
                    ctx.globalAlpha = 0.5

                    ctx.strokeRect(830+(10/2), 570+(10/2), 300-10, 0);
                    ctx.fillRect(830+(10/2), 570+(10/2), 300-10, 0);

                    ctx.globalAlpha = 1
                    let lineaire = ctx.createLinearGradient(600, 500, 640, 1080);
                    lineaire.addColorStop(0.01,'#d481f0')
                    lineaire.addColorStop(0.3,'#5a2ac9')
                    ctx.fillStyle = lineaire;
                    ctx.strokeStyle = lineaire;

                    ctx.strokeRect(830+(10/2), 570+(10/2), data.battlePass.progress*3-10, 0);
                    ctx.fillRect(830+(10/2), 570+(10/2), data.battlePass.progress*3, 0);

                    ctx.font = '60px Burbank Big Cd Bk'
                    ctx.fillStyle = '#ffffff'
                    ctx.fillText(data.battlePass.level, 750, 595, 100)
                    ctx.fillText(data.battlePass.level+1, 1140, 595, 100)

                    const stats = data.stats[plat]

                    ctx.fillStyle = '#ffffff'

                    //OVERALL
                    if(stats.overall !== null) {
                        ctx.font = '30px Burbank Big Cd Bk'
                        ctx.fillText("Victoires\n\n\n\nParties\n\n\n\nPasse de Combat", 690, 300)
                        ctx.fillText("Kills\n\n\n\nK/D", 890, 300)
                        ctx.fillText("Taux Victoires\n\n\n\nTemps de Jeu", 1070, 300)
    
                        ctx.font = '60px Burbank Big Cd Bk'
                        ctx.fillText(`${stats.overall.wins}\n\n${stats.overall.matches}`, 690, 350, 175)
                        ctx.fillText(`${stats.overall.kills}\n\n${stats.overall.kd.toFixed(2)}`, 890, 350, 175)
                        ctx.fillText(`${stats.overall.winRate.toFixed(2)}%\n\n${(stats.overall.minutesPlayed/60).toFixed(0)}h${(stats.overall.minutesPlayed%60).toFixed(0)}min`, 1070, 350, 175) 
                    } else {
                        ctx.font = '40px Burbank Big Cd Bk'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 680, 400)
                    }

                    //SOLO
                    if(stats.solo !== null) {
                        ctx.font = '25px Burbank Big Cd Bk'
                        ctx.fillText("Victoires\n\n\n\nParties", 80, 170)
                        ctx.fillText("Kills\n\n\n\nK/D", 270, 170)
                        ctx.fillText("Taux Victoires\n\n\n\nK/M", 440, 170)

                        ctx.font = '50px Burbank Big Cd Bk'
                        ctx.fillText(`${stats.solo.wins}\n\n${stats.solo.matches}`, 80, 220, 175)
                        ctx.fillText(`${stats.solo.kills}\n\n${stats.solo.kd.toFixed(2)}`, 270, 220, 175)
                        ctx.fillText(`${stats.solo.winRate.toFixed(2)}%\n\n${stats.solo.killsPerMatch.toFixed(2)}`, 440, 220, 175) 
                    } else {
                        ctx.font = '40px Burbank Big Cd Bk'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 50, 250)
                    }

                    //DUO
                    if(stats.duo !== null) {
                        ctx.font = '25px Burbank Big Cd Bk'
                        ctx.fillText("Victoires\n\n\n\nParties", 80, 440)
                        ctx.fillText("Kills\n\n\n\nK/D", 270, 440)
                        ctx.fillText("Taux Victoires\n\n\n\nK/M", 440, 440)

                        ctx.font = '50px Burbank Big Cd Bk'
                        ctx.fillText(`${stats.duo.wins}\n\n${stats.duo.matches}`, 80, 490, 175)
                        ctx.fillText(`${stats.duo.kills}\n\n${stats.duo.kd.toFixed(2)}`, 270, 490, 175)
                        ctx.fillText(`${stats.duo.winRate.toFixed(2)}%\n\n${stats.duo.killsPerMatch.toFixed(2)}`, 440, 490, 175)
                    } else {
                        ctx.font = '40px Burbank Big Cd Bk'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 50, 510)
                    }

                    //SQUAD
                    if(stats.squad !== null) {
                        ctx.font = '25px Burbank Big Cd Bk'
                        ctx.fillText("Victoires\n\n\n\nParties", 80, 710)
                        ctx.fillText("Kills\n\n\n\nK/D", 270, 710)
                        ctx.fillText("Taux Victoires\n\n\n\nK/M", 440, 710)
    
                        ctx.font = '50px Burbank Big Cd Bk'
                        ctx.fillText(`${stats.squad.wins}\n\n${stats.squad.matches}`, 80, 760, 175)
                        ctx.fillText(`${stats.squad.kills}\n\n${stats.squad.kd.toFixed(2)}`, 270, 760, 175)
                        ctx.fillText(`${stats.squad.winRate.toFixed(2)}%\n\n${stats.squad.killsPerMatch.toFixed(2)}`, 440, 760, 175)
                    } else {
                        ctx.font = '40px Burbank Big Cd Bk'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 50, 790)
                    }
                    

                    //LTM
                    if(stats.ltm !== null) {
                        ctx.font = '25px Burbank Big Cd Bk'
                        ctx.fillText("Victoires\n\n\n\nParties", 690, 710)
                        ctx.fillText("Kills\n\n\n\nK/D", 890, 710)
                        ctx.fillText("Taux Victoires\n\n\n\nK/M", 1080, 710)

                        ctx.font = '50px Burbank Big Cd Bk'
                        ctx.fillText(`${stats.ltm.wins}\n\n${stats.ltm.matches}`, 710, 760, 175)
                        ctx.fillText(`${stats.ltm.kills}\n\n${stats.ltm.kd.toFixed(2)}`, 890, 760, 175)
                        ctx.fillText(`${stats.ltm.winRate.toFixed(2)}%\n\n${stats.ltm.killsPerMatch.toFixed(2)}`, 1080, 760, 175)
                    } else {
                        ctx.font = '40px Burbank Big Cd Bk'
                        ctx.fillText("Aucunes statistiques n'as été trouvées", 680, 790)
                    }

                    const img = new Discord.MessageAttachment(canvas.toBuffer(), 'stats.png')
                    embed.setTitle(`Statistiques de ${data.account.name} sur ${emoji[collected.array()[0].emoji.id].name}`)
                    .attachFiles(img)
                    .setImage("attachment://stats.png")
                    .setDescription("")
                    .setColor("#bf9322")
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