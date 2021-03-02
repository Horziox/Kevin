const Discord = require("discord.js");

module.exports = {
    name: "map",
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        .setTitle("Map Battle Royale")
        .setImage("https://fortnite-api.com/images/map_fr.png")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor('#0078ff')
        return message.channel.send(embed);
    }
}