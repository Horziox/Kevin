const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

module.exports = {
    async genratateShop(data) {
        return new Promise(async(resolve, reject) => {
            const background = await Canvas.loadImage("./assets/background.png")
            let canvasHeight;
            let nbDaily = data.daily.entries.length
            let nbFeatured = data.featured.entries.length
            if (nbDaily > nbFeatured) canvasHeight = nbDaily;
            else canvasHeight = nbFeatured;
            canvasHeight = Math.ceil(canvasHeight/3) * 310 + 400

            let canvas = Canvas.createCanvas(1280, canvasHeight);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            //EN TETE
            let date = new Date(data.date);
            ctx.font = "100px Burbank Big Cd Bk";
            ctx.fillStyle = '#ffffff';
            let measure = ctx.measureText(date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })).width
            let left = (640 - (measure / 2))
            let stringDate = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            ctx.fillText(stringDate.charAt(0).toUpperCase() + stringDate.substring(1).toLowerCase(), left, 150);
            ctx.font = "80px Burbank Big Cd Bk";
            ctx.fillText(data.featured.name, 210, 300);
            ctx.fillText(data.daily.name, 800, 300);

            //Shop Data
            let decalLeft = 20
            let firstDecal = 20
            let decalHeight = 350
            let nbImage = 1
            let e = 0
            let shopType = 'featured'
            while(e !== data[shopType].entries.length) {
                try {
                    box = await Canvas.loadImage(`./assets/box/box_${data[shopType].entries[e].items[0].rarity.value}.png`)
                } catch {
                    box = await Canvas.loadImage(`./assets/box/box_common.png`)
                }

                var cosmetic;
                if(data[shopType].entries[e].bundle !== null && data[shopType].entries[e].bundle.image !== null) cosmetic = await Canvas.loadImage(data[shopType].entries[e].bundle.image)
                if(data[shopType].entries[e].items[0].images.featured !== null) cosmetic = await Canvas.loadImage(data[shopType].entries[e].items[0].images.featured)
                else cosmetic = await Canvas.loadImage(data[shopType].entries[e].items[0].images.icon)

                ctx.drawImage(box, decalLeft, decalHeight, 200, 300)
                ctx.drawImage(cosmetic, decalLeft-15, decalHeight+30, 230, 230)

                ctx.fillStyle = "black";
                ctx.globalAlpha = 0.20;
                ctx.fillRect(decalLeft, decalHeight+200, 200, 100);
                ctx.globalAlpha = 1;
                ctx.fillStyle = "#000724";
                ctx.fillRect(decalLeft, decalHeight+260, 200, 40);

                if(data[shopType].entries[e].items.length > 1) {
                    let i = 1;
                    let boxHeight = 0;
                    while(i < data[shopType].entries[e].items.length) {
                        let cos = await Canvas.loadImage(data[shopType].entries[e].items[i].images.smallIcon)
                        ctx.drawImage(cos, decalLeft+150, decalHeight+boxHeight, 50, 50)
                        boxHeight = boxHeight + 50;
                        i++  
                    }
                }

                //Name
                ctx.fillStyle = "#ffffff";
                let fontSize = 30;
                ctx.font = fontSize + 'px Burbank Big Cd Bk'
                let cosName;
                if(data[shopType].entries[e].bundle !== null && data[shopType].entries[e].bundle.name !== null) cosName = data[shopType].entries[e].bundle.name
                else cosName = data[shopType].entries[e].items[0].name
                let measure = ctx.measureText(cosName).width
                while (measure > 190) {
                    fontSize = fontSize - 1
                    ctx.font = fontSize + 'px Burbank Big Cd Bk'
                    measure = ctx.measureText(cosName).width
                }
                let left = decalLeft + (100 - (measure / 2))
                ctx.fillText(cosName, left, decalHeight+230);
                ctx.strokeText(cosName, left, decalHeight+230);
                //Type
                ctx.font = "20px Burbank Big Cd Bk";
                ctx.fillStyle = '#ffffff';
                let nb = data[shopType].entries[e].items.length;
                nb = nb - 1;
                if(data[shopType].entries[e].bundle !== null) finalName = "Pack de " + nb + " items"
                else finalName = data[shopType].entries[e].items[0].type.displayValue;
                measure = ctx.measureText(finalName).width;
                left = decalLeft + (100 - (measure / 2));
                ctx.fillText(finalName, left, decalHeight+250);
                ctx.strokeText(finalName, left, decalHeight+250);
                //Prix
                const vbucks = await Canvas.loadImage('./assets/vbucks.png')
                ctx.font = "25px Burbank Big Cd Bk";
                ctx.fillStyle = '#ffffff';
                measure = ctx.measureText(data[shopType].entries[e].finalPrice).width
                left = decalLeft + (100 - (measure / 2) - 17)
                ctx.drawImage(vbucks, left + measure + 3, decalHeight+267, 25, 25);
                ctx.fillText(data[shopType].entries[e].finalPrice, left, decalHeight+288)

                if(data[shopType].entries[e].banner !== null) {
                    const texture = await Canvas.loadImage('./assets/new.png')
                    ctx.font = "15px Burbank Big Cd Bk";
                    ctx.fillStyle = '#ffffff';
                    measure = ctx.measureText(data[shopType].entries[e].banner.value.toUpperCase()).width
                    ctx.drawImage(texture, decalLeft-4, decalHeight-5, measure+50, 40)
                    ctx.fillText(data[shopType].entries[e].banner.value.toUpperCase(), decalLeft+16, decalHeight+20)
                }


                decalLeft = decalLeft + 205
                nbImage++

                if(nbImage == 4) {
                    nbImage = 1
                    decalLeft = firstDecal
                    decalHeight = decalHeight + 310
                }
                e++

                if(e === data[shopType].entries.length && shopType == 'featured') {
                    nbImage = 1
                    shopType = 'daily'
                    firstDecal = 645
                    decalLeft = firstDecal
                    decalHeight = 350
                    e = 0
                }
            }
            let end = fs.createWriteStream(`./final/shop.png`)
            let stream = canvas.createPNGStream().pipe(end);
            stream.on('finish', () => {
                resolve('./final/shop.png')
            })
        })
    }
}