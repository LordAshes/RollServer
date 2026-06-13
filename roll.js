function roll(formula, colours) {

    const result = {
        formula: formula,
        roll: "",
        dice: [],
        mod: 0,
        total: 0
    };

    // Tokenize:
    // +(2D20)  -> advantage
    // -(2D20)  -> disadvantage
    // +2D6
    // -2D6
    // 2D6
    // +3
    // -4
    // 7
    const tokens = formula.match(
        /[+-]\(\d+[dD]\d+\)|[+-]?\d+[dD]\d+|[+-]?\d+/g
    );

    if (!tokens) {
        throw new Error("Invalid formula");
    }

    result.roll = consolidateFormula(formula);

    for (const token of tokens) {

        // =========================
        // ADVANTAGE
        // =========================
        if (/^\+\(\d+[dD]\d+\)$/.test(token)) {

            const inner = token.slice(2, -1);
            const [count, sides] = inner.split(/[dD]/).map(Number);

            const rolls = [];

            for (let i = 0; i < count; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }

            const best = Math.max(...rolls);

            for (const value of rolls) {

                const die = {
                    type: "D" + sides,
                    value: value,
                    colour: null
                };

                const isUsed = value === best;

                if (!isUsed) {
                    die.colour = colours.Unused;
                } else if (value === sides) {
                    die.colour = colours.Max;
                } else if (value === 1) {
                    die.colour = colours.Min;
                } else {
                    die.colour = colours.Regular;
                }

                result.dice.push(die);
            }

            result.total += best;
        }

        // =========================
        // DISADVANTAGE
        // =========================
        else if (/^-\(\d+[dD]\d+\)$/.test(token)) {

            const inner = token.slice(2, -1);
            const [count, sides] = inner.split(/[dD]/).map(Number);

            const rolls = [];

            for (let i = 0; i < count; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }

            const worst = Math.min(...rolls);

            for (const value of rolls) {

                const die = {
                    type: "D" + sides,
                    value: value,
                    colour: null
                };

                const isUsed = value === worst;

                if (!isUsed) {
                    die.colour = colours.Unused;
                } else if (value === sides) {
                    die.colour = colours.Max;
                } else if (value === 1) {
                    die.colour = colours.Min;
                } else {
                    die.colour = colours.Regular;
                }

                result.dice.push(die);
            }

            result.total += worst;
        }

        // =========================
        // NORMAL DICE
        // =========================
        else if (/[dD]/.test(token)) {

            let sign = 1;
            let expr = token;

            if (expr.startsWith("+")) {
                expr = expr.slice(1);
            } else if (expr.startsWith("-")) {
                sign = -1;
                expr = expr.slice(1);
            }

            const [count, sides] = expr.split(/[dD]/).map(Number);

            for (let i = 0; i < count; i++) {

                const value = Math.floor(Math.random() * sides) + 1;

                const die = {
                    type: "D" + sides,
                    value: value,
                    colour: null
                };

                if (value === sides) {
                    die.colour = colours.Max;
                } else if (value === 1) {
                    die.colour = colours.Min;
                } else {
                    die.colour = colours.Regular;
                }

                result.dice.push(die);
                result.total += value * sign;
            }
        }

        // =========================
        // MODIFIER
        // =========================
        else {

            const mod = parseInt(token, 10);
            result.mod += mod;
            result.total += mod;
        }
    }

    return result;
}

function applyMod(formula,mod) {

    // Match a dice expression like 2D20, 1d6, etc.
    const diceRegex = /\d+[dD]\d+/g;

    let match;
    let firstDiceIndex = -1;
    let firstDiceValue = null;

    // Find first occurrence
    while ((match = diceRegex.exec(formula)) !== null) {
        firstDiceIndex = match.index;
        firstDiceValue = match[0];
        break;
    }

    // No dice found, return unchanged
    if (firstDiceIndex === -1) {
        return formula;
    }

    // Build new formula:
    // prefix + wrapped dice + suffix
    const before = formula.slice(0, firstDiceIndex);
    const after = formula.slice(firstDiceIndex + firstDiceValue.length);

    return `${before}${mod}(2${firstDiceValue.toUpperCase().substring(firstDiceValue.toUpperCase().indexOf("D"))})${after}`.replace("+(+(","+(").replace("-(+(","+(").replace("))",")");
}

