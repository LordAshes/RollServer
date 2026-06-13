**********************
* ROLL20 ROLL SERVER *
**********************

+----------+
| PURPOSE: |
+----------+

Provide a custom layout rolling system that allows sequences of rolls to be executed
as opposed to rolling one roll at a time. Included features:

- Includes templates for most 5E rolls.
- Allows the creation of custom templates using easy to use helper functions.
- Suppoers rolling with advantage and disadvantage.
- Rolls are initiatied from character specific menus displayed in Roll20.
- Menu can trigger multipe rolls.
- Roll templates can be chained to for complex seqeunces without needing to make custom templates.
- Character and roll portraits for custom appearance.
- Support for character switching for Wildshape and Polymorph like situations.
- Standalone solution (does not required an existing webserver)
- HTTPS support

+-------------+
| COMPONENTS: |
+-------------+

Browser Extension:

The Broswer Extension provides in Roll20 access to the character specific menus. When the focus
is on the Chat text box, pressing the ` (backtick) key open the character specific menu based on
the currently speaking character (removing "(GM)" if present).

Clicking outside the menu closes it, as does clicking a menu selection.

Quantity: 1

Character Specific Menus:

These are regular HTML pages which organize and present the roll buttons as well as potentially
provide selection of Advantage, Normal and Disadvantage rolls. Sample 5E roll menu files are
provided as a starting point but they can be replaced completely with own custom HTML if desired.

Quantity: 1 per character (or 1 per character form if using wildshape/polymorph forms)

Character Specific File:

This is the core file in which the character's details are defined. This file contains both stats
that are used by the character rolls and actual roll definitions. The character specific menus make
roll request by name and a corresponding roll definition needs to be defined in the character file
in order for the roll request to work. Sample 5E character sheet files are provided for reference.

Quantity: 1 per character (or 1 per character form if using wildshape/polymorph forms)

Roll Server:

This is a standalone HTTPS server which supports 3 main function: API for generating roll requests,
character file server, and roll results image server.

The process works as follows: The Roll20 Browser Extension makes a roll request to the roll server
API providing it information about the system, character, roll and optionally style. The roll server
extracts the character name and loads the corresponding character file. It looks up the request roll
in the character file and generates an image with the roll request and results. This image is placed
on the image server, and the API returns back a Roll20 image reference to the resulting image. Finally,
the browser extension write the resulting image reference into chat, which causes Roll20 to display
the resulting image.

Quantity: 1

+------------------------------------+
| CONFIGURING THE BROWSER EXTENSION: |
+------------------------------------+

Open the injection.js file in the extension folder. At the top of the file is a DOMAIN definition
which indicates the domain or IP address of the standalone Standalone roll server.

Update the DOMAIN constant to refect the correct domain or IP address.

Reload the extension if it was already loaded.

+----------------------------------+
| CONFIGURING THE CHARACTER MENUS: |
+----------------------------------+

The character speific menus are store in the character folder. They have the file name:

name.Menu.html

Where name is replaced by the character name as it show up in the Roll20 Speaking As listbox.
Do not include the "(GM") suffix even if the character will be used by the GM.

The content of the html can be regular HTML. Be aware that the content is loaded dynamically
so the content should not be generated dynamically.

There are 4 main types of entries. See the sample Minx.Menu.html file for examples of all of
these entries. 

1. Regular Roll Request

A regular roll request uses the format:

<button data-roll="5E/Multiattack/Minx Bear">Attacks</button>

Where the data-roll defines the roll to be made. The format of the data-roll is:

system/roll/character

2. Prompt Roll Request

A prompt roll request uses the format:

<button data-roll-prompt="5E/Hit Points/Minx Bear">&plusmn; HP</button>

Where the data-roll-prompt defines the roll to be made. The format of the data-roll is:

system/roll/character

This difference between this and a regular roll is that a prompt roll will prompt the
user for an entry and the entry will be appended to the roll request (as the style)
when making a request to the roll server. This is typically used for things like
modifying stored server values like hit points.

3. Impersonate Request

An impersonate request does three things. It changes the Roll20 speaking as to the
specified name, it acts like a regular roll for the purpose of the roll server, and
if the new name has a space then it sends a request to heal the character.

This is use for wildshape or polymorph style transofrmations. The base character should
not have any spaces in the name and the alternate forms should (e.g. Minx and Minx Bear).
This way when transitioning from the base form to another form, that new form will be
healed ensuring it starts of with full hitpoints (and not the hit points at the end of
the last use of the transformation). If however, the transofrmation is from a alternate
form to the base form, the healing is not applied.

The synatx for this request is:

<button data-impersonate="5E/Minx Spider">Giant Spider</button>

The syntax for the new data-impersonate property is:

sytem/new_form

4. Roll Style Request

Roll style allows the augmentation of rolls. In 5E the most common use of Roll Style is
to add Advantage or Disadvantage to rolls. The syntax for these types of entries is:

<input data-menu="KEEP" name="rollStyle" value="" checked> NORMAL

The key properties are data-menu="KEEP" and name="rollStyle".

The data-menu="KEEP" prevents the mneu from closing after selecting the option and the
name="rollStyle" causes the name of the selection to be appended to roll requests made
to the roll server.

+----------------------------------+
| CONFIGURING THE CHARACTER FILES: |
+----------------------------------+

The character files contain two parts: specs on which the character is built and rolls.

Theoretically only the roll section is needed. All specs could be hard coded in the rolls
and the solution would still work. However, by using specs, it is much easier to update
characters in the future.

For example, if a character gets an ASI to an ability score in the future, if all of the
rolls were hard coded, it would mean identifying all rolls based on that ability score and
updating them. However, with the use of specs, you can defined the ability scores as specs
and then make all roll definitions using those specs. Now if an ability score changes, only
the specs are updated and all rolls update automatically.

The character file is theoretically javascript but with helper functions to make creating
a character very easy.

See the Minx.js file as an example.

All character sheet files start with an import which imports the helper functions. Keep this
line as is at the top of the file. In the case of the example Minx file, there are a few
calculations after this to determine the PB for 5E. This just allows the PB to be determines
dynamically based on the level. Such calculations are required, they just highlight that
such functionality is available.

Next the files have the specs definition. The specs essenitally associated meaningful words
or acronyms with values. This way the rolls can use the meaningful names instead and thus
make it easy to update the character. As noted, the specs don't have to be used but the
specs definition needs to exits. If not using the specs concept (not recommended) then
defined an empty specs object.

Lastly the files define the rolls object. This object contains the definition for all the rolls
that the character can make. Each roll is added to the rolls object as a unique property and
the value of the property is one of 3 roll functions.

roll.createEntry(template,formula,note,specs)

This is the roll formula used to create most roll entries. It takes a template (see below),
a roll formula, a note, and then the specs object. The exact purpose of formula and note is
dictated by the template used.

roll.createAttack([attack_names ],[ attack_formulas ],[ damage_formulas ],specs)

This roll formula is use to make attack entries. Note that the names, formuls, and damages
are arrays so you can create an attack roll that executes multiple attacks. A similar result
can be achieve using the multi roll formula (see below) but the advantage of using this
roll formula is that the summary of all attacks is summarized and addition total information
ios provided.

roll.createMulti([ rolls ])

This roll formula is used to chain different rolls together into a single output. For example,
one could create a shove prone attack roll, a claw attack roll, a claw damage roll and then
using this roll formula to string then together into a single roll request. 

+-------------------------------+
| CONFIGURING THE SERVER FILES: |
+-------------------------------+

Open the server.js file. Near the top of the file is the options definition which indicated the
location of the ssl pfx credentials file. Replace this with your own domain or IP certificate
file. If you do not have one, Lets Encrypt provides free certificates that you can obtain.

The server needs to be running in order to provide roll services. When running the server for
the first time, install dependency modules with:

npm install

To run the actual server (first time or successive) use:

node server.js

+-----------------+
| ROLL TEMPLATES: |
+-----------------+

Roll templates are the key to building rolls. There are 6 roll templates provided for system 5e
that come with the server. Most of these templates should be easily customizable for use with
other systems with very little changes.

While you can write your own roll templates using the provded helper function, the 6 roll templates
provided with this solution should cover almost all (if not all) 5E roll scenarios.

Attack:

This roll templates performs and attack and damage roll for each attack provied to it. It is used
with the roll.createAttack formula (see above). While a similar result can be achieved using
the multi formula, this template provides a better summary and damage total information.

CondAdv:

Sometimes a seqeunce will have conditional advantage. For example, a roll sequence where the first
part is a roll to knock the target prone, would have advantage on the successive attack if the target
failed to save against the prone attack. However, the success/failure is not know when the seqeunce
is being rolled. If it is desirable to generate the whole attack, as oposed to stopping and asking
if the prone attack succeded, the CondAdv template can be used. It works like the Skill template
(see below) except that it rolls advantage and then reports what the result would be with and without
advantage. The result is a single number if the higher roll was the first roll. The result is two
numbers if the second roll was the higher roll. This template can be approximated by using the
multi function to roll the attack twice but the CondAdv provides a more compact format and provides
a better indication that this is a conditional advanatge roll.

Generic:

This allows rolling of dice formula for any purpose. Typically this is use to make rolls for damage,
healing spells, etc. While it can be used to make Skill rolls, it is recommended to use the Skill
template for Skill rolls because the Generic does not support rolls with Advantage/Disadvantge.

Note:

This template is used to generate notes. It is most commonly used to describe the use of spells,
describe spell parameters, but it can be used with the multi entry to add notes to any of the
other rolls. 

Skill:

This template is used to make skill rolls. Unlike the Generic template, the Skill template supports
Advantage and Disadvantage rolls.

Storage:

This template is slightly different from the rest in that it does not only generate a roll response,
it also adjusts server side values. The storage roll is used to view and/or modify predetermines
integer resources (counts). This is typically used for things like Hit Points, Spell Slots, but it
can be used to track uses of any class specific features such as Rage, Action Surge, Second Wind, etc.

The action that the storage template takes depends on the style or note provided to it. Styles are
set by the request (i.e. the Browser Extension requesting the Character Menu defined requests).
Alternatively the notes section can provide the same information (to allow a roll definition in the
character file) to dictate what the storage template should do.

Storage templates use a file with the name:

name.storage_name.txt

Where name is the character name and storage_name is the name of the storage item. The format of the
file is:

X of Y

Where X is the current value and Y is the max value.

When Style/Note is None: The current value of storage_name is shown.
When Style/Note is a positive integer: The current value of storage_name is increased by the value.
When Style/Note is a negative integer: The current value of storage_name is decreased by the value.

Storage automatically caps values at 0 and the max value. Increasing or decreasing the value of
storage_name beyond those limits, adjusts the amount increased or decreased to the limit.

+------------------------+
| NETWORK CONSIDERATION: |
+------------------------+

The Roll20 Browser Extension talks to the standalone rll server using the public domain or IP.
This is necessary since the roll server is also the image server for the resulting images and thus
all players in the Roll20 session will need to access this server.

This means that the network configruation needs to ensure that the corresponding port (default 3000)
is mapped to the machine running the roll server. This usually requires setting up Port Forwarding
on the router to route the port to the correct machine on the LAN. It is highly suggested to set a
static IP address on the device running the server to prevent the LAN DHCP from assigning a new
IP address in which case the Port Forwarding would stop working.
