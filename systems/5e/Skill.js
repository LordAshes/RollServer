import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, requestRoll, style)
{		
	console.log(`5E Skill Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);

	//
	// Draw Table Labels
	//
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, "Roll", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	draw.textLeft(result, "Dice", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["2"]);
	draw.textRight(result, name, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["3"]);
	
	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);
		
	//
	// Apply Style If Set
	//
	switch(style.toUpperCase())
	{
		case "ADVANTAGE":
			requestRoll.formula = roller.applyMod(requestRoll.formula,"+");
			requestRoll.roll = roller.applyMod(requestRoll.roll,"+");
			break;
		case "DISADVANTAGE":
			requestRoll.formula = roller.applyMod(requestRoll.formula,"-");
			requestRoll.roll = roller.applyMod(requestRoll.roll,"-");
			break;
		default:
			break;
	}
	
	const dice = roller.roll(requestRoll.roll, theme.colours);
	draw.moveVerticalBy(theme.rows["Value"]);
	draw.textLeft(result, dice.roll, theme.fonts["Value"], theme.colours["Value"], theme.columns["1"]);
	draw.diceNums(result, dice.dice, theme.fonts["Value"], theme.columns["2"]);
	if(requestRoll.roll.indexOf("+(")>-1) { draw.moveHorizontalBy(5); draw.textLeft(result, "(ADV)", theme.fonts["Footnote"], theme.colours["Label"]); }
	if(requestRoll.roll.indexOf("-(")>-1) { draw.moveHorizontalBy(5); draw.textLeft(result, "(DIS)", theme.fonts["Footnote"], theme.colours["Label"]); }
	draw.textRight(result, dice.total, theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
	
	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);
	
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, requestRoll.formula.replaceAll("{","").replaceAll("}","")+" = "+requestRoll.roll, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
		
	return { 
		summary: `${name} ${dice.total}`,
		header1: "Result",
		value1: dice.total,
		header2: roll.note,
		value2: "",
	};
}

export { roll }