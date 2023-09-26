const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	// runCPP: () => ipcRenderer.invoke("dialog:openFile"),
	runCPP(codeText,inputText) {
		return ipcRenderer.invoke("runCPP",codeText,inputText);
	},
});
