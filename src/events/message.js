const Discord = require('discord.js');

const { Kevin, Bot } = require('../index.js');
const cooldowns = new Discord.Collection();

module.exports = message => {

    if(message.channel.type !== 'text') return

    if(!message.content.startsWith(Kevin.Param.prefix) || message.author.bot) return;

    const args = message.content.slice(Kevin.Param.prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase();

    const command = Bot.commands.get(commandName);

    if(!command) return;

    if(!message.channel.permissionsFor(Bot.user).has(3072)) return
    if(command.havePermissions) if(!message.channel.permissionsFor(Bot.user).has(322624)) return message.channel.send(':warning: Il me manque des permissions dans ce salon pour fonctionner correctement !\nContactez un Staff de ce serveur ou vérifiez que les permissions suivante sois cochées dans les paramètres du salon :\n\`Gérer les messages\`, \`Intégrer des liens\`, \`Joindre des fichiers\`, \`Utiliser des émojis externes\` et \`Ajouter des réactions\`')

    if(command.isDisable) return message.reply("Cette commande à été désactivée...\nPatience, elle reviendra bientôt ! :tada:");

    if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000
    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if(now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`merci d'attendre encore **${timeLeft.toFixed(0)}** seconde(s) avant de réutiliser la commande \`${command.name}\` <:kevin:749975878297059408>`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        message.reply('oups... une erreur est survenue ! <:kevin_sad:749975937210122421>');
        console.log(error);
    }
}