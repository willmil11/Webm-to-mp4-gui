#! /usr/bin/env node

console.log("[App] Reading app...")

var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-accelerated-video-encode");
app.commandLine.appendSwitch("disable-vaapi");
app.commandLine.appendSwitch("disable-software-rasterizer");

var createWindow = function () {
    var window = new BrowserWindow({
        width: 800,
        height: 600
    })
    window.setMenuBarVisibility(false)

    window.loadFile('index.html')

    return window;
}

app.on("window-all-closed", function(){
    console.log("[App] All windows closed, exiting...")
    app.quit();
})

app.whenReady().then(function () {
    console.log("[App] App is ready, creating UI...")
    createWindow();
    console.log("[App] UI created, loading app...")

    //App code
    var http = require('http');
    var fs = require('fs');
    var process = require('process');
    var webmToMp4 = require("webm-to-mp4");
    var dialog = require("electron").dialog;

    console.log("[App] Reading app files...")
    var script = `${fs.readFileSync(__dirname + "/script.js")}`;
    console.log("[App] App files read, starting server...")

    http.createServer(function (req, res) {
        console.log("[App] Got request from UI, processing...")
        var data = JSON.parse(decodeURI(req.url.slice(1)));
        if (data.action === "load") {
            console.log("[App] Got load request, processing...")
            //Open dialog box to get file with electron
            console.log("[App] Opening dialog box...")
            dialog.showOpenDialog({
                "title": "Choose webm file",
                "properties": ["openFile"],
                "filters": [
                    { "name": "Webm", "extensions": ["webm"] }
                ]
            }).then(function (result) {
                console.log("[App] Got dialog box result, processing...")
                //Get file path
                var path = result.filePaths[0];
                //Result path is same path but as mp4
                var resultpath;
                try{
                    resultpath = path.slice(0, path.length - 5) + ".mp4";
                    if (path.includes(" ")) {
                        path = require("path").resolve(path);
                        //Redo result path
                        resultpath = require("path").resolve((path.slice(0, path.length - 5) + ".mp4"));
                    }
                }
                catch (error){
                    //File dialog box canceled
                    console.log("[App] Dialog box canceled, sending info to UI...")
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(JSON.stringify({
                        "exit_code": 1,
                        "error": "Dialog box canceled",
                        "errorcode": "DIALOG_BOX_CANCELED"
                    }))
                    console.log("[App] Info sent to UI...")
                    console.log("[App] Request from UI finished.");
                    return;
                }
                console.log("[App] Got file path (" + path + "), converting...")
                console.log("[App] Will write output to " + resultpath + "...")
                //Trying to read file
                try {
                    console.log("[App] Reading file...")
                    var file = fs.readFileSync(path);
                    console.log("[App] File read, converting...")
                }
                catch (err) {
                    console.log("[App] Error reading file, sending error to UI...")
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(JSON.stringify({
                        "exit_code": 1,
                        "error": "Error reading file",
                        "node_error": `${err}`,
                        "errorcode": "ERROR_READING_FILE"
                    }))
                    console.log("[App] Error sent to UI...")
                    console.log("[App] Request from UI finished.");
                    return;
                }
                //Converting file
                console.log("[App] Converting file...")
                try {
                    var converted = Buffer.from(webmToMp4(file))
                }
                catch (error) {
                    console.log("[App] Error converting file, sending error to UI...")
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(JSON.stringify({
                        "exit_code": 1,
                        "error": "Error converting file",
                        "node_error": `${error}`,
                        "errorcode": "ERROR_CONVERTING_FILE"
                    }))
                    console.log("[App] Error sent to UI...")
                    console.log("[App] Request from UI finished.");
                    return;
                }
                console.log("[App] File converted, writing file (" + resultpath + ")...")
                //Try writing file
                try {
                    fs.writeFileSync(resultpath, converted);
                }
                catch (err) {
                    console.log("[App] Error writing file, sending error to UI...")
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(JSON.stringify({
                        "exit_code": 1,
                        "error": "Error writing file",
                        "node_error": `${err}`,
                        "errorcode": "ERROR_WRITING_FILE"
                    }))
                    console.log("[App] Error sent to UI...")
                    console.log("[App] Request from UI finished.");
                    return;
                }
                //File written
                console.log("[App] File written, sending success to UI...")
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(JSON.stringify({
                    "exit_code": 0,
                    "wroteto": resultpath,
                    "error": null,
                    "errorcode": null
                }))
                console.log("[App] Success sent to UI...")
                console.log("[App] Request from UI finished.");
            })
        }
        else {
            if (data.action === "getscript") {
                console.log("[App] Got getscript request, processing...")
                console.log("[App] Sending script...")
                //200, javascript writehead
                res.writeHead(200, { "Content-Type": "application/javascript" });
                res.end(script);
                console.log("[App] Script sent to UI...")
                console.log("[App] Request from UI finished.");
            }
            else {
                //Corrupt request
                console.log("[App] Got corrupt request, sending error to UI...")
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(JSON.stringify({
                    "exit_code": 1,
                    "error": "Corrupt request",
                    "errorcode": "CORRUPT_REQUEST"
                }))
                console.log("[App] Error sent to UI...")
                console.log("[App] Request from UI finished.");
                return;
            }
        }
    }).listen(2378, "127.0.0.1");

    console.log("[App] App loaded, waiting for requests from UI...")
})