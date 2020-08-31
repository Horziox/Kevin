const Discord = require("discord.js");

module.exports = {
    name: "invite",
    execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        .setDescription("**"+message.author.username+"**, tu peux m'inviter sur ton serveur en  cliquant [ici](https://discord.com/oauth2/authorize?client_id=739849791168577608&scope=bot&permissions=322624) et rejoindre mon serveur de support en cliquant [là](https://discord.gg/7XyNM4p) ! <:kevin:749975878297059408>")
        .setColor("#bf9322")
        .setTimestamp()
        .setFooter(`Commande faite par ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        message.channel.send(embed);
    }
}