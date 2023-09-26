const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	// runCPP: () => ipcRenderer.invoke("dialog:openFile"),
	runCPP(codeText) {
		return ipcRenderer.invoke("runCPP",codeText);
	},
});
