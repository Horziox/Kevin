const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "status",
    async execute(message, args) {

        const trad = {
            "operational": {
                name: "Opérationnel",
                emoji: ":white_check_mark:",
                color: "#14b53f"
            },
            "degraded_performance": {
                name: "Performance dégradée",
                emoji: ":chart_with_downwards_trend:",
                color: "#daf018"
            },
            "partial_outage": {
                name: "Panne partielle",
                emoji: ":warning:",
                color: "#e87510"
            },
            "major_outage": {
                name: "Panne majeure",
                emoji: ":x:",
                color: "#b51212"
            },
            "under_maintenance": {
                name: "En maintenance",
                emoji: ":tools:",
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
            text += "\n\n**Désignations**\n:white_check_mark: Opérationnel\n:chart_with_downwards_trend: Performance dégradée\n:warning: Panne partielle\n:x: Panne majeure\n:tools: En maintenance";
            embed.setDescription(text+"\n\n[Epic Games status](https://status.epicgames.com/)")
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            return message.channel.send(embed);
        })
    }
}