"use strict";
exports.__esModule = true;
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var path = require("path");
var url = require('url');
app.on('window-all-closed', function () {
    app.quit();
});
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit();
});
app.on('error', console.log);
var win;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 600, height: 600,
        webPreferences: {
            webSecurity: false
        }
    });
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.htm'),
        protocol: 'file:',
        slashes: true
    }));
    // Open the DevTools.
    //win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
