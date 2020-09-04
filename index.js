const Discord = require("discord.js");
const fs = require("fs");
const utils = require("./utils.js");
const schedule = require('node-schedule');

const bot = new Discord.Client();

require("dotenv").config()

const data = require('./functions/dataFortnite.js');

bot.commands = new Discord.Collection();

// Enregistrement des évènements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    try {
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        bot.on(eventName, event.bind(null, bot));
        console.info(`${eventName} event has been successfully loaded !`);
    } catch (e) {
        console.error(`Error when loading ${file} !`);
        console.error(e);
    }
}
console.log(" ");

// Enregistrement des commandes
let commandFolder = fs.readdirSync('./commands');

commandFolder.forEach(file => {
    if (file.endsWith('.js')) {
        utils.importFile(bot, `commands/${file}`);
    } else {
        utils.cycleDir(bot, `./commands/${file}`);
    }
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        
    } catch (e) {
        console.error(`Error when loading ${file} !`);
        console.error(e);
    }
}

bot.login(process.env.discordToken);

schedule.scheduleJob('*/20 * * * * *', function() {
    data.reloadData(bot)
    bot.user.setActivity(`${bot.guilds.cache.size} serveurs | >help`, {type: 'LISTENING'})
});

schedule.scheduleJob('5 0 0 * * *', function() {
    data.reloadShop(bot)
})

schedule.scheduleJob('*/1 * * * *', function() {
    data.reloadShop(bot)
})