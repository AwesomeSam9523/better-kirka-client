const {app, BrowserWindow, clipboard} = require('electron');
const shortcuts = require('electron-localshortcut');

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('ignore-gpu-blacklist');

app.allowRendererProcessReuse = true;

/*app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('enable-javascript-harmony');
app.commandLine.appendSwitch('no-referrers');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');*/


const createWindow = () => {
    let win = new BrowserWindow({
        width: 1900,
        height: 1000,
        title: `Better Kirka Client`,
        backgroundColor: '#000000',
        webPreferences: {
            preload: __dirname + '/preload/ingame.js',
        },
    });
    win.removeMenu();

    shortcuts.register(win, "Escape", () => win.webContents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(win, "F4", () => win.loadURL('https://kirka.io/'));
    shortcuts.register(win, "F6", () => win.loadURL(clipboard.readText()));
    shortcuts.register(win, 'F11', () => win.setFullScreen(!win.isFullScreen()));
    shortcuts.register(win, 'F12', () => win.webContents.openDevTools());

    win.loadURL('https://kirka.io/');

    win.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        win.loadURL(url);
    });

    win.on('page-title-updated', (e) => {
        e.preventDefault();
        //win.webContents.openDevTools();
    });



}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});


