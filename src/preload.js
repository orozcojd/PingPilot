// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    checkConnection: () => ipcRenderer.invoke('check-connection'),
    onConnectionStatusUpdate: (callback) => {
        console.log("Called on status update")
        ipcRenderer.on('connection-status-update', callback);
    },
    removeConnectionStatusUpdate: (callback) => {
        ipcRenderer.removeListener('connection-status-update', callback);
    },
    setTargetIP: (ip) => ipcRenderer.send('set-target-ip', ip),
    getTargetIP: () => ipcRenderer.invoke('get-target-ip'),
});
