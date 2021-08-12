const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const csv = require('csv-parser');
require('update-electron-app')();

let literallyEverything = [];

// SET ENV
process.env.NODE_ENV = 'production';

const {app, BrowserWindow, globalShortcut, ipcMain} = electron;

let mainWindow;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        width: 650,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', function(){
        app.quit();
    });
    if (process.env.NODE_ENV == 'production') {
        mainWindow.removeMenu();
    }
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    })
	globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload()
	})
});

ipcMain.on("getListOfCSVs", ()=>{
    console.log("Getting List of CSVs...")
    var files = fs.readdirSync(path.join(__dirname,"data"));
    files = files.filter(getOnlyCSV);
    mainWindow.webContents.send("giveListOfCSVs",files)
})

function getOnlyCSV(filename) {
    return filename.endsWith(".csv");
}

ipcMain.on("getCSV", (e,module)=>{
    console.log("Getting CSV of "+module+"...")
    fs.readFile(path.join(__dirname,"data",module+".csv"), 'utf8', (err,data)=>{
        if (err){
            console.log(err);
            return;
        }
        literallyEverything = csvToArray(data);
        mainWindow.webContents.send("giveCSV",literallyEverything)
    });
})

let newarr = Array();

function csvToArray(str) {
    newarr = Array()
    let rows = str.split("\n");
    for (var i=1; i<rows.length-2; i++){
        let title = rows[i].split(",")[0];
        let content=rows[i].substring(rows[i].indexOf(",") + 1).trim();
        if (content.startsWith('"')){
            content = content.substr(1,content.length);
        }
        if (content.endsWith('"')){
            content = content.substr(0,content.length-1);
        }
       newarr.push({"title": title, "content":content});
    }
    return newarr;
}