const { app, BrowserWindow } = require("electron");
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
	});
	// 加载静态页面
	//   win.loadFile('index.html')
	// 加载网址
	win.loadURL("http://localhost:5173/");
    
    win.once("ready-to-show", () => {
        win.show();
    });
};



// 在应用准备就绪时调用函数 创建窗口
app.whenReady().then(() => {
	createWindow();
});
