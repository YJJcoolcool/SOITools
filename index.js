const electron = require('electron');
const url = require('url');
const path = require('path');

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
    mainWindow.removeMenu();
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    })
});