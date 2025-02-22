// src/main/logger.js
const log = require('electron-log');
const fs = require('fs');

const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB

// Get the log file path (electron-log writes logs in the userData directory by default)
const logFilePath = log.transports.file.getFile().path;

// Check the log file size and rotate (archive) it if needed.
function checkLogSizeAndRotate() {
    fs.stat(logFilePath, (err, stats) => {
        if (!err && stats.size > MAX_LOG_SIZE) {
            // Create an archive file name with a timestamp.
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const archivePath = `${logFilePath}.${timestamp}`;
            fs.rename(logFilePath, archivePath, (err) => {
                if (!err) {
                    log.info('Log file rotated:', archivePath);
                } else {
                    log.error('Error rotating log file:', err);
                }
            });
        }
    });
}

// Expose a function to get the current log file path.
function getLogFilePath() {
    return logFilePath;
}

module.exports = { log, checkLogSizeAndRotate, getLogFilePath };
