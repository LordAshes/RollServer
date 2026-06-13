import roll from '../roll.js';

const pbByLevel = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];

const name = "Minx";
const fullName = "Minx Spider";
const level = 4;

let specs = { };

specs["LV"] = level;
specs["PB"] = pbByLevel[level-1];
specs["EX"] = specs["PB"]*2;

specs["STR"] = 4;
specs["DEX"] = 0; 
specs["CON"] = 3; 
specs["INT"] = 1; 
specs["WIS"] = 3; 
specs["CHA"] = 1;

specs["RAGE"] = 2;
		
const rolls = {
		
	"Minx": 				roll.createEntry(	"Note",			[ "Druid Form", "*STR: +1, DEX: +0, CON: +4", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Bear": 			roll.createEntry(	"Note",			[ "Brown Bear, Size: Large", "HP: 34, AC: 13, 40'/30'C", "*STR: +4, DEX: +0, CON: +3", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Spider": 			roll.createEntry(	"Note",			[ "Giant Spider, Size: Medium", "HP: 26, AC: 14, 30'/30'C", "*STR: +2, DEX: +3, CON: +1", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Wolf": 			roll.createEntry(	"Note",			[ "Dire Wolf, Size: Medium", "HP: 37, AC: 14, 50'", "*STR: +3, DEX: +2, CON: +2", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
		
	"Hit Die Druid":		roll.createEntry(	"Generic",		"1D8+{CON}",							"N/A for wildshape",		specs),
	"Hit Die Barbarian":	roll.createEntry(	"Generic",		"1D12+{CON}",							"N/A for wildshape",		specs),
	
	"Hit Points":			roll.createEntry(	"Storage",		"HP",									"",							specs),
	
	"STR": 					roll.createEntry(	"Skill",		"1D20+{STR}",							"",							specs),
	"DEX": 					roll.createEntry(	"Skill",		"1D20+{DEX}",							"",							specs),
	"CON": 					roll.createEntry(	"Skill",		"1D20+{CON}",							"",							specs),
	"INT": 					roll.createEntry(	"Skill",		"1D20+{INT}",							"",							specs),
	"WIS": 					roll.createEntry(	"Skill",		"1D20+{WIS}",							"",							specs),
	"CHA":		 			roll.createEntry(	"Skill",		"1D20+{CHA}",							"",							specs),

	"STR Save":				roll.createEntry(	"Skill",		"1D20+{STR}",							"",							specs),
	"DEX Save":				roll.createEntry(	"Skill",		"1D20+{DEX}",							"",							specs),
	"CON Save":				roll.createEntry(	"Skill",		"1D20+{CON}",							"",							specs),
	"INT Save":				roll.createEntry(	"Skill",		"1D20+{INT}+{PB}",						"",							specs),
	"WIS Save":				roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"",							specs),
	"CHA Save":	 			roll.createEntry(	"Skill",		"1D20+{CHA}",							"",							specs),

	"Initiative":			roll.createEntry(	"Skill",		"1D20+{DEX}",							"",							specs),
	
	"Acrobatics": 			roll.createEntry(	"Skill",		"1D20+{DEX}",							"",							specs),
	"Animal Handling":		roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"",							specs),
	"Arcana": 				roll.createEntry(	"Skill",		"1D20+{INT}",							"",							specs),
	"Athletics":			roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"",							specs),
	"Deception":			roll.createEntry(	"Skill",		"1D20+{CHA}",							"",							specs),
	"History":				roll.createEntry(	"Skill",		"1D20+{INT}",							"",							specs),
	"Insight":				roll.createEntry(	"Skill",		"1D20+{WIS}",							"",							specs),
	"Intimidation":			roll.createEntry(	"Skill",		"1D20+{CHA}",							"",							specs),
	"Investigation":		roll.createEntry(	"Skill",		"1D20+{INT}",							"",							specs),
	"Medicine":				roll.createEntry(	"Skill",		"1D20+{WIS}",							"",							specs),
	"Nature":				roll.createEntry(	"Skill",		"1D20+{INT}+{PB}",						"",							specs),
	"Perception":			roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"",							specs),
	"Performance":			roll.createEntry(	"Skill",		"1D20+{CHA}", 							"",							specs),
	"Persuasion":			roll.createEntry(	"Skill",		"1D20+{CHA}", 							"",							specs),
	"Religion":				roll.createEntry(	"Skill",		"1D20+{INT}", 							"",							specs),
	"Sleight Of Hand":		roll.createEntry(	"Skill",		"1D20+{DEX}", 							"",							specs),
	"Stealth":				roll.createEntry(	"Skill",		"1D20+{DEX}+{EX}",						"",							specs),
	"Survival":				roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"",							specs),
	
	"Shove DC":				roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"",							specs),
	"Grapple DC":			roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"",							specs),

	"Spider Rage":			roll.createEntry(	"Note",			"Bonus Action: Enters Rage (2/LR)",		"=>",						specs),	

	"Raging Shove DC":		roll.createEntry(	"Skill",		"+(2D20)+{STR}+{PB}",					"",							specs),
	"Raging Grapple DC":	roll.createEntry(	"Skill",		"+(2D20)+{STR}+{PB}",					"",							specs),
	
	"Cure Wounds LV1":		roll.createEntry(	"Generic",		"1D8",									"",							specs),	
	"Cure Wounds LV2":		roll.createEntry(	"Generic",		"2D8",									"",							specs),	

	"Attack":				roll.createEntry(	"Skill",		"1D20+5",								"",							specs),
	"Bite":					roll.createEntry(	"Generic",		"1D8+3",								"",							specs),	
	"Raging Bite":			roll.createEntry(	"Generic",		"1D8+3+{RAGE}",							"",							specs),	
	"Poison":				roll.createEntry(	"Generic",		"2D8",									"DC11 CON for 1/2",			specs),	
	
	"Bite Attack":			roll.createMulti(	["Attack", "Bite", "Poison"] ),
	"Raging Bite Attack":	roll.createMulti(	["Attack", "Raging Bite", "Poison"] ),
	
	"Web":					roll.createEntry(	"Generic",		"1D20+5",								"Restrained (DC12)",		specs),	
	
	"Use Slot LV1":			roll.createEntry(	"Storage",		"Slot1",								"-1",						specs),
	"Use Slot LV2":			roll.createEntry(	"Storage",		"Slot2",								"-1",						specs),
	"Spell Slots":			roll.createMulti(	["Unused LV1 Slots", "Unused LV2 Slots"]	),
		
	"Spell DC": 			roll.createEntry(	"Note",			"8+WIS+PB = 8+{WIS}+{PB} = "+(8+specs["WIS"]+specs["PB"]), (8+specs["WIS"]+specs["PB"]), specs)
};

export { name, fullName, rolls }
