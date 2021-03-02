const Canvas = require("canvas");
const fs = require('fs');

const rarities = require("../../assets/rarity.json");

module.exports = {
    async generateNewCos(data) {
        return new Promise(async(resolve, reject) => {

            const canvas = Canvas.createCanvas(1456, Math.ceil(data.items.length/4) * 275 + 600);
            const ctx = canvas.getContext('2d');
            const background = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 5, canvas.width/2, canvas.height/2, canvas.height);
            background.addColorStop(0,'#5a2e84')
            background.addColorStop(1,'#35135f')
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //EN TETE
            ctx.font = "italic 73px Burbank Big Rg Bk";
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = "left";
            const boutique = ctx.measureText("LEAKS").width
            ctx.font = "italic 49px Burbank Big Rg Bk";
            const measure = ctx.measureText("OBJETS DATAMINÉS").width
            let left = canvas.width/2 - ((boutique+measure+24)/2)
            ctx.font = "italic 73px Burbank Big Rg Bk";
            ctx.fillText("LEAKS", left, 148);
            ctx.font = "italic 49px Burbank Big Rg Bk";
            ctx.fillStyle = '#ff2ea9';
            ctx.fillText("OBJETS DATAMINÉS", left+boutique+24, 139);

            let decalLeft = 60
            let decalHeight = 281
            let nbImage = 1
            let i = 0;

            while(i != data.items.length) {
                const item = data.items[i];

                const lineaire = ctx.createLinearGradient(decalLeft+155, decalHeight-75, decalLeft+155, decalHeight+256);
                const linear = ctx.createLinearGradient(decalLeft+155, decalHeight, decalLeft+155, decalHeight+256);

                const rare = item.rarity.value

                if(rarities[rare] != undefined) {
                    if(rarities[rare][0] !== null) {
                        lineaire.addColorStop(0, rarities[rare][0])
                        lineaire.addColorStop(1, rarities[rare][1])
                        linear.addColorStop(0, rarities[rare][0])
                        linear.addColorStop(1, rarities[rare][1])
                        ctx.fillStyle = lineaire;
                        ctx.fillRect(decalLeft, decalHeight, 310, 256); 
                    }
                } else {
                    lineaire.addColorStop(0, "#ffffff")
                    lineaire.addColorStop(1, "#808080")
                    linear.addColorStop(0, "#ffffff")
                    linear.addColorStop(1, "#808080")
                    ctx.fillStyle = lineaire;
                    ctx.fillRect(decalLeft, decalHeight, 310, 256);
                }
    
                ctx.fillStyle = "black";
                ctx.globalAlpha = 0.2;
                ctx.fillRect(decalLeft, decalHeight, 310, 256);
    
                ctx.globalAlpha = 1;
    
                let cosmetic;
                if(item.images.featured !== null) cosmetic = await Canvas.loadImage(item.images.featured)
                else if(item.images.icon !== null) cosmetic = await Canvas.loadImage(item.images.icon)
                else cosmetic = await Canvas.loadImage(item.images.smallIcon)
    
                if(item.type.value == 'emote' || item.type.value == 'backpack') ctx.drawImage(cosmetic, decalLeft+69, decalHeight, 172, 172);
                else if(item.type.value == 'music') ctx.drawImage(cosmetic, decalLeft+62, decalHeight, 186, 186);
                else if(item.type.value == 'emoji') ctx.drawImage(cosmetic, decalLeft+95, decalHeight+30, 120, 120);
                else if(item.type.value == 'spray') ctx.drawImage(cosmetic, decalLeft+75, decalHeight+12, 160, 160);
                else if(item.type.value == 'pickaxe' || item.type.value == 'loadingscreen' || item.type.value == 'glider') {
                    ctx.drawImage(cosmetic, decalLeft+60, decalHeight, 190, 190);
                }
                else if(item.type.value == 'wrap') {
                    if(item.images.featured == null) ctx.drawImage(cosmetic, decalLeft+36, decalHeight-27, 256, 256);
                    else {
                        ctx.drawImage(cosmetic, decalLeft+24, decalHeight, 184, 184);
                        cosmetic = await Canvas.loadImage(item.images.icon)
                        ctx.drawImage(cosmetic, decalLeft+138, decalHeight+54, 138, 138);
                    }
                }
                else ctx.drawImage(cosmetic, decalLeft+27, decalHeight, 256, 256);
    
                ctx.globalAlpha = 0.75;
    
                ctx.fillStyle = linear;
                ctx.beginPath();
                ctx.moveTo(decalLeft, decalHeight+184);
                ctx.lineTo(decalLeft+310, decalHeight+172);
                ctx.lineTo(decalLeft+310, decalHeight+256);
                ctx.lineTo(decalLeft, decalHeight+256);
                ctx.fill();
    
                ctx.globalAlpha = 0.65;
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo(decalLeft, decalHeight+190);
                ctx.lineTo(decalLeft+310, decalHeight+184);
                ctx.lineTo(decalLeft+310, decalHeight+256);
                ctx.lineTo(decalLeft, decalHeight+256);
                ctx.fill();
    
                ctx.globalAlpha = 1;
                ctx.fillRect(decalLeft, decalHeight+232, 310, 24)
    
                ctx.textAlign = "center";
                ctx.fillStyle = '#ffffff';
                let fontSize = 25;
                ctx.font = `italic ${fontSize}px Burbank Big Rg Bk`;
                let name = item.name
                let measure = ctx.measureText(name.toUpperCase()).width
                while (measure > 286) {
                    fontSize = fontSize - 1
                    ctx.font = `italic ${fontSize}px Burbank Big Rg Bk`
                    measure = ctx.measureText(name.toUpperCase()).width
                }
                ctx.fillText(name.toUpperCase(), decalLeft+155, decalHeight+219);

                ctx.font = "italic 16px Burbank Big Rg Bk";

                ctx.fillStyle = rarities[rare][1];
                ctx.textAlign = "left";
                if(item.type.displayValue) ctx.fillText(item.type.displayValue.toUpperCase(), decalLeft+6, decalHeight+249);
                else ctx.fillText(item.type.value.toUpperCase(), decalLeft+6, decalHeight+249);

    
                decalLeft += 334
                nbImage++

                if(nbImage == 5) {
                    nbImage = 1
                    decalLeft = 60
                    decalHeight += 280
                }
                i++
            }
            const end = fs.createWriteStream(`./final/leaks.png`)
            const stream = canvas.createPNGStream().pipe(end);
            return stream.on('finish', () => resolve('./final/leaks.png'));
        })
    }
}