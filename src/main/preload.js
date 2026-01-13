const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  setWindowTitle: (filePath) => ipcRenderer.invoke('window:setTitle', filePath),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  getRecentFiles: () => ipcRenderer.invoke('file:getRecent'),
  getPlatform: () => process.platform,
  setTheme: (theme) => ipcRenderer.invoke('window:setTheme', theme),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
});
