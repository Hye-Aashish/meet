const { app, BrowserWindow, ipcMain, desktopCapturer, screen, session } = require('electron');
const path = require('path');

let mainWindow = null;
let pendingScreenShareResolve = null;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.min(1400, width),
        height: Math.min(900, height),
        minWidth: 800,
        minHeight: 600,
        title: 'Nexus Meeting Portal',
        icon: path.join(__dirname, '../public/favicon.ico'),
        autoHideMenuBar: true,
        backgroundColor: '#0a0a12',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
    } else {
        // Start local server for production
        try {
            const { startServer } = require('../dist/server.js');
            startServer().catch(err => console.error("❌ Failed to start built-in server:", err));
        } catch (err) {
            console.error("❌ Could not load built-in server:", err);
        }
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// === Get screen sources with thumbnails ===
ipcMain.handle('get-screen-sources', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen', 'window'],
            thumbnailSize: { width: 320, height: 180 },
            fetchWindowIcons: true,
        });

        return sources.map(source => ({
            id: source.id,
            name: source.name,
            displayId: source.display_id,
            thumbnail: source.thumbnail.toDataURL(),
            appIcon: source.appIcon ? source.appIcon.toDataURL() : null,
        }));
    } catch (err) {
        console.error('Error getting sources:', err);
        return [];
    }
});

// === Handle source selection from renderer ===
ipcMain.handle('select-screen-source', async (_event, sourceId) => {
    console.log('[Main] Source selected:', sourceId);
    if (pendingScreenShareResolve) {
        const resolve = pendingScreenShareResolve;
        pendingScreenShareResolve = null;
        try {
            const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
            const selected = sources.find(s => s.id === sourceId);
            if (selected) {
                console.log('[Main] Granting access to:', selected.name);
                resolve({ video: selected });
                return true;
            } else {
                console.log('[Main] Source not found, trying first available');
                // Fallback: try to grant first available source
                if (sources.length > 0) {
                    resolve({ video: sources[0] });
                    return true;
                }
                resolve({});
                return false;
            }
        } catch (err) {
            console.error('[Main] Error resolving source:', err);
            resolve({});
            return false;
        }
    }
    return false;
});

// === Handle cancel from renderer ===
ipcMain.handle('cancel-screen-share', async () => {
    console.log('[Main] Screen share cancelled');
    if (pendingScreenShareResolve) {
        const resolve = pendingScreenShareResolve;
        pendingScreenShareResolve = null;
        resolve({});
    }
});

// === Silent screen capture for monitoring ===
ipcMain.handle('capture-screenshot', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 640, height: 360 },
        });
        if (sources.length > 0) {
            return sources[0].thumbnail.toJPEG(50).toString('base64');
        }
        return null;
    } catch (err) {
        console.error('[Main] Screenshot capture error:', err);
        return null;
    }
});

app.whenReady().then(() => {
    // Intercept getDisplayMedia — show our custom picker instead of Chrome's
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        console.log('[Main] Display media requested — showing custom picker');
        pendingScreenShareResolve = callback;

        // Tell renderer to show the custom picker
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('show-screen-picker');
        }
    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
