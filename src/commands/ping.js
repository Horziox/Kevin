const { Bot } = require("..");

module.exports = {
    name: "ping",
    execute(message, args) {
        return message.reply(`${Date.now() - message.createdTimestamp}ms. Discord : ${Bot.ws.ping}ms <:kevin:749975878297059408>`);
    }
}