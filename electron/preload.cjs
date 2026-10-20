const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  saveLocalStore: (data) => ipcRenderer.invoke('save-local-store', data),
  loadLocalStore: () => ipcRenderer.invoke('load-local-store'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  openDataFolder: () => ipcRenderer.invoke('open-data-folder'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
