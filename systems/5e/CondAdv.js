import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, requestRoll, style)
{		
	console.log(`5E CondAdv Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);

	//
	// Draw Table Labels
	//
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, "Roll", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	draw.textLeft(result, "Dice", theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["2"]);
	draw.textRight(result, name, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["3"]);
	
	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);
			
	const dice1 = roller.roll(requestRoll.roll, theme.colours);
	const dice2 = roller.roll(requestRoll.roll, theme.colours);
	draw.moveVerticalBy(theme.rows["Value"]);
	draw.textLeft(result, dice1.roll, theme.fonts["Value"], theme.colours["Value"], theme.columns["1"]);
	draw.diceNums(result, dice1.dice, theme.fonts["Value"], theme.columns["2"]);
	draw.diceNums(result, dice2.dice, theme.fonts["Value"]);
	draw.moveHorizontalBy(5);
	draw.textLeft(result, "(ADV?)", theme.fonts["Footnote"], theme.colours["Unused"]);
	if(dice1.total >= dice2.total)
	{
		draw.textRight(result, dice1.total, theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
	}
	else
	{
		draw.textRight(result, dice1.total + " or "+Math.max(dice1.total,dice2.total), theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
	}
	
	draw.moveVerticalBy(theme.rows["Divider"]);	
	draw.divider(result, theme.colours["Divider"], 1, 5);
	
	draw.moveVerticalBy(theme.rows["Footnote"]);
	draw.textLeft(result, requestRoll.formula.replaceAll("{","").replaceAll("}","")+" = "+requestRoll.roll, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
		
	return { 
		summary: `${name} ${dice1.total + " or "+Math.max(dice1.total,dice2.total)}`,
		header1: "Result",
		value1: dice1.total,
		header2: (dice2.total>dice1.total ? "or" : ""),
		value2: (dice2.total>dice1.total ? dice2.total : ""),
	};
}

export { roll }