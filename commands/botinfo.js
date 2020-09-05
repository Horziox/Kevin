const Discord = require("discord.js");

module.exports = {
    name: "botinfo",
    execute(message, args, bot, prefix) {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Informations "+bot.user.username)
        .setThumbnail(bot.user.displayAvatarURL())
        .addField("Versions Logiciel/Librairies", `NodeJS : \`\`${process.version}\`\`\nDiscord.js : \`\`${Discord.version}\`\``, true)
        .addField("Utilisation Ressources", "OS : "+process.platform+"\nUtilisation RAM : ``"+`${(process.memoryUsage().heapUsed/1000000).toFixed(2)}`+" Mo``", true)
        .addField("Ping", `Bot : ${Date.now() - message.createdTimestamp}ms\nDiscord : ${bot.ws.ping}ms`, true)
        .addField("Bot Stats", `${bot.guilds.cache.size} serveurs\n${bot.users.cache.size} utilisateurs\n${bot.channels.cache.size} salons`, true)
        .addField("Liens Utiles", "[Invitez moi !](https://discord.com/oauth2/authorize?client_id=739849791168577608&scope=bot&permissions=322624)\n[Rejoignez mon serveur de support !](https://discord.gg/7XyNM4p)")
        .addField("Développeur", bot.users.cache.get("340212760870649866").tag, true)
        .setColor("#bf9322")
        .setTimestamp()
        .setFooter(`Commande faite par ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        message.channel.send({embed}); 
    }
}
