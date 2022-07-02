import { autoUpdater } from 'electron-updater';
import {dialog} from 'electron';

// Configuring debugging with electron log
autoUpdater.logger = require("electron-log")

// Autoupdater Logger interface does not contain the transports type.
//autoUpdater.logger.transports.file.level = "info";

// Removing auto download
autoUpdater.autoDownload = false;

const updater = () => {
    // Logging updates
    console.log("Checking for updates");
    autoUpdater.logger.info("Checking for updates");

    autoUpdater.checkForUpdates();
    // Listen if the update has been found.

    autoUpdater.on('update-available', () => {
        // Prompt the user to download the update.
        dialog.showMessageBox({
            type: 'info',
            title: "Update available",
            message: "A new version of the app is available.",
            buttons: [ "Update", "Try again later"]
        }).then(result => {
            const buttonIndex = result.response;

            // Button index 0 = Update
            if( buttonIndex == 0) {
                autoUpdater.downloadUpdate()
                    .then(result => { console.log(result)})
                    .catch(e => console.error("An error occured", e))
            }
        })
    })

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: "Update ready",
            message: "Install & restart now?",
            buttons: [ "Yes", "Later"]
        }).then(result => {
            const buttonIndex = result.response;
            // Button index 0 = Update
            if( buttonIndex == 0) {
                autoUpdater.quitAndInstall(false, true);
            }
        })
    })
}
export default updater;