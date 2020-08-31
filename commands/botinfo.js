const Discord = require("discord.js");
const package = require('../package.json');
module.exports = {
    name: "botinfo",
    execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Informations "+bot.user.username)
        .setThumbnail(bot.user.displayAvatarURL())
        .addField("Versions Logiciel/Librairies", `NodeJS : \`\`${process.version}\`\`\nDiscord.js : \`\`${Discord.version}\`\``, true)
        .addField("Utilisation Ressources", "OS : "+process.platform+"\nUtilisation RAM : ``"+`${(process.memoryUsage().heapUsed/1000000).toFixed(2)}`+" Mo``", true)
        .addField("Ping", `Bot : ${Date.now() - message.createdTimestamp}ms\nDiscord : ${bot.ws.ping}ms`, true)
        .addField("Liens Utiles", "[Invitez moi !](https://discord.com/oauth2/authorize?client_id=739849791168577608&scope=bot&permissions=322624)\n[Rejoignez mon serveur de support !](https://discord.gg/7XyNM4p)")
        .setColor("#bf9322")
        .setTimestamp()
        .setFooter(`Commande faite par ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        message.channel.send({embed}); 
    }
}
