const Discord = require("discord.js");
const humanize = require('humanize-duration');
const { Bot } = require("..");

module.exports = {
    name: "info",
    execute(message, args) {
        const param = { language: 'fr', round: true, delimiter: " ", largest: 2 };
        
        const embed = new Discord.MessageEmbed()
        .setAuthor("Informations "+Bot.user.username)
        .setThumbnail(Bot.user.displayAvatarURL())
        .addField("Versions Logiciel/Librairies", `NodeJS : *${process.version}*\nDiscord.js : *${Discord.version}*`, true)
        .addField("Bot", `OS : *${process.platform}*\nRAM : *${(process.memoryUsage().rss/1e6).toFixed(2)}Mo*\nUptime : *${humanize(process.uptime()*1e3, param)}*\nPing : *${Date.now() - message.createdTimestamp}ms*`, true)
        .addField("Bot Stats", `${Bot.guilds.cache.size} serveurs\n${Bot.users.cache.size} utilisateurs\n${Bot.channels.cache.size} salons`)
        .addField("Liens Utiles", "[Invitez moi !](https://discord.com/oauth2/authorize?client_id=739849791168577608&scope=bot&permissions=322624)\n[Serveur Discord](https://discord.gg/7XyNM4p)", true)
        .addField("Développeur", Bot.users.cache.get("340212760870649866").tag, true)
        .setColor("#0078ff")
        .setTimestamp()
        .setFooter(`Commande faite par ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        return message.channel.send(embed);
    }
}