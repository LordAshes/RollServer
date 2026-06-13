import theme from './common.js';
import draw from '../../draw.js';

const fonts = { "Result": "45px Arial", "Header": "20px Arial", "Label": "15px Arial", "Value": "15px Arial", "Footnote": "10px Arial", "Fixed": "15px Consolas" }
const colours = { 
	"Header": "black", 
	"Label": "black", 
	"Label2": "#555555", 
	"Value": "blue", 
	"Footnote": '#555555', 
	"Max": "green", 
	"Regular": "blue", 
	"Min": "red", 
	"Unused": "#555555", 
	"Heavy Divider": "black",  
	"Divider": "#CCCCCC"  
};
const columns = { "1": 5, "2": 75, "3": 235 };
const rows = {"Header": 20, "Label": 18, "Value": 18, "Footnote": 12, "Divider": 5 };

async function roll(id, character, roll, style)
{
	console.log(`5E Common Handler: ID: ${id}, Character: ${character}, Roll: ${roll}, Style: ${style}`);

	console.log(`Loading Character...`);
	let sysCharacter = null;
	try 
	{
		sysCharacter = await import(`../../characters/${character}.js`);
	}
	catch(e)
	{
		console.log("Unable to access character file: "+e);
		throw new Error("Unable to access character file: "+e);
	}

	console.log(`Collecting Templates And Roll Results...`);

	let names = [];
	let templates = [];
	let rollRequests = [];
	if(sysCharacter.rolls[roll].template!=null)
	{
		console.log(`Processing Regular...`);
		names.push(roll);
		templates.push(sysCharacter.rolls[roll].template);
		rollRequests.push(sysCharacter.rolls[roll]);
	}
	else
	{
		console.log(`Processing Links...`);
		for(let link of sysCharacter.rolls[roll].link)
		{
			names.push(link);
			templates.push(sysCharacter.rolls[link].template);
			rollRequests.push(sysCharacter.rolls[link]);
		}
	}

	console.log(`Drawing Result Header...`);

	draw.setX(0);
	draw.setY(0);
	let result = null;
	try
	{
		//
		// Create Result Canvas
		//
		result = draw.createImage(240, 1600, 'white');
		draw.setY(5);
		if(draw.existsImage(`Background.${templates[0]}`))
		{
			// draw.setY(5);
			await draw.imageFromLeft(result, `Background.${templates[0]}`);
		}
		else
		{
			draw.area(result, 240, 35, "#DDDDDD");
		}

		//
		// Create 5px Top Border And Then Write Out The Roll
		// 
		draw.setY(10);
		draw.moveVerticalBy(parseInt(theme.fonts["Header"]));
		draw.textCenter(result, roll, theme.fonts["Header"], theme.colours["Label"], result.canvas.width/2);
		draw.moveVerticalBy(parseInt(theme.fonts["Label"]));
		
		//
		// Draw Character Portrait
		//
		if(draw.existsImage(`Portrait.${character}`))
		{
			draw.setX(10);
			await draw.imageFromLeft(result, `Portrait.${character}`);
		}
		
		//
		// Draw Request Portrait Or Draw Default Portrait
		//
		draw.setX(result.canvas.width-5);
		let bounds = null;
		if(draw.existsImage(`5E.${roll}`))
		{
			bounds = await draw.imageFromRight(result, `5E.${roll}`);
		}
		else if(draw.existsImage(`5E.${templates[0]}`))
		{
			bounds = await draw.imageFromRight(result, `5E.${templates[0]}`);
		}
		else
		{
			bounds = await draw.imageFromRight(result, `5E.Generic`);
		}

		draw.setY(draw.getY()+bounds.height);
	}
	catch(e)
	{
		console.log("Unable to draw result image header: "+e);
		throw new Error("Unable to draw result image header: "+e);
	}

	console.log(`Processing Templates...`);
	
	let returnText = `${character}: `;
	let resultObj = null;
	for(let index in templates)
	{
		const name = names[index];
		const template = templates[index].replace("*","");
		const rollRequest = rollRequests[index];
		console.log(`Request Processing Template '${template}' Roll '${JSON.stringify(rollRequest)}'...`);
		resultObj = await processTemplate(result, template, name, rollRequest, id, character, style);
		console.log(`Processed Template '${template}' Roll...`);
		returnText += `${resultObj.summary}, `;
		
		if(templates[index].indexOf("*")>-1)
		{
			//
			// Generate Abridged Note Result
			//
			let note = returnText.replace("\r\n"," | ").trim();
			if(note.endsWith(",")){ note = note.substring(0,note.length-1); }
			if(note.indexOf(":")){ note = note.substring(note.indexOf(":")+1); }
			draw.setX(0);
			draw.setY(0);
			draw.area(result, 240, 1600, "white");
			draw.setX(5);
			draw.setY(5);
			draw.moveVerticalBy(parseInt(theme.fonts["Label"]));
			draw.textLeft(result, note, theme.fonts["Label"], theme.colours["Label"]);
			draw.moveVerticalBy(5);
		}
		
		draw.moveVerticalBy(theme.rows["Divider"]);	
		draw.divider(result, theme.colours["Heavy Divider"], 1, 5);
	}
	returnText = returnText.substring(0,returnText.length-2);
	
	try
	{
		//
		// Draw Request Header
		//	
		if(templates.length==1)
		{
			console.log("Drawing Headers");
			const saveY = draw.getY();
			if(resultObj.value2!="") 
			{ 
				draw.setY(55); 
				draw.textCenter(result, resultObj.header1, theme.fonts["Footnote"], theme.colours["Header"], (result.canvas.width/2));
				draw.moveVerticalBy(parseInt(theme.fonts["Header"]));
				draw.textCenter(result, resultObj.value1, theme.fonts["Value"], theme.colours["Value"], result.canvas.width/2);
				draw.moveVerticalBy(5);
				draw.moveVerticalBy(parseInt(theme.fonts["Footnote"]));
				draw.textCenter(result, resultObj.header2, theme.fonts["Footnote"], theme.colours["Header"], (result.canvas.width/2));
				draw.moveVerticalBy(parseInt(theme.fonts["Header"]));
				draw.textCenter(result, resultObj.value2, theme.fonts["Value"], theme.colours["Value"], result.canvas.width/2);
			} 
			else 
			{ 
				draw.setY(55); 
				draw.textCenter(result, resultObj.header1, theme.fonts["Footnote"], theme.colours["Header"], (result.canvas.width/2));
				draw.moveVerticalBy(45);
				draw.textCenter(result, resultObj.value1, theme.fonts["Result"], theme.colours["Value"], (result.canvas.width/2));
				draw.moveVerticalBy(parseInt(theme.fonts["Footnote"]));
			}
			draw.setY(saveY);
		}
	}
	catch(e)
	{
		console.log("Unable to draw result header titles: "+e);
		throw new Error("Unable to draw result header  titles: "+e);
	}
	
	//
	// Crop Result
	//
	console.log("Cropping Result...");
	draw.moveVerticalBy(-1);
	result = draw.crop(result, result.canvas.width, draw.getY());

	//
	// Save Result
	//
	console.log("Saving Result...");
	draw.saveImage(result, id);
	
	return `[IMG](https://lordashes.ca:3000/results/${id}.png)\r\n${returnText}`;
}

async function processTemplate(result, template, rollName, rollRequest, id, character, style)
{
	console.log(`Processing Template '${template}' Roll '${JSON.stringify(rollRequest)}'...`);
	let sysTemplate = null;
	try 
	{
		console.log(`Loading Template '${template}'...`);
		sysTemplate = await import(`./${template}.js`);
	}
	catch(e)
	{
		console.log("Unable to access template file: "+e);
		throw new Error("Unable to access template file: "+e);
	}
	
	console.log(`Executing Template '${template}' Roll '${JSON.stringify(rollRequest)}'...`);
	try 
	{	
		return await sysTemplate.roll(result, id, character, rollName, rollRequest, style ? style : "None");
	}
	catch(e)
	{
		console.log("Unable to process request: "+e);
		throw new Error("Unable to process request: "+e );
	}
}

export default { fonts, colours, columns, rows, roll }
