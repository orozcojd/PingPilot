// trayUpdater.js
const { Tray, nativeImage } = require('electron');
const { statusIcons } = require('./imgData');

let tray = null;

function setTrayInstance(trayInstance) {
    tray = trayInstance;
}

function updateTrayIcon(status) {
    const dataURL = statusIcons[status] || statusIcons.gray;
    const newIcon = nativeImage.createFromDataURL(dataURL);
    if (tray) tray.setImage(newIcon);
}

module.exports = { setTrayInstance, updateTrayIcon };
