const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const csv = require('csv-parser');
require('update-electron-app')();

const literallyEverything = [];

// SET ENV
//process.env.NODE_ENV = 'production';

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
    fs.createReadStream(path.join(__dirname,"data",module+".csv"))
    .pipe(csv())
    .on('data', (data) => literallyEverything.push(data))
    .on('end', () => {
        console.log("Finished reading CSV file.");
        mainWindow.webContents.send("giveCSV",literallyEverything)
        console.log("Sent to page.")
    });
})