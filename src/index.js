const Discord = require("discord.js");
const fs = require("fs");
const { join } = require('path');
const chalk = require('chalk');

const bot = new Discord.Client();

//const data = require('./functions/dataFortnite.js');
(async () => {

    // Login to Discord
    require("dotenv").config()
    await bot.login(process.env.discordToken);

    // Register Discord Events
    const eventFiles = fs.readdirSync(join(__dirname, 'events')).filter(file => file.endsWith('.js'));
    for(const file of eventFiles) {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        try {
            bot.on(eventName, event.bind(null))
        }
        catch(e) {
            console.log(`${chalk.red('FAILED EVENT')} ${eventName}`)
        }
        console.log(`${chalk.green('ADD EVENT')} ${eventName}`)
    }

    console.log(" ");

    // Register CLient Commands
    bot.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        if(file.endsWith('.js')) {
            try {
                const command = require(join(__dirname, 'commands', file))
                if(bot.commands.has(command.name)) console.log(`${chalk.yellow('WARN')} ${command.name} already exist !`);
                bot.commands.set(command.name, command);
                console.log(`${chalk.green('ADD')} ${command.name} command is registered !`);
            }
            catch(e) {
                console.log(`${chalk.red('ERROR')} with ${file} !\n=> ${e}`);
            }
        }
    }
})();

module.exports = {
    Kevin: require('../ressources/index.js'),
    Bot: bot
}