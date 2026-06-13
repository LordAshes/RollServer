import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, roll, style)
{	
	console.log(`5E Note Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);

	const formulas = (Array.isArray(roll.formula) ? roll.formula : [ roll.formula ]);
	const rolls = (Array.isArray(roll.roll) ? roll.roll : [ roll.roll ]);

	console.log({formulas});
	console.log({rolls});

	for(const index in formulas)
	{		
		//
		// Draw Note(s)
		//
		let note = ((formulas[index]!=rolls[index] && rolls[index]!="") ? formulas[index] + " = "+ rolls[index] : formulas[index]);
		let font = theme.fonts["Label"];
		if(note.startsWith("*")) { note = note.substring(1); font = theme.fonts["Fixed"]; }
		
		draw.moveVerticalBy(theme.rows["Label"]);
		draw.textLeft(result, note, font, theme.colours["Label"], theme.columns["1"]);
	}
	draw.moveVerticalBy(5);
				
	return { 
		summary: `${name}`,
		header1: "",
		value1: roll.note,
		header2: "",
		value2: ""
	};
}

export { roll }