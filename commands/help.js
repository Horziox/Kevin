const Discord = require("discord.js");

module.exports = {
    name: "help",
    execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        .setTitle("Liste de mes commandes")
        .setThumbnail(bot.user.displayAvatarURL())
        .setColor('#bf9322')
        .addField("Générales", `**${prefix}help** Affiche ce message ! :tada:\n**${prefix}botinfo** Affiche des informations concernant le bot`)
        .addField("Info", `**${prefix}info** Permet de rechercher des cosmétiques du Battle Royale`)
        .addField("News", `**${prefix}news** Donne les actualités en jeux (\`br\`, \`creatif\` ou \`stw\`)`, true)
        .addField("Stats", `**${prefix}stats** Affiche le menu de stats`, true)
        .addField("Shop", `**${prefix}shop** Affiche le shop du Battle Royale`, true)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        message.channel.send(embed)
    }
}
