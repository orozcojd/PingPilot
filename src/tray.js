// tray.js
const { Tray, Menu, nativeImage, app, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const { trayImg, refreshIconDataURL } = require('./imgData');
const { refreshConnection } = require('./ping');
const { openIPInputWindow } = require('./windows');
const { setTrayInstance, updateTrayIcon } = require('./trayUpdater');
const { getLogFilePath } = require('./logger');

let tray = null;

function downloadLogs() {
    const logFile = getLogFilePath();
    const downloadsPath = app.getPath('downloads');
    const destination = path.join(downloadsPath, path.basename(logFile));

    fs.copyFile(logFile, destination, (err) => {
        if (err) {
            console.error('Error copying log file:', err);
            dialog.showErrorBox('Error', 'Could not copy log file to Downloads folder.');
        } else {
            dialog.showMessageBox({ message: `Logs copied to ${destination}` });
        }
    });
}

function createTray(mainWindow) {
    const icon = nativeImage.createFromDataURL(trayImg);
    tray = new Tray(icon);
    setTrayInstance(tray); // set the instance for trayUpdater to use

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Set Target IP',
            click: openIPInputWindow,
        },
        {
            label: 'Refresh',
            icon: nativeImage.createFromDataURL(refreshIconDataURL),
            click: refreshConnection,
        },
        {
            label: 'Download Logs',
            click: downloadLogs,
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
            },
        },
    ]);

    tray.setToolTip('Network Tester');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow.isVisible()) mainWindow.hide();
        else mainWindow.show();
    });
}

module.exports = { createTray, updateTrayIcon };
