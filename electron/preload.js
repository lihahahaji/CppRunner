const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	// runCPP: () => ipcRenderer.invoke("dialog:openFile"),
	initSolve() {
		return ipcRenderer.invoke("initSolve");
	},
	initInclude() {
		return ipcRenderer.invoke("initInclude");
	},
	initMain() {
		return ipcRenderer.invoke("initMain");
	},
	runCPP(codeText,inputText) {
		return ipcRenderer.invoke("runCPP",codeText,inputText);
	},
	saveCode(solveCode,includeText)
	{
		return ipcRenderer.invoke("saveCode",solveCode,includeText);
	}
});
