const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
    selectScreenSource: (sourceId) => ipcRenderer.invoke('select-screen-source', sourceId),
    cancelScreenShare: () => ipcRenderer.invoke('cancel-screen-share'),
    captureScreenshot: () => ipcRenderer.invoke('capture-screenshot'),
    onShowScreenPicker: (callback) => {
        ipcRenderer.on('show-screen-picker', callback);
        return () => ipcRenderer.removeListener('show-screen-picker', callback);
    },
});
