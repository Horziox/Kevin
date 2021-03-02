const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "status",
    async execute(message, args) {

        const trad = {
            "operational": {
                name: "Opérationnel",
                emoji: "<:statusok:801132528580296754>",
                color: "#14b53f"
            },
            "degraded_performance": {
                name: "Performance dégradée",
                emoji: "<:statuslow:801132500377665557>",
                color: "#daf018"
            },
            "partial_outage": {
                name: "Panne partielle",
                emoji: "<:statusfailure:801132466608799754>",
                color: "#e87510"
            },
            "major_outage": {
                name: "Panne majeure",
                emoji: "<:statusmajorissue:801132448544981062>",
                color: "#b51212"
            },
            "under_maintenance": {
                name: "En maintenance",
                emoji: "<:statusmaintenance:801132429791330364>",
                color: "#1266b5"
            },

            "Website": "Site Web",
            "Game Services": "Services de jeux",
            "Login": "Connexion",
            "Parties, Friends, and Messaging": "Parties, Amis, et Messages",
            "Voice Chat": "Chat vocal",
            "Matchmaking": "Matchmaking",
            "Stats and Leaderboards": "Classement et Statistiques",
            "Item Shop": "Boutique",
            "Houseparty video chat": "Houseparty",
            "Fortnite Crew": "Club Fortnite"
        };

        await axios({
            method: 'get',
            url: 'https://ft308v428dv3.statuspage.io/api/v2/summary.json'
        }).then(async function(response) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Fortnite : ${trad[response.data.components.find(e => e.name == "Fortnite").status].name}`)
            .setColor(trad[response.data.components.find(e => e.name == "Fortnite").status].color)

            let text = "**Status**";
            response.data.components.find(e => e.name == "Fortnite").components.forEach(e => {
                text = text+`\n${trad[response.data.components.find(i => i.id == e).status].emoji} ${trad[response.data.components.find(i => i.id == e).name]}`
            });
            text += "\n\n**Désignations**\n<:statusok:801132528580296754> Opérationnel\n<:statuslow:801132500377665557> Performance dégradée\n<:statusfailure:801132466608799754> Panne partielle\n<:statusmajorissue:801132448544981062> Panne majeure\n<:statusmaintenance:801132429791330364> En maintenance";
            embed.setDescription(text+"\n\n[Epic Games status](https://status.epicgames.com/)")
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed);
        })
    }
}