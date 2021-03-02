const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "aes",
    async execute(message, args) {
        await axios({
            method: 'get',
            url: "https://fortnite-api.com/v2/aes"
        }).then(async function(response) {

            const date = new Date(response.data.data.updated)

            let text = `Dernière actualisation le ${date.toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}\n\n**Clé principale**\`\`\`css\n${response.data.data.mainKey}\`\`\``;
            let textS = null;

            if(response.data.data.dynamicKeys !== null) {
                text += "\n\n**Clé dynamiques**\n";
                let e = 0;
                while(e != response.data.data.dynamicKeys.length) {
                    const test = `\n**${response.data.data.dynamicKeys[e].pakFilename}**\n\`\`\`fix\n${response.data.data.dynamicKeys[e].key}\`\`\``;
                    if((text.length + test.length) < 2048) text += test;
                    else textS += test;
                    e++
                }
            }

            if(textS != null) {
                const embed = new Discord.MessageEmbed()
                .setTitle(response.data.data.build)
                .setColor('#0078ff')
                .setDescription(text)
                await message.channel.send(embed);

                embed.setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTitle('')
                .setTimestamp()
                .setDescription(textS)

                return message.channel.send(embed);
            } else {
                const embed = new Discord.MessageEmbed()
                .setColor('#0078ff')
                .setTitle(response.data.data.build)
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setDescription(text)

                return message.channel.send(embed);
            }
        })
    }
}