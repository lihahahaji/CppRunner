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
	//   win.loadFile('index.html')
	// 加载网址
	win.loadURL("http://localhost:5173/");

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
			],
		})
	);
	// Menu.setApplicationMenu(menu);
};

async function runCPP(event,codeText) {
    console.log(codeText)
	const { stdout, stderr } = await exec("g++ code.cpp && ./a.out");
	return stdout;
}

// 在应用准备就绪时调用函数 创建窗口
app.whenReady().then(() => {

	ipcMain.handle("runCPP", async (event,codeText,inputText) =>{
        console.log(codeText,inputText)
        const cmd = "echo '"+ inputText +"' > ./cpp/input.txt  && echo '"+codeText+"' > ./cpp/code.cpp && g++ ./cpp/code.cpp -o ./cpp/out && ./cpp/out"
        console.log(cmd)
        try{
            const { stdout, stderr } = await exec(cmd);
            return stdout
        }catch(e)
        {
            return e.stderr
        }
        
        
    });

	createWindow();
});
