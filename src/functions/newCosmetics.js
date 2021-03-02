const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

module.exports = {
    async generateNewCos(data) {
        return new Promise(async(resolve, reject) => {
            const background = await Canvas.loadImage("./assets/background.png")
            let canvasHeight = data.items.length
            canvasHeight = Math.ceil(canvasHeight/6) * 310 + 400

            let canvas = Canvas.createCanvas(1280, canvasHeight);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            //EN TETE
            ctx.font = "100px Burbank Big Cd Bk";
            ctx.fillStyle = '#ffffff';
            let measure = ctx.measureText("Nouveaux Cosmétiques").width
            let left = (640 - (measure / 2))
            ctx.fillText("Nouveaux Cosmétiques", left, 150);
            ctx.font = "80px Burbank Big Cd Bk";
            measure = ctx.measureText(`Fortnite ${data.build.split("-")[1]}`).width
            left = (640 - (measure / 2))
            ctx.fillText(`Fortnite ${data.build.split("-")[1]}`, left, 300);

            //Shop Data
            let decalLeft = 25
            const firstDecal = 25
            let decalHeight = 350
            let e = 0
            let nbCos = 1
            while(e !== data.items.length) {
                try {
                    box = await Canvas.loadImage(`./assets/box/box_${data.items[e].rarity.value}.png`)
                } catch {
                    box = await Canvas.loadImage(`./assets/box/box_common.png`)
                }
                ctx.drawImage(box, decalLeft, decalHeight, 200, 300)

                let cosmetic;
                if(data.items[e].images.featured !== null) {
                    cosmetic = await Canvas.loadImage(data.items[e].images.featured)
                    if(data.items[e].type.value == "wrap") {
                        ctx.drawImage(cosmetic, decalLeft-15, decalHeight+5, 230, 230) 
                        cosmetic = await Canvas.loadImage(data.items[e].images.icon)
                        ctx.drawImage(cosmetic, decalLeft+125, decalHeight+160, 75, 75)
                    } 
                    else ctx.drawImage(cosmetic, decalLeft-15, decalHeight+5, 240, 240)
                } else {
                    cosmetic = await Canvas.loadImage(data.items[e].images.icon)
                    if(data.items[e].type.value == "banner" || data.items[e].type.value == "emoji") ctx.drawImage(cosmetic, decalLeft+25, decalHeight+30, 150, 150)
                    else ctx.drawImage(cosmetic, decalLeft, decalHeight+25, 200, 200)
                }

                ctx.globalAlpha = 1;
                ctx.fillStyle = "#000724";
                ctx.fillRect(decalLeft, decalHeight+225, 200, 75);

                //Name
                ctx.fillStyle = "#ffffff";
                let fontSize = 30;
                ctx.font = fontSize + 'px Burbank Big Cd Bk'
                let measure = ctx.measureText(data.items[e].name).width
                while (measure > 190) {
                    fontSize = fontSize - 1
                    ctx.font = fontSize + 'px Burbank Big Cd Bk'
                    measure = ctx.measureText(data.items[e].name).width
                }
                let left = decalLeft + (100 - (measure / 2))
                ctx.fillText(data.items[e].name, left, decalHeight+260);
                ctx.strokeText(data.items[e].name, left, decalHeight+260);
                //Type
                ctx.font = "20px Burbank Big Cd Bk";
                ctx.fillStyle = '#ffffff';
                measure = ctx.measureText(data.items[e].type.displayValue).width;
                left = decalLeft + (100 - (measure / 2));
                ctx.fillText(data.items[e].type.displayValue, left, decalHeight+285);
                ctx.strokeText(data.items[e].type.displayValue, left, decalHeight+285);

                decalLeft = decalLeft + 205

                nbCos++
                if(nbCos == 7) {
                    nbCos = 1
                    decalLeft = firstDecal
                    decalHeight = decalHeight + 310
                }
                e++
            }
            let end = fs.createWriteStream(`./final/newCos.png`)
            let stream = canvas.createPNGStream().pipe(end);
            stream.on('finish', () => {
                resolve('./final/newCos.png')
            })
        })
    }
}