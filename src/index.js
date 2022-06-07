const {app, BrowserWindow, clipboard, ipcMain} = require('electron');
const shortcuts = require('electron-localshortcut');
const Store = require('electron-store');
const {autoUpdater} = require('electron-updater');

Store.initRenderer();

const settings = new Store();

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.allowRendererProcessReuse = true;


ipcMain.on('docs', (event) => event.returnValue = app.getPath('documents'));

const createWindow = () => {
    let win = new BrowserWindow({
        width: 1900,
        height: 1000,
        title: `Better Kirka Client`,
        backgroundColor: '#000000',
        icon: __dirname + "/icon.ico",
        webPreferences: {
            preload: __dirname + '/preload/ingame.js',
            nodeIntegration: false,
        },
    });
    win.removeMenu();

    if (settings.get('fullScreen') === undefined) settings.set('fullScreen', true);

    win.setFullScreen(settings.get('fullScreen'));

    shortcuts.register(win, "Escape", () => win.webContents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(win, "F4", () => win.loadURL('https://kirka.io/'));
    shortcuts.register(win, "F6", () => win.loadURL(clipboard.readText()));
    shortcuts.register(win, 'F11', () => {
        win.setFullScreen(!win.isFullScreen());
        settings.set('fullScreen', win.isFullScreen());
    });
    shortcuts.register(win, 'F12', () => win.webContents.openDevTools());


    win.loadURL('https://kirka.io/');

    win.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        win.loadURL(url);
    });

    win.on('page-title-updated', (e) => {
        e.preventDefault();
    });

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall();
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', app.quit);
