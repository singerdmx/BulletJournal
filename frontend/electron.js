const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../src/assets/favicon.icns"),
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:80"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", function () {
  createWindow();
});

app.on("browser-window-created", function (event, mainWindow) {
  const ctxMenu = new Menu();
  ctxMenu.append(
    new MenuItem({
      role: "selectall",
    })
  );
  ctxMenu.append(
    new MenuItem({
      role: "close",
    })
  );
  mainWindow.webContents.on("context-menu", function (e, params) {
    ctxMenu.popup(mainWindow, params.x, params.y);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
