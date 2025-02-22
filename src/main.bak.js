const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const ping = require('ping');

import { refreshIconDataURL, statusIcons, taskbarImg, trayImg } from './imgData';
import { determineStatus } from "./utils";

let mainWindow;
let tray;
let ipWindow;
let targetIP = "8.8.8.8";

const iconImage = nativeImage.createFromDataURL(taskbarImg);
function openIPInputWindow() {
  if (ipWindow) {
    ipWindow.focus();
    return;
  }
  ipWindow = new BrowserWindow({
    width: 250,
    height: 100,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // or create a separate preload if needed
      contextIsolation: true,
    },
  });
  ipWindow.loadURL(IP_INPUT_WINDOW_WEBPACK_ENTRY)
  // Load a minimal HTML file (e.g., ipInput.html) that contains an input for the IP.
  // ipWindow.loadFile('src/ipInput.html');

  ipWindow.on('closed', () => {
    ipWindow = null;
  });
}

function updateTrayIcon(status) {
  // Use the corresponding icon or fallback to gray.
  const dataURL = statusIcons[status] || statusIcons.gray;
  const newIcon = nativeImage.createFromDataURL(dataURL);
  tray.setImage(newIcon);
}

async function refreshConnection() {
  try {
    const res = await ping.promise.probe(targetIP, { timeout: 60 * 1000 });
    const latency = res.alive ? parseFloat(res.time) : null;
    const status = determineStatus(res.alive, latency);
    updateTrayIcon(status);

    // Send updated status to renderer.
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('connection-status-update', { alive: res.alive, latency, status });
    }

    return { alive: res.alive, latency };
  } catch (error) {
    updateTrayIcon('red');
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('connection-status-update', { alive: false, latency: null, status: 'red' });
    }
    return { alive: false, latency: null };
  }
}

function createTray() {
  const icon = nativeImage.createFromDataURL(trayImg)

  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Set Target IP',
      click: () => {
        openIPInputWindow();
      },
    },
    {
      label: 'Refresh',
      icon: nativeImage.createFromDataURL(refreshIconDataURL),
      click: () => {
        refreshConnection();
      },
    },
    {
      label: 'Toggle App',
      click: () => {
        if (mainWindow.isVisible()) mainWindow.hide();
        else mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Network Tester');
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  })
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: iconImage,
    width: 150,
    height: 150,
    resizable: false,
    frame: false,
    focusable: false, //THIS IS THE KEY
    transparent: false,
    fullscreenable: false,
    maximizable: false,
    alwaysOnTop: true,
    closable: true,
    parent: mainWindow,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: false
    },
  });
  mainWindow.setTitle('');
  // Load the index.html (or webpack entry) of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Optionally, remove the following if you don't want DevTools to open.
  // mainWindow.webContents.openDevTools();
};
ipcMain.handle('get-target-ip', () => {
  return targetIP;
});
ipcMain.on('set-target-ip', (event, ip) => {
  targetIP = ip;
  // Optionally trigger a refresh immediately after setting:
  refreshConnection();
});


// Expose the connection check via IPC.
ipcMain.handle('check-connection', async () => {
  return await refreshConnection();
});


app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  createTray();


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, it's common to keep the app running until the user quits explicitly.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
