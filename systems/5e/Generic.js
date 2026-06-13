import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, roll, style)
{	
	console.log(`5E Generic Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);
	
	//
	// Draw Table Labels
	//
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, "Roll", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	draw.textLeft(result, "Dice", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["2"]);
	draw.textRight(result, name, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["3"]);
	
	//
	// Draw Light Divider
	//
	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);

	//
	// Draw Roll Results
	//
	console.log(roll);	
	const dice = roller.roll(roll.roll, theme.colours);
	draw.moveVerticalBy(theme.rows["Value"]);
	draw.textLeft(result, dice.roll, theme.fonts["Value"], theme.colours["Value"], theme.columns["1"]);
	draw.textRight(result, dice.total, theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
		
	if(dice.dice.length<=7 || dice.dice.length>11)
	{	
	    // await draw.diceNums(result, dice.dice, theme.fonts["Value"], theme.columns["2"], 7);
		// draw.moveVerticalBy(theme.rows["Value"]);
		await draw.diceImages(result, dice.dice, theme.columns["2"]-4, 7);
	}
	else
	{
		draw.moveVerticalBy(theme.rows["Value"]);
		// await draw.diceNums(result, dice.dice, theme.fonts["Value"], 5, 11);
		// draw.moveVerticalBy(theme.rows["Value"]);
		await draw.diceImages(result, dice.dice, 2, 11);
	}

	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);
	
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, roll.formula.replaceAll("{","").replaceAll("}","")+" = "+roll.roll, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	
	if(roll.note != null && roll.note != "")
	{
		draw.moveVerticalBy(theme.rows["Divider"]);	
		draw.divider(result, theme.colours["Divider"], 1, 5);
	
		draw.moveVerticalBy(theme.rows["Footnote"]);
		draw.textLeft(result, roll.note, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	}
		
	return { 
		summary: `${name} ${dice.total}`, 
		header1: "Result", 
		value1: dice.total, 
		header2: "",
		value2: "",
	};
}

export { roll }