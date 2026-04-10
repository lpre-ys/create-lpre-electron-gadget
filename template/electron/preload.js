import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("gadgetInfo", {
  platform: process.platform
});
