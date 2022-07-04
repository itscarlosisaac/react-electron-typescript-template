import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import updater from './updater';
import windowStateKeeper from 'electron-window-state'
import * as path from "path";

const isDev = !app.isPackaged;
let win: BrowserWindow | null = null;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultHeight: 800,
    defaultWidth: 600
  })
  // Check for app updates;
  setTimeout(updater, 3000)

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 400,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.IS_DEV) {
    console.log("IS DEV")
    win.loadURL('http://localhost:3000');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/index.html`);
  }

  mainWindowState.manage(win);

  win.on('closed', () : void => win = null);

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }

  // Hot Reloading
  if (isDev) {
    'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});



ipcMain.on("message", (event: any, args: any) => {
  console.log("EVEnt:",event);
  console.log("Args:",args);
})