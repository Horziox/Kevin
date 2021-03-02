const Discord = require("discord.js");
const { Bot, Kevin } = require("..");

module.exports = {
    name: "help",
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        .setTitle("Liste de mes commandes")
        .setThumbnail(Bot.user.displayAvatarURL())
        .setColor('#bf9322')
        .addField("Générales", `**${Kevin.Param.prefix}help** Affiche ce message ! :tada:\n**${Kevin.Param.prefix}botinfo** Affiche des informations concernant le bot:\n**${Kevin.Param.prefix}invite** Invitez moi !`)
        .addField("Blog", `**${Kevin.Param.prefix}blog** Affichez dynamiquement les 5 derniers blogs officiels de Fortnite`, true)
        .addField("Cosmétiques", `**${Kevin.Param.prefix}cos** Permet de rechercher des cosmétiques du Battle Royale`)
        .addField("Map", `**${Kevin.Param.prefix}map** Montre la map du Battle Royale`, true)
        .addField("News", `**${Kevin.Param.prefix}news** Donne les actualités en jeux (\`br\`, \`creatif\` ou \`stw\`)`, true)
        .addField("Shop", `**${Kevin.Param.prefix}shop** Affiche le shop du Battle Royale`, true)
        .addField("Stats", `**${Kevin.Param.prefix}stats** Affiche le menu de stats`, true)
        .addField("Status", `**${Kevin.Param.prefix}status** Récupère le status des serveurs`, true)
        .addField("Clé AES", `**${Kevin.Param.prefix}aes** Récupérez la clé principale et les clés des fichiers PAK dynamiques (leaker)`, true)
        .addField("Leak", `**${Kevin.Param.prefix}leak** Affiche les cosmétiques disponibles dans les fichiers du jeu depuis la dernière mise à jour`, true)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        return message.channel.send(embed);
    }
}
