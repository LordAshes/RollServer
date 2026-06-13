const DOMAIN = "https://lordashes.ca:3000";

setTimeout(addListener, 5000);

function httpGet(url)
{
	return new Promise((resolve, reject) =>
	{
		chrome.runtime.sendMessage(
		{
			action: "httpGet",
			url: url
		},
		(response) =>
		{
			if(chrome.runtime.lastError)
			{
				reject(chrome.runtime.lastError);
				return;
			}

			if(!response)
			{
				reject("No response from background worker");
				return;
			}

			if(response.success)
			{
				resolve(response.data);
			}
			else
			{
				reject(response.error);
			}
		});
	});
}

function addListener()
{
	console.log("Executing Modification");

	let els = Array.from(document.getElementsByClassName("ui-autocomplete-input"));

	els.forEach((el)=>
	{
		if(el.getAttribute("title")=="Text Chat Input")
		{
			console.log("Adding Roll Macros Listener");

			el.addEventListener("keydown", (event) =>
			{
				// console.log("Key: "+event.key);

				if(event.key.toUpperCase()=="ENTER")
				{
					const request = event.currentTarget.value;

					console.log({request});

					if(request.startsWith("@"))
					{
						impersonate(request.substring(1));
						modify("");

						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();
					}
				}
				else if(event.key=="`")
				{
					openMenu();
					return;
				}
			}, true);
		}
	});
}

function modify(txt)
{
	let els = Array.from(document.getElementsByClassName("ui-autocomplete-input"));

	els.forEach((el)=>
	{
		if(el.getAttribute("title")=="Text Chat Input")
		{
			el.value = txt;
		}
	});
}

async function rollRequest(request)
{
	if(request=="") return;

	console.log("Rolling '"+request+"'...");

	modify("");

	try
	{
		for(let subrequest of request.split(","))
		{
			const uid = new Date().getTime();

			const url = DOMAIN + "/api/generate/" + uid + "/" + subrequest;

			console.log({url});

			const result = await httpGet(url);

			if(result.indexOf("Undefined array key")>-1)
			{
				alert(result);
				modify("Unrecognized Request: "+request);
				document.getElementById("chatSendBtn").click();
			}
			else
			{
				console.log({result});
				modify(result);
				document.getElementById("chatSendBtn").click();
			}
		}
	}
	catch(err)
	{
		console.log(err);
		alert("Request failed:\n" + err);
	}
}

function impersonate(name)
{
	console.log({name});

	const selection = document.getElementById("speakingas");
	var character = selection.options[selection.selectedIndex].innerHTML;
	if(character.indexOf("(")>-1) { character = character.substring(0,character.indexOf("(")).trim(); }

	const sysRef = name.substring(0,name.indexOf("/"));
	name = name.substring(name.indexOf("/")+1);
	
	console.log(`Impersonate: '${character}' impersonates '${name}' (System ${sysRef})...`);

	modify("");

	rollRequest(sysRef+"/"+name+"/"+character);

	if(name.trim().indexOf(" ")>-1)
	{
		setTimeout(()=>{rollRequest(`${sysRef}/Hit Points/${name}/=1000`);},2000);
	}
	else
	{
		setTimeout(()=>{rollRequest(`${sysRef}/Hit Points/${name}`);},2000);
	}

	const input = document.querySelector('input[placeholder="Display Name"]');

	const nativeSetter =
		Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			"value"
		).set;

	nativeSetter.call(input, name);

	input.dispatchEvent(
		new KeyboardEvent("keydown", { bubbles: true })
	);

	input.dispatchEvent(
		new KeyboardEvent("keypress", { bubbles: true })
	);

	input.dispatchEvent(
		new KeyboardEvent("keyup", { bubbles: true })
	);

	input.dispatchEvent(
		new Event("input", { bubbles: true })
	);

	input.dispatchEvent(
		new Event("change", { bubbles: true })
	);
}

function rollRequestWithPrompt(request)
{
	let value = prompt("Value:");

	console.log("Posting request '"+request+"'");

	rollRequest(request+"/"+value);
}

async function openMenu()
{
	const selection = document.getElementById("speakingas");

	var character =
		selection.options[selection.selectedIndex].innerHTML;

	if(character.indexOf("(")>-1)
	{
		character =
			character.substring(
				0,
				character.indexOf("(")
			).trim();
	}

	console.log("Speaking: "+character);

	closeMenu(null);

	const rollMenu = document.createElement("div");
	rollMenu.id = "rollMenu";

	document.body.appendChild(rollMenu);

	try
	{
		const html = await httpGet( DOMAIN + "/characters/" + character + ".menu.html" );

		rollMenu.innerHTML = html;

		rollMenu.querySelectorAll(
			"button[data-impersonate]"
		).forEach(btn =>
		{
			btn.addEventListener("click", () =>
			{
				impersonate(
					btn.getAttribute("data-impersonate")
				);
			});
		});

		rollMenu.querySelectorAll(
			"button[data-roll]"
		).forEach(btn =>
		{
			btn.addEventListener("click", () =>
			{
				const base =
					btn.getAttribute("data-roll");

				const selected =
					rollMenu.querySelector(
						'input[name="rollStyle"]:checked'
					);

				const modifier =
					selected ? selected.value : "";

				rollRequest(base + modifier);
			});
		});

		rollMenu.querySelectorAll(
			"button[data-roll-prompt]"
		).forEach(btn =>
		{
			btn.addEventListener("click", () =>
			{
				rollRequestWithPrompt(
					btn.getAttribute(
						"data-roll-prompt"
					)
				);
			});
		});

		rollMenu.querySelectorAll(
			"button[data-append]"
		).forEach(btn =>
		{
			btn.addEventListener("click", () =>
			{
				const append =
					btn.getAttribute(
						"data-append"
					);

				rollMenu
					.querySelector("#rollModifier")
					.setAttribute(
						"data-append",
						append
					);
			});
		});
	}
	catch(err)
	{
		console.log(err);
		alert("Failed to load menu:\n" + err);
	}

	setTimeout(() =>
	{
		document.addEventListener(
			"click",
			(e) =>
			{
				if(
					e.target?.getAttribute?.("data-menu")
					!=
					"KEEP"
				)
				{
					closeMenu();
				}
			}
		);
	}, 1000);
	
	modify("");
}

function closeMenu()
{
	var el = document.getElementById("rollMenu");

	if(el!=null)
	{
		el.remove();
		document.removeEventListener(
			"click",
			closeMenu
		);
	}
}