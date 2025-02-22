// tray.js
const { Tray, Menu, nativeImage, app } = require('electron');
const { trayImg, refreshIconDataURL } = require('./imgData');
const { refreshConnection } = require('./ping');
const { openIPInputWindow } = require('./windows');
const { setTrayInstance, updateTrayIcon } = require('./trayUpdater');

let tray = null;

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
