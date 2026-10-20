const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Path to local file database
const getLocalStorePath = () => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'index-motors-local-store.json');
};

let mainWindow = null;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1024,
      minHeight: 700,
      backgroundColor: '#09090b', // Zinc-950 to avoid white flash
      title: 'Index Motors - Dealership & Workshop Management System',
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        spellcheck: false
      }
    });

    // Custom Menu
    const menuTemplate = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open Local Data Folder',
            click: () => {
              shell.openPath(app.getPath('userData'));
            }
          },
          { type: 'separator' },
          { role: 'quit', label: 'Exit Index Motors' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Index Motors Online Support',
            click: () => {
              shell.openExternal('https://github.com/cmshakir/index-motors-manager');
            }
          },
          {
            label: 'About Index Motors Desktop',
            click: () => {
              const { dialog } = require('electron');
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'About Index Motors',
                message: 'Index Motors Desktop v3.0\nCommercial Vehicles & Heavy Workshop Manager\nSwaraj Mazda & Tata Hub',
                detail: `Local Store: ${getLocalStorePath()}\nCloud Sync: Supabase Realtime Connected\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}`
              });
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // In development or when passed --dev, load dev server
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      const indexPath = path.join(__dirname, '../dist/index.html');
      mainWindow.loadFile(indexPath);
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    // Open external links in default browser or associated desktop apps
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (
        url.startsWith('https:') ||
        url.startsWith('http:') ||
        url.startsWith('whatsapp:') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:')
      ) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.whenReady().then(() => {
    // Register IPC Handlers for Local Store
    ipcMain.handle('save-local-store', async (event, data) => {
      try {
        const filePath = getLocalStorePath();
        const json = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, json, 'utf-8');
        return { success: true, path: filePath };
      } catch (err) {
        console.error('Error saving local store:', err);
        return { success: false, error: err.message };
      }
    });

    ipcMain.handle('load-local-store', async () => {
      try {
        const filePath = getLocalStorePath();
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);
          return { success: true, data, path: filePath };
        }
        return { success: true, data: null, path: filePath };
      } catch (err) {
        console.error('Error loading local store:', err);
        return { success: false, error: err.message };
      }
    });

    ipcMain.handle('get-app-info', async () => {
      return {
        isDesktop: true,
        userDataPath: app.getPath('userData'),
        localStorePath: getLocalStorePath(),
        version: app.getVersion()
      };
    });

    ipcMain.handle('open-data-folder', async () => {
      shell.openPath(app.getPath('userData'));
      return true;
    });

    ipcMain.handle('open-external', async (event, url) => {
      try {
        if (!url || typeof url !== 'string') {
          return { success: false, error: 'Invalid URL string' };
        }
        const allowedPrefixes = ['https://', 'http://', 'whatsapp://', 'mailto:', 'tel:'];
        const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix));
        if (isAllowed) {
          await shell.openExternal(url);
          return { success: true };
        }
        return { success: false, error: 'URL scheme not permitted' };
      } catch (err) {
        console.error('Error opening external URL via Electron shell:', err);
        return { success: false, error: err.message };
      }
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
