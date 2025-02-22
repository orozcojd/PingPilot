// src/ping.js
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const ping = require('ping');
const { determineStatus } = require('./utils');
const { updateTrayIcon } = require('./trayUpdater');
const { log } = require('./logger'); // import our logger

let targetIP = "8.8.8.8";
const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');

function getTargetIP() {
    try {
        const data = fs.readFileSync(configPath);
        return JSON.parse(data).targetIP || '8.8.8.8';
    } catch (err) {
        return '8.8.8.8';
    }
}
// Function to save IP to config file.
function setTargetIP(ip) {
    const data = { targetIP: ip };
    log.info(`Target IP updated to: ${ip}`);
    fs.writeFileSync(configPath, JSON.stringify(data));
}
/**
 * Refreshes the network connection by pinging the target IP,
 * updates the tray icon, and sends status updates via IPC.
 */
async function refreshConnection() {
    try {
        targetIP = getTargetIP();
        const res = await ping.promise.probe(targetIP, { timeout: 60 * 1000 });
        const latency = res.alive ? parseFloat(res.time) : null;
        const status = determineStatus(res.alive, latency);
        updateTrayIcon(status);

        log.info(`Ping update: targetIP=${targetIP}, alive=${res.alive}, latency=${latency}, status=${status}`);
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
        log.error(`Ping error: targetIP=${targetIP}, error=${error.message}`);
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

module.exports = { refreshConnection, setTargetIP, getTargetIP };
