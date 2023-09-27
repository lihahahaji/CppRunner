const {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	Menu,
	MenuItem,
	screen,
} = require("electron");

const path = require("path");
const { stdout } = require("process");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
// app，它着您应用程序的事件生命周期。
// BrowserWindow，它负责创建和管理应用窗口。

// createWindow 函数用于创建一个应用窗口
const createWindow = () => {
	const win = new BrowserWindow({
		// 设置宽高
		width: 800,
		height: 600,
		titleBarStyle: "customButtonsOnHover",
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	// 加载静态页面
	win.loadFile("./dist/index.html");
	// 加载网址
	// win.loadURL("http://localhost:5173/");

	win.once("ready-to-show", () => {
		win.show();
	});

	const menu = new Menu();
	menu.append(
		new MenuItem({
			label: "Google Translate",
			submenu: [
				{
					role: "Quit",
					accelerator: process.platform === "darwin" ? "Cmd+Q" : "Alt+Shift+Q",
					click: () => {
						console.log("Electron rocks!");
					},
				},
				{
					role: "Hide",
					accelerator: process.platform === "darwin" ? "Cmd+W" : "Alt+Shift+W",
					click: () => {
						console.log("Electron rocks!");
					},
				},
				{
					role: "Zoom",
					accelerator: process.platform === "darwin" ? "Cmd+F" : "Alt+Shift+F",
					click: () => {
						console.log("Electron rocks!");
					},
				},
				{
					role: "selectAll",
					accelerator: "Cmd+A",
					click: () => {},
				},
				{
					role: "copy",
					accelerator: "Cmd+C",
					click: () => {},
				},
				{
					role: "paste",
					accelerator: "Cmd+V",
					click: () => {},
				},
				{
					role: "undo",
					accelerator: "Cmd+Z",
					click: () => {},
				},
				{
					role: "redo",
					accelerator: "Cmd+Shift+Z",
					click: () => {},
				},
				{
					role: "zoomin",
					accelerator: "Cmd+Plus",
					click: () => {},
				},
				{
					role: "zoomout",
					accelerator: "Cmd+-",
					click: () => {},
				},
				{
					role: "toggleDevTools",
					accelerator: "Cmd+Option+I",
					click: () => {},
				},
			],
		})
	);
	Menu.setApplicationMenu(menu);
};

async function runCPP(event, codeText) {
	console.log(codeText);
	const { stdout, stderr } = await exec("g++ code.cpp && ./a.out");
	return stdout;
}



// 在应用准备就绪时调用函数 创建窗口
app.whenReady().then(() => {
	

	const resourcesPath = app.getAppPath();
	// 获取实际程序中 cpp 目录的文件路径
	const CppPath = resourcesPath.substring(0, resourcesPath.lastIndexOf('/'));
	// process.chdir(distPath);


	// 初始化 solve 内容
	ipcMain.handle("initSolve",async (event) => {
		// console.log(event);
		const cmd = "cat "+CppPath+"/cpp/solve.txt";
		console.log(cmd);
		try {
			const { stdout, stderr } = await exec(cmd);
			return stdout;
		} catch (e) {
			return e.stderr;
		}
	});

	// 初始化 include 内容
	ipcMain.handle("initInclude",async (event) => {
		// console.log(event);
		const cmd = "cat "+CppPath+"/cpp/include.cpp";
		console.log(cmd);
		try {
			const { stdout, stderr } = await exec(cmd);
			return stdout;
		} catch (e) {
			return e.stderr;
		}
	});

	// 保存代码
	ipcMain.handle("saveCode",async (event,solveCode,includeText) => {
		// console.log(event);
		console.log(solveCode)
		console.log(includeText)
		const cmd = "echo '"+includeText+"' > "+CppPath+"/cpp/include.cpp && echo '"+solveCode+"' > "+CppPath+"/cpp/solve.txt";
		console.log(cmd);
		try {
			const { stdout, stderr } = await exec(cmd);
			return stdout;
		} catch (e) {
			return e.stderr;
		}
	});

	// 初始化 main 内容
	ipcMain.handle("initMain",async (event) => {
		// console.log(event);
		const inputFilePath = CppPath + "/cpp/input.txt";
		const res = "int main()\n{\n\tios::sync_with_stdio(0);\n\tcin.tie(0);\n\t#ifndef ONLINE_JUDGE\n\tfreopen(\""+inputFilePath+"\",\"r\",stdin);\n\t#endif\n\tsolve();\n}"
		return res;
	});

	ipcMain.handle("runCPP", async (event, codeText, inputText) => {
		console.log(codeText, inputText);
		const cmd =
			"echo '" +
			inputText +
			"' > "+CppPath+"/cpp/input.txt  && echo '" +
			codeText +
			"' > "+CppPath+"/cpp/code.cpp && g++ "+CppPath+"/cpp/code.cpp -o "+CppPath+"/cpp/out && "+CppPath+"/cpp/out";
		console.log(cmd);
		try {
			const { stdout, stderr } = await exec(cmd);
			// return resourcesPath;
			return stdout;
		} catch (e) {
			return e.stderr;
			// return resourcesPath;
		}
	});

	createWindow();
});
