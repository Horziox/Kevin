const Canvas = require("canvas");
const fs = require('fs');
const path = require("path");

const rarities = require("../../assets/rarity.json");

module.exports = {

    //////////////////////FORTNITE-API.COM////////////////////////////////////////
    async generateShop(data) {
        return new Promise(async(resolve, reject) => {
            let canvasHeight = 0;
            if(data.featured !== null && data.featured.entries.length > 0) canvasHeight += Math.floor(data.featured.entries.length/4) * 275 + 256

            if(data.daily !== null && data.daily.entries.length > 0) canvasHeight += Math.floor(data.daily.entries.length/4) * 275 + 256
            if(data.featured !== null && data.daily !== null) canvasHeight += 106

            if(data.specialFeatured != null && data.specialFeatured.entries.length > 0) canvasHeight += Math.floor(data.specialFeatured.entries.length/4) * 275 + 546
            if(data.specialDaily != null && data.specialDaily.entries.length > 0) canvasHeight += Math.floor(data.specialDaily.entries.length/4) * 275 + 546

            const canvas = Canvas.createCanvas(1432, canvasHeight+554);
            const ctx = canvas.getContext('2d');
            const background = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 5, canvas.width/2, canvasHeight/2, canvas.height);
            background.addColorStop(0,'#0078ff')
            background.addColorStop(1,'#0049c2')
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //const vbuck = await Canvas.loadImage(path.join(__dirname, '../../assets/vbuck.png'));
            //const box = await Canvas.loadImage(path.join(__dirname, '../../assets/itemsbox.png'));

            //EN TETE
            const date = new Date(data.date);
            ctx.font = "italic 73px Burbank Big Rg Bk";
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = "left";
            const boutique = ctx.measureText("BOUTIQUE").width
            ctx.font = "italic 49px Burbank Big Rg Bk";
            const measure = ctx.measureText(date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()).width
            let left = canvas.width/2 - ((boutique+measure+24)/2)
            ctx.font = "italic 73px Burbank Big Rg Bk";
            ctx.fillText("BOUTIQUE", left, 148);
            ctx.font = "italic 49px Burbank Big Rg Bk";
            ctx.fillStyle = '#87EEFA';
            const stringDate = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
            ctx.fillText(stringDate.toUpperCase(), left+boutique+24, 139);

            //Shop Data
            let decalLeft = 60
            let decalHeight = 306
            let nbImage = 1
            let e = 0
            let shopType = 'featured'
            ctx.fillStyle = '#ffffff';
            if(data[shopType] == null) {
                shopType = 'daily'
                ctx.fillText(data.daily.name.toUpperCase(), 57, 281);
            } else {
                ctx.fillText(data.featured.name.toUpperCase(), 57, 281);
            }
            while(e !== data[shopType].entries.length) {

                ctx.globalAlpha = 1;

                const lineaire = ctx.createLinearGradient(decalLeft+155, decalHeight-75, decalLeft+155, decalHeight+256);
                const linear = ctx.createLinearGradient(decalLeft+155, decalHeight, decalLeft+155, decalHeight+256);

                let rare = data[shopType].entries[e].items[0].rarity.value

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

                /*if(data[shopType].entries[e].items.length > 1 && data[shopType].entries[e].bundle == null) {
                    let i = 1;
                    let boxHeight = 132;
                    while(i < data[shopType].entries[e].items.length && i <= 5) {
                        ctx.globalAlpha = 0.25;
                        ctx.drawImage(box, decalLeft+6, decalHeight+boxHeight, 42, 48);
                        ctx.globalAlpha = 1;
                        const cos = await Canvas.loadImage(data[shopType].entries[e].items[i].images.smallIcon);
                        ctx.drawImage(cos, decalLeft+6, decalHeight+boxHeight, 42, 42);
                        boxHeight = boxHeight - 42
                        i++  
                    }
                }*/

                ctx.globalAlpha = 1;

                let cosmetic;
                if(data[shopType].entries[e].bundle != null && data[shopType].entries[e].bundle.image != null) cosmetic = await Canvas.loadImage(data[shopType].entries[e].bundle.image)
                else if(data[shopType].entries[e].items[0].images.featured !== null) cosmetic = await Canvas.loadImage(data[shopType].entries[e].items[0].images.featured)
                else cosmetic = await Canvas.loadImage(data[shopType].entries[e].items[0].images.icon)

                if(data[shopType].entries[e].items[0].type.value == 'emote') ctx.drawImage(cosmetic, decalLeft+69, decalHeight, 172, 172);
                else if(data[shopType].entries[e].items[0].type.value == 'pickaxe') ctx.drawImage(cosmetic, decalLeft+60, decalHeight, 190, 190);
                else if(data[shopType].entries[e].items[0].type.value == 'wrap') {
                    if(data[shopType].entries[e].items[0].images.featured == null) ctx.drawImage(cosmetic, decalLeft+36, decalHeight-27, 256, 256);
                    else {
                        ctx.drawImage(cosmetic, decalLeft+24, decalHeight, 184, 184);
                        cosmetic = await Canvas.loadImage(data[shopType].entries[e].items[0].images.icon)
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

                //console.log(path.join(__dirname, '../../assets/vbuck.png'))
                ctx.drawImage(vbuck, decalLeft+275, decalHeight+232, 29, 24);

                ctx.textAlign = "center";
                ctx.fillStyle = '#ffffff';
                let fontSize = 25;
                ctx.font = `${fontSize}px Burbank Big Rg Bk`;
                let name;
                if(data[shopType].entries[e].bundle == null || data[shopType].entries[e].bundle.name == null) name = data[shopType].entries[e].items[0].name
                else name = data[shopType].entries[e].bundle.name
                let measure = ctx.measureText(name.toUpperCase()).width
                while (measure > 286) {
                    fontSize = fontSize - 1
                    ctx.font = `${fontSize}px Burbank Big Rg Bk`
                    measure = ctx.measureText(name.toUpperCase()).width
                }
                ctx.fillText(name.toUpperCase(), decalLeft+155, decalHeight+219);

                ctx.font = "16px Burbank Big Rg Bk";
                ctx.textAlign = "right";
                if(data[shopType].entries[e].regularPrice !== data[shopType].entries[e].finalPrice) {
                    ctx.fillText(data[shopType].entries[e].finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "), decalLeft+268, decalHeight+249);
                    ctx.globalAlpha = 0.5;
                    const measureFinal = ctx.measureText(data[shopType].entries[e].finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")).width
                    ctx.font = "14px Burbank Big Rg Bk";
                    const measureRegular = ctx.measureText(data[shopType].entries[e].regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")).width
                    ctx.fillText(data[shopType].entries[e].regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "), decalLeft+ 262 - measureFinal, decalHeight+249);
                    ctx.textAlign = "left";
                    ctx.fillRect(decalLeft+310-measureRegular-measureFinal-52, decalHeight+244, measureRegular+9, 2);
                    ctx.resetTransform();
                } else ctx.fillText(data[shopType].entries[e].finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "), decalLeft+268, decalHeight+249);

                if(data[shopType].entries[e].items[0].shopHistory.length == 1) {
                    ctx.textAlign = "left";
                    ctx.globalAlpha = 1;
                    ctx.font = "16px Burbank Big Rg Bd";
                    ctx.fillStyle = '#fdff3d';
                    ctx.fillText("NOUVEAU !", decalLeft+6, decalHeight+249)
                }

                decalLeft = decalLeft + 334
                nbImage++

                e++

                if(e == data[shopType].entries.length && shopType == 'featured' && data.daily != null) {
                    ctx.textAlign = "left";
                    ctx.globalAlpha = 1;
                    ctx.font = "49px Burbank Big Rg Bk";
                    ctx.fillStyle = '#ffffff';
                    shopType = 'daily'
                    ctx.fillText(data[shopType].name.toUpperCase(), 57, decalHeight+382);
                    nbImage = 1
                    decalLeft = 60
                    decalHeight = decalHeight + 407
                    e = 0
                }

                if(e == data[shopType].entries.length && (shopType == 'daily' || shopType == 'featured') && data.specialFeatured != null) {
                    ctx.textAlign = "left";
                    ctx.globalAlpha = 1;
                    ctx.font = "49px Burbank Big Rg Bk";
                    ctx.fillStyle = '#ffffff';
                    shopType = 'specialFeatured'
                    if(data[shopType].name != null) ctx.fillText(data[shopType].name.toUpperCase(), 57, decalHeight + 382);
                    nbImage = 1
                    decalLeft = 60
                    decalHeight = decalHeight + 407
                    e = 0
                }

                if(e == data[shopType].entries.length && (shopType == 'specialFeatured' || shopType == 'daily' || shopType == 'featured') && data.specialDaily != null) {
                    ctx.textAlign = "left";
                    ctx.globalAlpha = 1;
                    ctx.font = "49px Burbank Big Rg Bk";
                    ctx.fillStyle = '#ffffff';
                    shopType = 'specialDaily'
                    if(data[shopType].name != null) ctx.fillText(data[shopType].name.toUpperCase(), 57, decalHeight + 382);
                    nbImage = 1
                    firstDecal = 752
                    decalLeft = 60
                    decalHeight = decalHeight + 407
                    e = 0
                }

                if(nbImage == 5) {
                    nbImage = 1
                    decalLeft = 60
                    decalHeight = decalHeight + 280
                }
            }
            const end = fs.createWriteStream(`./final/shop.png`)
            const stream = canvas.createPNGStream().pipe(end);
            return stream.on('finish', () => resolve('./final/shop.png'));
        })
    },
}