#! /usr/bin/env node

var process = require("process");

//Spawn electron
console.log("[App] Spawning app...")

var spawn = require("child_process").spawn;
//First run that: npm ls -g
var output = "";
var check = false;
spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["ls", "-g"]).stdout.on("data", function (data) {
    output += data.toString();
}
).on("close", function () {
    //If output doesnt contains "electron"
    if (!output.includes("electron")) {
        console.log("[App] Electron not found, installing...");
        //Install electron
        //npm install -g electron
        //Till close do nothing
        spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["install", "-g", "electron"]).stdout.on("data", function (data) {
        }).on("close", function () {
            console.log("[App] Electron installed, spawning app...");
            spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["root", "-g"]).stdout.on("data", function (data) {
                //Command output + / + webm-to-mp4-gui + / + app.js
                var path = data.toString().trim() + "/webm-to-mp4-gui/";
                console.log("[App] Got global npm install path, spawning app...");
                //Command to spawn is npm start --prefix <path>
                //Spawn in current terminal
                spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["start", "--prefix", path], { "stdio": "inherit" });
                console.log("[App] App spawned.");
            })
        });
    }
    else {
        console.log("[App] Electron found, spawning app...");
        spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["root", "-g"]).stdout.on("data", function (data) {
            //Command output + / + webm-to-mp4-gui + / + app.js
            var path = data.toString().trim() + "/webm-to-mp4-gui/";
            console.log("[App] Got global npm install path, spawning app...");
            //Command to spawn is npm start --prefix <path>
            //Spawn in current terminal
            spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["start", "--prefix", path], { "stdio": "inherit" });
            console.log("[App] App spawned.");
        })
    }
});