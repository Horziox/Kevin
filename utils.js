const fs = require("fs");
const path = require("path");

module.exports = {

    importFile(bot, filePath) {
        try {
            const command = require(`./${filePath}`);
            if (bot.commands.has(command.name)) console.warn(`Command ${command.name} has already been registered ! Register multiples files with the same command name will ignore all others previously registered commands !`);
            bot.commands.set(command.name, command);
            console.info(`Command ${command.name} in ./${filePath} has been successfully loaded !`);
        } catch (e) {
            console.error(`Error when loading ${filePath} !`);
            console.error(e);
        }
    },

    cycleDir(bot, dir) {
        fs.readdirSync(dir).forEach(file => {
            let fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                this.cycleDir(bot, fullPath);
            } else {
                this.importFile(bot, fullPath);
            }
        });
    },

}