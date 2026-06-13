import fs from "fs";
import theme from './common.js';
import draw from '../../draw.js';
import roller from '../../roll.js';

async function roll(result, id, character, name, roll, style)
{
	console.log(`5E Attack Handler: ID: ${id}, Character: ${character}, Roll: ${name}, Style: ${style}`);
				
	let dice = null;
	let attackRolls = [];
	let damageRolls = [];
	for(let attack of roll.attacks)
	{
		console.log({attack});
		
		//
		// Draw Attack Labels
		//
		draw.moveVerticalBy(theme.rows["Footnote"]);
		draw.textLeft(result, "Roll", theme.fonts["Footnote"], theme.colours["Label2"], theme.columns["1"]);
		draw.textLeft(result, "Dice", theme.fonts["Footnote"], theme.colours["Label2"], theme.columns["2"]);
		draw.textRight(result, attack.name, theme.fonts["Footnote"], theme.colours["Label"], theme.columns["3"]);
					
		//
		// Apply Style If Set
		//
		let requestRoll = attack.attackRoll;
		switch(style.toUpperCase())
		{
			case "ADVANTAGE":
				requestRoll = roller.applyMod(requestRoll,"+");
				break;
			case "DISADVANTAGE":
				requestRoll = roller.applyMod(requestRoll,"-");
				break;
			default:
				break;
		}

		//
		// Draw Attack Roll Results
		//
		dice = roller.roll(requestRoll, theme.colours);
		draw.moveVerticalBy(theme.rows["Value"]);
		draw.textLeft(result, dice.roll, theme.fonts["Value"], theme.colours["Value"], theme.columns["1"]);
		draw.diceNums(result, dice.dice, theme.fonts["Value"], theme.columns["2"]);
		if(requestRoll.indexOf("+(")>-1) { draw.moveHorizontalBy(5); draw.textLeft(result, "(ADV)", theme.fonts["Footnote"], theme.colours["Label"]); }
		if(requestRoll.indexOf("-(")>-1) { draw.moveHorizontalBy(5); draw.textLeft(result, "(DIS)", theme.fonts["Footnote"], theme.colours["Label"]); }
		draw.textRight(result, dice.total, theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
		
		attackRolls.push(dice.total);
		
		//
		// Draw Damage Labels
		//
		draw.moveVerticalBy(theme.rows["Footnote"]);
		draw.textLeft(result, "Roll", theme.fonts["Footnote"], theme.colours["Label2"], theme.columns["1"]);
		draw.textLeft(result, "Dice", theme.fonts["Footnote"], theme.colours["Label2"], theme.columns["2"]);
		draw.textRight(result, "Damage", theme.fonts["Footnote"], theme.colours["Label"], theme.columns["3"]);
		
		//
		// Draw Damage Roll Results
		//
		dice = roller.roll(attack.damageRoll, theme.colours);
		draw.moveVerticalBy(theme.rows["Value"]);
		draw.textLeft(result, dice.roll, theme.fonts["Value"], theme.colours["Value"], theme.columns["1"]);
		console.log("Position: "+draw.getX()+","+draw.getY());
		await draw.diceImages(result, dice.dice, theme.columns["2"], 7);
		draw.textRight(result, dice.total, theme.fonts["Value"], theme.colours["Value"], theme.columns["3"]);
		
		damageRolls.push(dice.total);
		
		draw.moveVerticalBy(theme.rows["Divider"]);	
		draw.divider(result, theme.colours["Divider"], 1, 5);
				
		draw.moveVerticalBy(theme.rows["Footnote"]);
		draw.textLeft(result, "Attack: "+attack.attackFormula.replaceAll("{","").replaceAll("}","")+" = "+attack.attackRoll, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
		draw.moveVerticalBy(theme.rows["Footnote"]);
		draw.textLeft(result, "Damage: "+attack.damageFormula.replaceAll("{","").replaceAll("}","")+" = "+attack.damageRoll, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);

		draw.moveVerticalBy(theme.rows["Divider"]);	
		draw.divider(result, theme.colours["Divider"], 1, 5);		
	}
	
	draw.moveVerticalBy(theme.rows["Footnote"]+2);
	const damages = cumulativeDamage(attackRolls, damageRolls);
	let msg = `Summary: `;
	for(let h=0; h<damages.length; h++)
	{
		msg += `${(damages.length-h)} hit(s): ${damages[h]}, `;
	}
	msg = msg.substring(0,msg.length-2);
	draw.textLeft(result, msg, theme.fonts["Footnote"], theme.colours["Footnote"], theme.columns["1"]);
	
	return { 
		summary: `Attack: ${attackRolls.join(", ")} Damage: ${damageRolls.join(", ")}`,
		header1: "Attack:",
		value1: attackRolls.join(", "),
		header2: "Damage:",
		value2: damageRolls.join(", ")
	};
}

function cumulativeDamage(attack, damage) {
    if (attack.length !== damage.length) {
        throw new Error("Arrays must have the same length");
    }

    // Combine attack and damage
    const pairs = attack.map((a, i) => ({
        attack: a,
        damage: damage[i]
    }));

    // Sort by attack value
    pairs.sort((a, b) => a.attack - b.attack);

    // Build cumulative totals from highest attack downward
    const result = new Array(pairs.length);
    let total = 0;

    for (let i = pairs.length - 1; i >= 0; i--) {
        total += pairs[i].damage;
        result[i] = total;
    }

    return result;
}

export { roll }