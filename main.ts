const {app, BrowserWindow} = require('electron');
import path = require('path');
const url = require('url');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

app.on('error', console.log);

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 600, height: 600,
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

  win.on('closed', () => {
    win = null
  });
}