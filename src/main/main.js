const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;
let recentFiles = [];
const RECENT_FILES_PATH = path.join(app.getPath('userData'), 'recent-files.json');

async function loadRecentFiles() {
  try {
    const data = await fs.readFile(RECENT_FILES_PATH, 'utf-8');
    recentFiles = JSON.parse(data);
  } catch (error) {
    recentFiles = [];
  }
}

async function saveRecentFiles() {
  try {
    await fs.writeFile(RECENT_FILES_PATH, JSON.stringify(recentFiles, null, 2));
  } catch (error) {
    console.error('Failed to save recent files:', error);
  }
}

function addRecentFile(filePath) {
  recentFiles = recentFiles.filter(f => f !== filePath);
  recentFiles.unshift(filePath);
  recentFiles = recentFiles.slice(0, 10);
  saveRecentFiles();
}

function updateWindowTitle(filePath = null) {
  if (filePath) {
    mainWindow.setTitle(`MiraDo - ${filePath}`);
  } else {
    mainWindow.setTitle('MiraDo');
  }
}

function createWindow() {
  const isMac = process.platform === 'darwin';
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#1e1e1e',
    title: 'MiraDo',
    vibrancy: isMac ? 'under-window' : undefined,
    visualEffectState: isMac ? 'active' : undefined
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  await loadRecentFiles();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow.close();
});

ipcMain.handle('window:setTitle', (event, filePath) => {
  updateWindowTitle(filePath);
});

ipcMain.handle('window:setTheme', (event, theme) => {
  if (process.platform === 'darwin') {
    const { nativeTheme } = require('electron');
    nativeTheme.themeSource = theme === 'dark' ? 'dark' : 'light';
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    addRecentFile(filePath);
    return filePath;
  }
  return null;
});

ipcMain.handle('file:read', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file:getRecent', async () => {
  const validFiles = [];
  for (const filePath of recentFiles) {
    try {
      await fs.access(filePath);
      validFiles.push(filePath);
    } catch (error) {
      // File no longer exists
    }
  }
  recentFiles = validFiles;
  if (validFiles.length !== recentFiles.length) {
    await saveRecentFiles();
  }
  return validFiles;
});
