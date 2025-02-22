// src/ipc.js
const { ipcMain } = require('electron');
const { setTargetIP, getTargetIP, refreshConnection } = require('./ping');

/**
 * Sets up IPC channels to get/set the target IP and check the connection.
 */
function setupIPC() {
    ipcMain.handle('get-target-ip', () => {
        return getTargetIP();
    });

    ipcMain.on('set-target-ip', (event, ip) => {
        setTargetIP(ip);
    });

    ipcMain.handle('check-connection', async () => {
        return await refreshConnection();
    });
}

module.exports = { setupIPC };
