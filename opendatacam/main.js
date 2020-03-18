const { exec } = require('child_process');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const fs=require('fs');
// closed for testing
// const dialog = require('electron');vi
const {Menu, MenuItem} = require('electron')
const {dialog} = require('electron');
const {ipcRenderer} = require('electron');
const {ipcMain} = require('electron');
let mainWindow;

var fname;
var fullFileName;


function createWindow() {
    console.log('before window');
    mainWindow = new BrowserWindow({
        // titleBarStyle: "default",
        // frame: true,
        width: 900,
        height: 680,
        webPreferences: {
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on('did-finish-load', function() {
        // mainWindow.webContents.executeJavaScript('document.getElementById(\'loadbtn\').addEventListener(\'click\', function(){\n' +
        //     '        ipcRenderer.send(\'load-button\', \'true\');\n' +
        //     '    });');
    });
    mainWindow.on('closed', () => mainWindow = null);

    // Custom Menu
    const template = [
        {
            label: 'Action',
            submenu: [
                {
                    label: 'Load',
                    click(){
                        loadTrigger();
                        console.log("you just clicked load");
                    }
                },
                {
                    label: 'Start',
                    click(){
                        startTrigger();
                        console.log("you just clicked start");
                    }
                },
                {
                    label: 'Terminate',
                    click(){

                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

ipcMain.on('openFile', (event, arg) => {
    // ipcMain.on('load-button', (event, arg) => {
    //     if (arg == 'true') {
    //         dialog.showOpenDialog(function (fileNames) {
    //             if (fileNames == undefined) {
    //             } else {
    //                 mainWindow.webContents.executeJavaScript("console.log(fileNames)");
    //                 readFile(fileNames[0]);
    //             }
    //         }).then(r => {
    //             fname = r.filePaths;
    //
    //             // read file name
    //             fullFileName = fname.toString().split('/').reverse()[0];
    //             console.log(fullFileName);
    //
    //             // read and edit video name in json file
    //             let rawdata = fs.readFileSync('/home/wysetime/CAT400/opendatacam/config.json');
    //             let jsonData = JSON.parse(rawdata);
    //             jsonData.VIDEO_INPUTS_PARAMS.file = fullFileName;
    //             fs.writeFileSync("/home/wysetime/CAT400/opendatacam/config.json", JSON.stringify(jsonData, null, 4));
    //
    //             // Testing to run node first followed by electron
    //             exec('PORT=8080 NODE_ENV=production node server.js', (err, stdout, stderr) => {
    //                 if (err) {
    //                     console.log('Cannot execute!');
    //                     mainWindow.webContents.executeJavaScript('console.log(\'Cannot execute!\');');
    //                     return;
    //                 }
    //                 else
    //                 {
    //                     console.log('Executed!');
    //                     mainWindow.webContents.executeJavaScript('console.log(\'Executed!\');');
    //                 }
    //                 // mainWindow.loadURL(  'http://localhost:8080');
    //             });
    //             // Testing end here
    //
    //             // mainWindow.loadURL(  'http://localhost:8080');
    //         })
    //     }
    //     else{
    //         mainWindow.webContents.executeJavaScript("console.log('false')");
    //     }
    // });

    ipcMain.on('load-button', (event, arg) => {
        loadTrigger();
    });
});

function loadTrigger(){
    // if (arg == 'true') {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames == undefined) {
            } else {
                mainWindow.webContents.executeJavaScript("console.log(fileNames)");
            }
        }).then(r => {
            fname = r.filePaths;

            // read file name
            fullFileName = fname.toString().split('/').reverse()[0];
            console.log(fullFileName);

            // read and edit video name in json file
            let rawdata = fs.readFileSync('/home/wysetime/CAT400/opendatacam/config.json');
            let jsonData = JSON.parse(rawdata);
            jsonData.VIDEO_INPUTS_PARAMS.file = fullFileName;
            // fs.writeFileSync("/home/wysetime/CAT400/opendatacam/config.json", JSON.stringify(jsonData, null, 4));

            // // Moved to startTrigger for testing
            // // Testing to run node first followed by electron
            // console.log('8080-ing');
            // exec('PORT=8080 NODE_ENV=production node server.js', (err, stdout, stderr) => {
            //     console.log('Running command');
            //     if (err) {
            //         console.log('Cannot execute!');
            //         mainWindow.webContents.executeJavaScript('console.log(\'Cannot execute!\');');
            //         return;
            //     }
            //     else
            //     {
            //         console.log('Executed!');
            //         mainWindow.webContents.executeJavaScript('console.log(\'Executed!\');');
            //     }
            // });
            // // Testing end here
        })
    // }
    // else{
    //     mainWindow.webContents.executeJavaScript("console.log('false')");
    // }
}

function terminatePrevJS(){
    // Terminate previous running js to avoid redundant js
    var ps = require('ps-node');

    ps.lookup({
        command: 'node',
        arguments: '--debug',
    }, function(err, resultList ) {
        console.log('result list here!!!!!!!!!!!!!!!!!!!!!!!!');
        if (err) {
            throw new Error( err );
        }

        resultList.forEach(function( process ){
            // if( process ){

            console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
            // }
        });
    });
}


function startTrigger(){
    console.log('start clicked');
    mainWindow.webContents.executeJavaScript("console.log('start clicked')");

    // // Testing to run node first followed by electron
    // exec('PORT=8080 NODE_ENV=production node server.js', (err, stdout, stderr) => {
    //     console.log('Running command');
    //     console.log(stdout);
    //     if (err) {
    //         console.log('Cannot execute!');
    //         mainWindow.webContents.executeJavaScript('console.log(\'Cannot execute!\');');
    //         return;
    //     }
    //     else
    //     {
    //         console.log('Executed!');
    //         mainWindow.webContents.executeJavaScript('console.log(\'Executed!\');');
    //     }
    // });
    // // Testing end here

    //TODO: here! check the output of the exec
    // Test 2
    exec('PORT=8080 NODE_ENV=production node server.js', function(err, stdout, stderr){
        console.log('Running command');
        console.log(stdout);
        if (err) {
            console.log('Cannot execute!');
            mainWindow.webContents.executeJavaScript('console.log(\'Cannot execute!\');');
            return;
        }
        else
        {
            console.log('Executed!');
            mainWindow.webContents.executeJavaScript('console.log(\'Executed!\');');
        }
    });
    // End Test 2

    setTimeout(function () {
        console.log('delayed');
        mainWindow.loadURL(  'http://localhost:8080');
    }, 10000)
}

// ipcMain.on('start-button', (event, arg) => {
//     console.log('start clicked');
//     mainWindow.webContents.executeJavaScript("console.log('start clicked')");
//     mainWindow.loadURL(  'http://localhost:8080');
// });

ipcMain.on('start-button', (event, arg) => {
    startTrigger();
});


app.disableHardwareAcceleration()
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});