const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "blog",
    cooldown: 10,
    havePermissions: true,
    async execute(message, args, bot, prefix) {
        axios({
            method: 'get',
            url: "https://www.epicgames.com/fortnite/api/blog/getPosts?postsPerPage=4&offset=0&locale=fr&rootPageSlug=blog"
        }).then(async function(response) {
            let embed = new Discord.MessageEmbed()
            .setTitle(response.data.blogList[0].title)
            .setDescription(response.data.blogList[0].short.replace( /(<([^>]+)>)/ig, '').split('&nbsp;').join(" ")+`\n\n[Lien de l'article](https://www.epicgames.com/fortnite${response.data.blogList[0].urlPattern})\nArticle 1/5`)
            .setImage(response.data.blogList[0].shareImage)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setColor('#bf9322')
            const msg = await message.channel.send(embed)

            await msg.react('1️⃣');
            await msg.react('2️⃣');
            await msg.react('3️⃣');
            await msg.react('4️⃣');
            await msg.react('5️⃣');

            const filter = (user) => user.id = message.author.id
            const collector = msg.createReactionCollector(filter, {time: 60000})

            collector.on('collect', async m => {
                await m.users.remove(message.author.id);
                const num = {"1️⃣": 0,"2️⃣": 1,"3️⃣": 2,"4️⃣": 3,"5️⃣": 4,};
                embed.setTitle(response.data.blogList[num[m.emoji.name]].title)
                .setDescription(response.data.blogList[num[m.emoji.name]].short.replace( /(<([^>]+)>)/ig, '').split('&nbsp;').join(" ")+`\n\n[Lien de l'article](https://www.epicgames.com/fortnite${response.data.blogList[num[m.emoji.name]].urlPattern})\nArticle ${num[m.emoji.name]+1}/5`)
                .setImage(response.data.blogList[num[m.emoji.name]].shareImage)
                .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setColor('#bf9322')
                await msg.edit(embed)
            });
            collector.on('end', async c => await msg.reactions.removeAll())
        })
    }
}