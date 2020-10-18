const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "aes",
    execute(message, args, bot, prefix) {
        axios({
            method: 'get',
            url: "https://fortnite-api.com/v2/aes"
        }).then(function(response) {
            const date = new Date(response.data.data.updated)
            let embed = new Discord.MessageEmbed()
            .setTitle(response.data.data.build)
            .setDescription(`Dernière actualisation le ${date.toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}`)
            .addField("Clé principale", `\`${response.data.data.mainKey}\``)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setColor('#bf9322')

            if(response.data.data.dynamicKeys !== null) {
                let text = "";
                response.data.data.dynamicKeys.forEach(e => text = text + `**${e.pakFilename}**\n\`${e.key}\`\n\n`);
                embed.spliceFields
                embed.addField("Clé(s) Dynamique(s)", text)
            }
            /*response.data.data.dynamicKeys.forEach(e => {
                embed.addField(e.pakFilename, `\`${e.key}\``)
            });*/
            message.channel.send(embed)
        })
    }
}