function consolidateFormula(formula) {

    // Match:
    // +(2D20)
    // -(2D20)
    // +2D6
    // -2D6
    // 2D6
    // +5
    // -3
    const tokens = formula.match(
        /[+-]\(\d+[dD]\d+\)|[+-]?\d+[dD]\d+|[+-]?\d+/g
    );

    if (!tokens) {
        throw new Error("Invalid formula");
    }

    const dice = [];
    let modifier = 0;

    for (const token of tokens) {

        // =========================
        // ADVANTAGE
        // =========================
        if (/^\+\(\d+[dD]\d+\)$/.test(token)) {

            const inner = token.slice(2, -1);
            const [, sides] = inner.split(/[dD]/).map(Number);

            dice.push(`1D${sides}`);
        }

        // =========================
        // DISADVANTAGE
        // =========================
        else if (/^-\(\d+[dD]\d+\)$/.test(token)) {

            const inner = token.slice(2, -1);
            const [, sides] = inner.split(/[dD]/).map(Number);

            dice.push(`1D${sides}`);
        }

        // =========================
        // NORMAL DICE
        // =========================
        else if (/[dD]/.test(token)) {

            let expr = token.toUpperCase();

            if (expr.startsWith("+")) {
                expr = expr.substring(1);
            }

            dice.push(expr);
        }

        // =========================
        // MODIFIER
        // =========================
        else {

            modifier += parseInt(token, 10);
        }
    }

    let result = "";

    for (let i = 0; i < dice.length; i++) {

        const die = dice[i];

        if (i === 0) {
            result += die;
        }
        else if (die.startsWith("-")) {
            result += die;
        }
        else {
            result += "+" + die;
        }
    }

    if (modifier > 0) {
        result += `+${modifier}`;
    }
    else if (modifier < 0) {
        result += `${modifier}`;
    }

    return result;
}

function createAttack(attackNames, attackFormulas, damageFormulas, values) {
	
	let attacks = [];

	for(let index in attackNames)
	{
		let attack  = { "name": attackNames[index] };
		let previous;
		
		let current = attackFormulas[index];
		do {
			previous = current;
			current = resolve(current, values);
		} while (current !== previous);

		attack["attackFormula"] = attackFormulas[index];
		attack["attackRoll"] = current;

		current = damageFormulas[index];
		do {
			previous = current;
			current = resolve(current, values);
		} while (current !== previous);
		
		attack["damageFormula"] = damageFormulas[index];
		attack["damageRoll"] = current;
		
		attacks.push(attack);
	}

    return  { template: "Attack", attacks: attacks };
}

function createEntry(template, formula, note, values) {

	let roll = null;
	
    let previous;
	let current;

	if(formula!=null && !Array.isArray(formula))
	{
		current = formula.toString();
		do {
			previous = current;
			current = resolve(current, values);
		} while (current !== previous);
		formula = formula.replaceAll("{","").replaceAll("}","");
		roll = current;
	}
	else if (formula!=null)
	{
		roll = [];
		for(const index in formula)
		{
			let current = formula[index];
			do {
				previous = current;
				current = resolve(current, values);
			} while (current !== previous);
			formula[index] = current; // formula[index].replaceAll("{","").replaceAll("}","");
			roll[index] = current;
		}
	}

    current = (note==null ? "" : note.toString());
    do {
        previous = current;
        current = resolve(current, values);
    } while (current !== previous);	
	if(note!="" && note!=current) { note += " = "+current; } 

    return { template, formula, roll, note };
}

function createMulti(link) 
{
    return { link };
}

function resolve(str, values, seen = new Set()) {

	return str.replace(/\{([^{}]+)\}/g, (match, key) => {

		if (!(key in values)) {
			// Leave unknown placeholders unchanged
			return match;
		}

		if (seen.has(key)) {
			throw new Error(`Circular placeholder reference detected: ${key}`);
		}

		const value = values[key];

		// Primitive value
		if (typeof value !== "string") {
			return String(value);
		}

		// Resolve nested placeholders
		seen.add(key);
		const result = resolve(value, seen);
		seen.delete(key);

		return result;
	});
}


export default { roll, applyMod, createAttack, createEntry, createMulti, consolidateFormula }