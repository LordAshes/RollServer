import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let posX = 0;
let posY = 0;

function createImage(width, height, background)
{
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);
	return { canvas, ctx };
}

function area(canvasObj, width, height, background)
{
	console.log({ draw: "Area", x: posX, y: posY, w: width, h: height });
	canvasObj.ctx.fillStyle = background;
	canvasObj.ctx.fillRect(posX, posY, width, height);
}

function saveImage(canvasObj, filename)
{
	const buffer = canvasObj.canvas.toBuffer("image/png");
	fs.writeFileSync(`${__dirname}\\results\\${filename}.png`, buffer);
}

function textLeft(canvasObj, txt, fontName, colour, x = null)
{
	if(x != null) { posX = x; }
	canvasObj.ctx.fillStyle = colour;
	canvasObj.ctx.font = fontName;
	canvasObj.ctx.textAlign = "left";
	canvasObj.ctx.fillText(txt, posX, posY);
}

function textCenter(canvasObj, txt, fontName, colour, x = null)
{
	if(x != null) { posX = x; }
	canvasObj.ctx.fillStyle = colour;
	canvasObj.ctx.font = fontName;
	canvasObj.ctx.textAlign = "center";
	canvasObj.ctx.fillText(txt, posX, posY);
}

function textRight(canvasObj, txt, fontName, colour, x = null)
{
	if(x != null) { posX = x; }
	canvasObj.ctx.fillStyle = colour;
	canvasObj.ctx.font = fontName;
	canvasObj.ctx.textAlign = "right";
	canvasObj.ctx.fillText(txt, posX, posY);
}

function diceNums(canvasObj, dice, fontName, resetX, maxPerLine)
{
	if(resetX!=null) { posX = resetX; } else { resetX = posX; }
	let bounds = null;
	let count = 0;
	for(let die of dice)
	{
		if(count==maxPerLine) { count = 0; posX = resetX; posY += parseInt(fontName); }
		canvasObj.ctx.textAlign = "left";
		canvasObj.ctx.font = fontName;
		canvasObj.ctx.fillStyle = die.colour;
		canvasObj.ctx.fillText(die.value, posX, posY);
		count++;
		posX += 20;
	}		
}

async function diceImages(canvasObj, dice, resetX, maxPerLine)
{
	posX = resetX;
	let bounds = null;
	let count = 0;
	posY += -14;
	for(let die of dice)
	{
		if(count==maxPerLine) { count = 0; posX = resetX; posY += bounds.height+2; }
		bounds = await imageFromLeft(canvasObj, die.type+"."+die.value);
		count++;
		// posX += (bounds.width+2);
		posX += 20;
	}		
	posY += +14;
}

async function imageFromLeft(canvasObj, imageName)
{
	const image = await loadImage(`${__dirname}\\images\\${imageName}.png`);
	console.log({x: posX, y: posY, img: `${__dirname}\\images\\${imageName}.png`});
	canvasObj.ctx.drawImage(image, posX, posY);
	return { width: image.width, height: image.height };
}

async function imageFromRight(canvasObj, imageName)
{
	const image = await loadImage(`${__dirname}\\images\\${imageName}.png`);
	console.log({x: posX, y: posY, img: `${__dirname}\\images\\${imageName}.png`});
	canvasObj.ctx.drawImage(image, posX-image.width, posY);
	return { width: image.width, height: image.height };
}

function existsImage(imageName)
{
	console.log(`Exists? ${__dirname}\\images\\${imageName}.png`);
	return fs.existsSync(`${__dirname}\\images\\${imageName}.png`);
}

function divider(canvasObj, colour, width = 3, border = 0, y = null)
{
	if(y === null || y === undefined) { y = posY; }
	canvasObj.ctx.strokeStyle = colour;
	canvasObj.ctx.lineWidth = width;
	canvasObj.ctx.beginPath();
	canvasObj.ctx.moveTo(border, y);
	canvasObj.ctx.lineTo(canvasObj.canvas.width-border, y);
	canvasObj.ctx.stroke();
}

function moveVerticalBy(dy)
{
	posY += dy
}

function moveHorizontalBy(dx)
{
	posX += dx
}

function crop(canvasObj, width, height)
{
	const newCanvasObj = createImage(width, height, 'black', canvasObj.colours, canvasObj.columns, canvasObj.rows);
	newCanvasObj.ctx.drawImage(canvasObj.canvas,0, 0,width, height,0, 0,width, height);
	return newCanvasObj;
}

function getX()
{
	return posX;
}

function getY()
{
	return posY;
}

function setX(value)
{
	posX = value;
}

function setY(value)
{
	posY = value;
}

export default { 
	createImage, 
	saveImage, 
	area,
	textLeft, 
	textCenter, 
	textRight, 
	diceNums, diceImages, 
	imageFromLeft, 
	imageFromRight, 
	existsImage,
	divider, 
	moveVerticalBy, 
	moveHorizontalBy, 
	crop, 
	getX, 
	getY, 
	setX, 
	setY 

}