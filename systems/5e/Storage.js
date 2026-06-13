import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, roll, style)
{	
	console.log(`5E Storage Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);

	//
	// Read Current Value
	//
	const prev = fs.readFileSync(`./characters/${character}.${roll.formula}.txt`,`utf8`).split("of");
	
	if(roll.note!="") { style = roll.note; }

	//
	// Adjust Value
	//	
	let msg = "";
	let current = parseInt(prev[0]);
	if(style=="None")
	{
		// Keep unchanged
	}
	else if(style.startsWith("="))
	{
		current = parseInt(style.substring(1));
	}
	else if (style.startsWith("-"))
	{
		current -= parseInt(style.substring(1));
	}
	else
	{
		current += parseInt(style);
	}
	console.log(`Raw Current: ${current} of ${prev[1]}`);
	current = Math.min(Math.max(0,current),parseInt(prev[1]));
	console.log(`Limited Current: ${current} of ${prev[1]}`);
	
	//
	// Generate Adjust Message (After Limits Applied)
	//	
	if(style=="None")
	{
		msg = `${roll.formula} Is ${current} Of ${prev[1]}`;
	}
	else if(style.startsWith("="))
	{
		msg = `Set ${roll.formula} To ${current} Of ${prev[1]}`;
	}
	else if (style.startsWith("-"))
	{
		msg = `${roll.formula} Decreased By ${Math.abs(current-prev[0])} To ${current}`;
		if(Math.abs(current-prev[0])==0) { msg = `Unable To Decrease ${roll.formula}`; }
	}
	else
	{
		msg = `${roll.formula} Increased By ${Math.abs(current-prev[0])} To ${current}`;
		// if(Math.abs(current-prev[0])==0) { msg = `Unable To Increase ${roll.formula}`; }
	}
	
	//
	// Write Adjusted Value
	//	
	fs.writeFileSync(`./characters/${character}.${roll.formula}.txt`,current.toString().trim()+" of "+prev[1].toString().trim());
	
	//
	// Draw Message
	//	
	draw.moveVerticalBy(theme.rows["Label"]);
	draw.textLeft(result, msg, theme.fonts["Label"], theme.colours["Label"], theme.columns["1"]);
	draw.moveVerticalBy(5);
				
	//
	// Return Value As Header
	//	
	return { 
		summary: `${msg}`,
		header1: "Current",
		value1: current,
		header2: "Of",
		value2: prev[1].trim()
	};
}

export { roll }