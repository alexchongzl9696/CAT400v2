const { exec } = require('child_process');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const fs=require('fs');
// closed for testing
// const dialog = require('electron');

const {dialog} = require('electron');
const {ipcRenderer} = require('electron');
const {ipcMain} = require('electron');
let mainWindow;

var fname;
var fullFileName;

function createWindow() {

    console.log('before window');
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            nodeIntegration: true
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
}

ipcMain.on('openFile', (event, arg) => {
    ipcMain.on('load-button', (event, arg) => {
        if (arg == 'true') {
            dialog.showOpenDialog(function (fileNames) {
                if (fileNames == undefined) {
                } else {
                    mainWindow.webContents.executeJavaScript("console.log(fileNames)");
                    readFile(fileNames[0]);
                }
            }).then(r => {
                fname = r.filePaths;
                fullFileName = fname.toString().split('/').reverse()[0];
                console.log(fullFileName);
                let rawdata = fs.readFileSync('/home/wysetime/CAT400/opendatacam/config.json');
                let jsonData = JSON.parse(rawdata);
                jsonData.VIDEO_INPUTS_PARAMS.file = fullFileName;
                fs.writeFileSync("/home/wysetime/CAT400/opendatacam/config.json", JSON.stringify(jsonData, null, 4));

                // Testing to run node first followed by electron
                exec('PORT=8080 NODE_ENV=production node server.js', (err, stdout, stderr) => {
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
                    // mainWindow.loadURL(  'http://localhost:8080');
                });
                // Testing end here

                // mainWindow.loadURL(  'http://localhost:8080');
            })
        }
        else{
            mainWindow.webContents.executeJavaScript("console.log('false')");
        }
    })
});

ipcMain.on('start-button', (event, arg) => {
    console.log('start clicked');
    mainWindow.webContents.executeJavaScript("console.log('start clicked')");
    mainWindow.loadURL(  'http://localhost:8080');
});


function readFile(filepath){
    fs.readFile(filepath,'utf-8',(err,data)=>{
        if(err){
            alert("An error :"+err.message)
            return
        }
        console.log('data = '+data);
    })
}

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
