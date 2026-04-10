import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function enforceAlwaysOnTop(win) {
  // Keep a stronger topmost tier than the default floating level.
  win.setAlwaysOnTop(true, "pop-up-menu");
  win.moveTop();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 360,
    height: 160,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // (1) Use a stronger always-on-top level.
  enforceAlwaysOnTop(win);

  // (2) Re-apply topmost when window state changes.
  const reassertAlwaysOnTop = () => enforceAlwaysOnTop(win);
  win.on("show", reassertAlwaysOnTop);
  win.on("restore", reassertAlwaysOnTop);
  win.on("focus", reassertAlwaysOnTop);

  // (3) Recover immediately if topmost is cleared by another app.
  win.on("always-on-top-changed", (_event, isAlwaysOnTop) => {
    if (!isAlwaysOnTop) {
      enforceAlwaysOnTop(win);
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
