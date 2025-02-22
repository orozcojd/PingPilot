// src/ping.js
const ping = require('ping');
const { determineStatus } = require('./utils');
const { updateTrayIcon } = require('./trayUpdater');

let targetIP = "8.8.8.8";

/**
 * Refreshes the network connection by pinging the target IP,
 * updates the tray icon, and sends status updates via IPC.
 */
async function refreshConnection() {
    try {
        const res = await ping.promise.probe(targetIP, { timeout: 60 * 1000 });
        const latency = res.alive ? parseFloat(res.time) : null;
        const status = determineStatus(res.alive, latency);
        updateTrayIcon(status);

        if (global.mainWindow && global.mainWindow.webContents) {
            global.mainWindow.webContents.send('connection-status-update', {
                alive: res.alive,
                latency,
                status,
            });
        }
        return { alive: res.alive, latency };
    } catch (error) {
        updateTrayIcon('red');
        if (global.mainWindow && global.mainWindow.webContents) {
            global.mainWindow.webContents.send('connection-status-update', {
                alive: false,
                latency: null,
                status: 'red',
            });
        }
        return { alive: false, latency: null };
    }
}

/**
 * Updates the target IP and triggers an immediate connection refresh.
 */
function setTargetIP(ip) {
    targetIP = ip;
    refreshConnection();
}

/**
 * Returns the current target IP.
 */
function getTargetIP() {
    return targetIP;
}

module.exports = { refreshConnection, setTargetIP, getTargetIP };
