// src/windows.js
const { BrowserWindow, nativeImage } = require('electron');
const { taskbarImg } = require('./imgData');

const iconImage = nativeImage.createFromDataURL(taskbarImg);

/**
 * Create and return the main app window.
 */
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        icon: iconImage,
        width: 150,
        height: 150,
        resizable: false,
        frame: false,
        focusable: false, // key for a non-interactive display
        transparent: false,
        fullscreenable: false,
        maximizable: false,
        alwaysOnTop: true,
        closable: true,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // provided by Forge webpack config
            devTools: false,
        },
    });

    mainWindow.setTitle('');
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    return mainWindow;
}

let ipWindow = null;

/**
 * Opens (or focuses) the IP input window.
 */
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
        transparent: false,
        fullscreenable: false,
        maximizable: false,
        alwaysOnTop: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // using the same preload here
            contextIsolation: true,
        },
    });

    // Load the separate IP input window bundle.
    ipWindow.loadURL(IP_INPUT_WINDOW_WEBPACK_ENTRY);

    ipWindow.on('closed', () => {
        ipWindow = null;
    });
}

module.exports = { createMainWindow, openIPInputWindow };
