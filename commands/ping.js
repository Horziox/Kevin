const Discord = require("discord.js");

module.exports = {
    name: "ping",
    execute(message, args, bot, prefix) {
        message.reply(`${Date.now() - message.createdTimestamp}ms. Discord : ${bot.ws.ping}ms <:kevin:749975878297059408>`);
    }
}