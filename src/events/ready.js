const data = require('../functions/dataFortnite.js');

const chalk = require('chalk');
const schedule = require('node-schedule');
const { Bot, Kevin } = require('../index.js');

module.exports = async () => {
    await data.reloadShop()
    await data.reloadNewCos()
    await data.reloadData()
    await Bot.user.setActivity(`${Bot.guilds.cache.size} serveurs | ${Kevin.Param.prefix}help`, { type: 'LISTENING' })
    console.log(chalk.blue(`DISCORD CLIENT`)+` Logged in as ${Bot.user.tag}`)

    schedule.scheduleJob('10 */5 * * * *', async function() {
        await data.reloadShop()
        await data.reloadNewCos()
        await data.reloadData()
        await Bot.user.setActivity(`${Bot.guilds.cache.size} serveurs | ${Kevin.Param.prefix}help`, { type: 'LISTENING' })
    })
}