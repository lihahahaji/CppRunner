const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	// runCPP: () => ipcRenderer.invoke("dialog:openFile"),
	runCPP() {
		return ipcRenderer.invoke("runCPP");
	},
});
