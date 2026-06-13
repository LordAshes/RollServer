import roll from '../roll.js';

const pbByLevel = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];

const name = "Minx";
const fullName = "Minx Bear";
const level = 4;

let specs = { };

specs["LV"] = level;
specs["PB"] = pbByLevel[level-1];

specs["STR"] = 1;
specs["DEX"] = 0; 
specs["CON"] = 4; 
specs["INT"] = 1; 
specs["WIS"] = 3; 
specs["CHA"] = 1;

specs["RAGE"] = 2;
		
const rolls = {
		
	"Hit Die Druid":		roll.createEntry(	"Generic",		"1D8+{CON}",							"N/A for wildshape",		specs),
	"Hit Die Barbarian":	roll.createEntry(	"Generic",		"1D12+{CON}",							"N/A for wildshape",		specs),
	
	"Hit Points":			roll.createEntry(	"Storage",		"HP",									"",							specs),
	"Recover Hit Points":	roll.createEntry(	"Storage",		"HP",									"1000",						specs),
	
	"STR": 					roll.createEntry(	"Skill",		"1D20+{STR}",							"(Ability Score)",			specs),
	"DEX": 					roll.createEntry(	"Skill",		"1D20+{DEX}",							"(Ability Score)",			specs),
	"CON": 					roll.createEntry(	"Skill",		"1D20+{CON}",							"(Ability Score)",			specs),
	"INT": 					roll.createEntry(	"Skill",		"1D20+{INT}",							"(Ability Score)",			specs),
	"WIS": 					roll.createEntry(	"Skill",		"1D20+{WIS}",							"(Ability Score)",			specs),
	"CHA":		 			roll.createEntry(	"Skill",		"1D20+{CHA}",							"(Ability Score)",			specs),

	"STR Save":				roll.createEntry(	"Skill",		"1D20+{STR}",							"(Save)",					specs),
	"DEX Save":				roll.createEntry(	"Skill",		"1D20+{DEX}",							"(save)",					specs),
	"CON Save":				roll.createEntry(	"Skill",		"1D20+{CON}",							"(Save)",					specs),
	"INT Save":				roll.createEntry(	"Skill",		"1D20+{INT}+{PB}",						"(Save)",					specs),
	"WIS Save":				roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"(Save)",					specs),
	"CHA Save":	 			roll.createEntry(	"Skill",		"1D20+{CHA}",							"(Save)",					specs),

	"Initiative":			roll.createEntry(	"Skill",		"1D20+{DEX}",							"(Skill)",					specs),
	
	"Acrobatics": 			roll.createEntry(	"Skill",		"1D20+{DEX}",							"(Skill)",					specs),
	"Animal Handling":		roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"(Skill)",					specs),
	"Arcana": 				roll.createEntry(	"Skill",		"1D20+{INT}",							"(Skill)",					specs),
	"Athletics":			roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"(Skill)",					specs),
	"Deception":			roll.createEntry(	"Skill",		"1D20+{CHA}",							"(Skill)",					specs),
	"History":				roll.createEntry(	"Skill",		"1D20+{INT}",							"(Skill)",					specs),
	"Insight":				roll.createEntry(	"Skill",		"1D20+{WIS}",							"(Skill)",					specs),
	"Intimidation":			roll.createEntry(	"Skill",		"1D20+{CHA}",							"(Skill)",					specs),
	"Investigation":		roll.createEntry(	"Skill",		"1D20+{INT}",							"(Skill)",					specs),
	"Medicine":				roll.createEntry(	"Skill",		"1D20+{WIS}",							"(Skill)",					specs),
	"Nature":				roll.createEntry(	"Skill",		"1D20+{INT}+{PB}",						"(Skill)",					specs),
	"Perception":			roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"(Skill)",					specs),
	"Performance":			roll.createEntry(	"Skill",		"1D20+{CHA}", 							"(Skill)",					specs),
	"Persuasion":			roll.createEntry(	"Skill",		"1D20+{CHA}", 							"(Skill)",					specs),
	"Religion":				roll.createEntry(	"Skill",		"1D20+{INT}", 							"(Skill)",					specs),
	"Sleight Of Hand":		roll.createEntry(	"Skill",		"1D20+{DEX}", 							"(Skill)",					specs),
	"Stealth":				roll.createEntry(	"Skill",		"1D20+{DEX}", 							"(Skill)",					specs),
	"Survival":				roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"(Skill)",					specs),
	
	"Shove DC":				roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"(Skill)",					specs),
	"Grapple DC":			roll.createEntry(	"Skill",		"1D20+{STR}+{PB}",						"(Skill)",					specs),
		
	"Woodcarving":			roll.createEntry(	"Skill",		"1D20+{DEX}+{PB}",						"(Skill)",					specs),
	"Herbalism Kit":		roll.createEntry(	"Skill",		"1D20+{WIS}+{PB}",						"(Skill)",					specs),
		
	"Strike":				roll.createAttack(	["Unarmed Strike"],["1D20+{STR}+{PB}"],["1D4+{STR}"],								specs),
	"Raging Strike":		roll.createAttack(	["Unarmed Strike"],["1D20+{STR}+{PB}"],["1D4+{STR}+{RAGE}"],						specs),
	
	"Barkskin Spell":		roll.createEntry(	"Note",			"AC Minimum 16",						"16",						specs),	
	"Create Water":			roll.createEntry(	"Note",			"Creates 10 gallons of water", 			"",							specs),
	"Cure Wounds LV1":		roll.createEntry(	"Generic",		"1D8+{WIS}", 							"Range: Touch",				specs),	
	"Cure Wounds LV2":		roll.createEntry(	"Generic",		"2D8+{WIS}", 							"Range: Touch",				specs),	
	"Darkvision":			roll.createEntry(	"Note",			"Provides Darkvison 60'", 				"60'",						specs),	
	"Goodberry":			roll.createEntry(	"Note",			"Each Heal 1HP and sustain",		 	"10", 						specs),
	"Guidance":				roll.createEntry(	"Generic",		"1D4", 									"Range: Touch",				specs),
	"Healing Spirit":		roll.createEntry(	"Generic",		"1D6", "Total 1+WIS = "+(1+specs["WIS"])+" uses", 					specs),
	"Healing Word LV1":		roll.createEntry(	"Generic",		"1D4+{WIS}", 							"",							specs),
	"Healing Word LV2":		roll.createEntry(	"Generic",		"2D4+{WIS}", 							"",							specs),
	"Mending":				roll.createEntry(	"Note",			"Mend area no larger that 1x1x1",		"",							specs),
	"Speak With Animals":	roll.createEntry(	"Note",			"Allowing speaking with animals",		"",							specs),

	"Minx Rage":			roll.createEntry(	"Storage",		"Rage",									"-1",						specs),
	"Minx Unused Rage":		roll.createEntry(	"Storage",		"Rage",									"",							specs),
	"Recover Rage":			roll.createEntry(	"Storage",		"Rage",									"10",						specs),

	"Minx": 				roll.createEntry(	"Note",			[ "Druid Form", "*STR: +1, DEX: +0, CON: +4", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Bear": 			roll.createEntry(	"Note",			[ "Brown Bear, Size: Large", "HP: 34, AC: 13, 40'/30'C", "*STR: +4, DEX: +0, CON: +3", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Spider": 			roll.createEntry(	"Note",			[ "Giant Spider, Size: Medium", "HP: 26, AC: 14, 30'/30'C", "*STR: +2, DEX: +3, CON: +1", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Minx Wolf": 			roll.createEntry(	"Note",			[ "Dire Wolf, Size: Medium", "HP: 37, AC: 14, 50'", "*STR: +3, DEX: +2, CON: +2", "*INT: +1, WIS: +3, CHA: +1" ],	"=>",	specs),
	"Unused Wilshape":		roll.createEntry(	"Storage",		"Wildshape",							"",							specs),
	"Use Wildshape":		roll.createEntry(	"Storage*",		"Wildshape",							"-1",						specs),
	"Recover Wildshape":	roll.createEntry(	"Storage",		"Wildshape",							"10",						specs),

	"Spell Slots":			roll.createMulti(	["Unused LV1 Slots", "Unused LV2 Slots"]	),
	"Unused LV1 Slots":		roll.createEntry(	"Storage",		"Slot1",								"",							specs),
	"Unused LV2 Slots":		roll.createEntry(	"Storage",		"Slot2",								"",							specs),	
	"Use Slot LV1":			roll.createEntry(	"Storage*",		"Slot1",								"-1",						specs),
	"Use Slot LV2":			roll.createEntry(	"Storage*",		"Slot2",								"-1",						specs),
	"Recover Slot LV1":		roll.createEntry(	"Storage",		"Slot1",								"10",						specs),
	"Recover Slot LV2":		roll.createEntry(	"Storage",		"Slot2",								"10",						specs),
	
	"Short Rest":			roll.createMulti(	[ "Recover Wildshape" ] ),
	"Long Rest":			roll.createMulti(	[ "Recover Hit Points", "Recover Wildshape", "Recover Rage", "Recover Slot LV1", "Recover Slot LV2" ] ),

			
	"Spell DC": 			roll.createEntry(	"Note",			[ "8+WIS+PB = 8+{WIS}+{PB}" ],			(8+specs["WIS"]+specs["PB"]),	specs)
};

export { name, fullName, rolls }
