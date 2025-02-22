// src/main.js
const { app, BrowserWindow, Menu } = require('electron');
const { createMainWindow } = require('./windows');
const { createTray } = require('./tray');
const { setupIPC } = require('./ipc');

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);

    // Create the main window and store it globally for access by other modules.
    const mainWindow = createMainWindow();
    global.mainWindow = mainWindow;

    // Create the tray icon (pass the mainWindow for toggle functionality)
    createTray(mainWindow);

    // Setup all IPC channels.
    setupIPC();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            const newWindow = createMainWindow();
            global.mainWindow = newWindow;
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
