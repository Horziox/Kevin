const fs = require("fs");
const path = require("path");

module.exports = {

    importFile(bot, filePath) {
        try {
            const command = require(`./${filePath}`);
            if (bot.commands.has(command.name)) console.warn(`La commande ${command.name} est déjà enregistrée !`);
            bot.commands.set(command.name, command);
            console.info(`La commande ${command.name} dans ./${filePath} à été enregistrée !`);
        } catch (e) {
            console.error(`Erreur en chargeant ${filePath} !`);
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
    }
}