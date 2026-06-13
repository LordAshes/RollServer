import express from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const options = {
    pfx: fs.readFileSync("./ssl/lordashes_ca.fixed.pfx"),
    passphrase: process.env.CERT_PASSWORD
};

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use( "/results", 
	express.static(path.join(__dirname, "results"), { maxAge: "365d", immutable: true } )
);

app.use("/characters",
    express.static(
        path.join(__dirname, "characters"),
        {
            etag: false,
            lastModified: false,
            setHeaders: (res) => {
                res.setHeader(
                    "Cache-Control",
                    "no-store, no-cache, must-revalidate, proxy-revalidate"
                );
                res.setHeader("Pragma", "no-cache");
                res.setHeader("Expires", "0");
            }
        }
    )
);

app.get("/api/generate/:id/:system/:roll/:character{/:style}", async (req, res) => {

    const { id, system, roll, character } = req.params;
	
	let { style } = req.params;

	style = (style ? style : "None");

    console.log(`ID: ${id}, System: ${system}, Character: ${character}, Roll: ${roll}, Style: ${style}`);
	
    const alphaNumericSpace = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
	const alphaNumericSpaceMath = /^[A-Za-z0-9+=-]+(?: [A-Za-z0-9+=-]+)*$/;

    console.log("Checking Input Parameters...");
    if (!alphaNumericSpace.test(id) || !alphaNumericSpace.test(character) || !alphaNumericSpace.test(system) || !alphaNumericSpaceMath.test(style))
    {
        return res.status(400).json({ success: false, error: "Bad Formed Request" });
    }

    console.log(`Checking For System Folder... (./systems/${system}/)`);
    if (!fs.existsSync(`./systems/${system}/`))
    {
        return res.status(400).json({ success: false, error: "Unsupported System" });
    }

    console.log(`Checking For Character File... (./characters/${character}.js)`);
    if (!fs.existsSync(`./characters/${character}.js`))
    {
        return res.status(400).json({ success: false, error: "Unsupported Character" });
    }

    console.log(`Getting System Common (./systems/${system}/Common.js)`);
    let sysCommon = null;
    try
    {
        sysCommon = await import(`./systems/${system}/Common.js`);
    }
    catch (e)
    {
        return res.status(404).json({ success: false, error: "Unable to access file: " + e });
    }

    console.log("Executing System Common");
    try
    {
        const result = await sysCommon.default.roll( id, character, roll, style ? style : "None" );
		console.log(result);
        res.type("text/plain");
        res.send(result.substring(0,result.indexOf(")")+1));
    }
    catch (e)
    {
        return res.status(404).json({ success: false, error: e });
    }
});

const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`HTTPS server listening on https://localhost:${PORT}`);
    console.log(`Static image hosting available at https://localhost:${PORT}/results/<image>.png`);
});