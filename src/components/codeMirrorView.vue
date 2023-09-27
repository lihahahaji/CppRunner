<template>
	<div id="container" @resize="resizeListener">
		<!-- 右侧抽屉(预处理/主函数) -->
		<el-drawer
			v-model="drawerRightVisible"
			title="Drawer"
			:with-header="false"
			style="background-color: rgb(39, 40, 50)"
			size="50%"
		>
			<div id="rightDrawerContainer">
				<div class="codeMirror_right_1">
					<Codemirror
						v-model:value="includeText"
						:options="cmOptions_1"
						className="code-mirror "
						height="100%"
					/>
				</div>
				<div class="codeMirror_right_2">
					<!-- 主函数 -->
					<Codemirror
						v-model:value="mainText"
						:options="cmOptions_2"
						className="code-mirror "
						height="100%"
					/>
				</div>
			</div>
			<!-- 预处理 -->
		</el-drawer>

		<!-- 底部抽屉(输入) -->
		<el-drawer
			v-model="drawerBottomVisible"
			title="Input"
			:with-header="false"
			direction="btt"
			size="40%"
			@opened="BottomDrawerOpened"
			style="background-color: rgb(39, 40, 50)"
		>
			<div style="height: 100%">
				<Codemirror
					id="InputArea"
					:options="optionsForInputArea"
					class="code-mirror"
					v-model:value="inputText"
					style="width: 100%"
					KeepCursorInEnd="true"
					className="code-mirror "
					height="100%"
				/>
			</div>
		</el-drawer>

		<!-- 头部标签栏(默认不可见) -->
		<div id="Header" v-show="header_visibility">
			<!-- 可拖拽区域 -->
			<div id="dragArea"></div>

			<!-- 按钮区域 -->
			<div id="buttonContainer">
				<!-- 复制代码按钮 -->
				<el-tooltip content="CopyCode" placement="top">
					<el-button type="default" @click="copyCode" class="button_shape">
						<el-icon><DocumentCopy /></el-icon>
					</el-button>
				</el-tooltip>

				<!-- 初始化代码按钮 -->
				<el-tooltip content="ReLoad" placement="top">
					<el-button type="default" @click="reloadCode" class="button_shape">
						<el-icon><Refresh /></el-icon>
					</el-button>
				</el-tooltip>

				<!-- 保存代码按钮 -->
				<el-tooltip content="Save" placement="top">
					<el-button type="default" @click="saveCode" class="button_shape">
						<el-icon><DocumentChecked /></el-icon>
					</el-button>
				</el-tooltip>

				<!-- 运行按钮 -->
				<el-tooltip content="RunCode" placement="top">
					<el-button type="success" @click="RunCode" class="button_shape">
						<el-icon><CaretRight /></el-icon>
					</el-button>
				</el-tooltip>
			</div>
		</div>

		<Codemirror
			v-model:value="solveCode"
			:options="cmOptions"
			placeholder=""
			@change="change"
			KeepCursorInEnd="true"
			:tabSize="4"
			@ready="onCmReady"
			className="code-mirror"
			:height="codeMirrorHeight"
			ref="SolveCodeMirror"
		/>

		<el-dialog
			v-model="dialogVisible"
			title="Output"
			width="70%"
			modal="false"
			lock-scroll="false"
			:show-close="showcase"
			@close="closeRunDialog"
			destroy-on-close
			style="background-color: rgb(73, 74, 88)"
		>
			<div
				style="height: auto; width: 100%; background-color: black"
				v-loading="runnerLoading"
			>
				<Codemirror
					v-model:value="runner_result"
					:options="optionsForOutPutArea"
					className="code-mirror "
					height="150px"
				/>
			</div>

			<!-- <template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">Cancel</el-button>
					<el-button type="primary" @click="dialogVisible = false">
						Confirm
					</el-button>
				</span>
			</template> -->
		</el-dialog>
	</div>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";

// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/shell/shell.js";
// import "codemirror/mode/cpp/cpp.js"

// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/monokai.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/idea.css";

//代码提示和自动补全
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/anyword-hint";
// import "codemirror/addon/hint/javascript-hint";
// import "codemirror/addon/hint/xml-hint";
// import "codemirror/addon/hint/sql-hint";
// import "codemirror/addon/hint/anyword-hint";

// 自动补全括号
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";

// 选中单词后，其他相同单词也高亮
import "codemirror/addon/search/match-highlighter";

import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

// element-plus icon
import {
	CaretRight,
	Operation,
	DocumentCopy,
	Refresh,
	DocumentChecked,
} from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";

export default {
	components: {
		DocumentChecked,
		Codemirror,
		CaretRight,
		Operation,
		DocumentCopy,
		Refresh,
	},
	data() {
		return {
			cmOptions: {
				mode: "text/x-c++src", // Language mode
				theme: "panda-syntax", // Theme
				autoCloseBrackets: true, // 自动闭合符号
				matchBrackets: true, // 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
				// lineWrapping: true,
				indentUnit: 4,
				indentWithTabs: true, // 使用 tab 来缩进
				// viewportMargin: 1000,
				highlightSelectionMatches: {
					// 选中高亮
					minChars: 2,
					trim: true,
					style: "matchhighlight",
					showToken: false,
				},
				lineNumbers: true,
				scrollbarStyle: "overlay",
				extraKeys: {
					"Cmd-D": function (cm) {
						// console.log("asd");
					},
				},
			},
			cmOptions_1: {
				mode: "text/x-c++src", // Language mode
				theme: "panda-syntax", // Theme
				autoCloseBrackets: true, // 自动闭合符号
				matchBrackets: true, // 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
				// lineWrapping: true,
				indentUnit: 4,
				indentWithTabs: true, // 使用 tab 来缩进
				// viewportMargin: 1000,
				highlightSelectionMatches: {
					// 选中高亮
					minChars: 2,
					trim: true,
					style: "matchhighlight",
					showToken: false,
				},
				lineNumbers: false,
				scrollbarStyle: "overlay",
			},
			cmOptions_2: {
				mode: "text/x-c++src", // Language mode
				theme: "panda-syntax", // Theme
				autoCloseBrackets: true, // 自动闭合符号
				matchBrackets: true, // 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
				// lineWrapping: true,
				indentUnit: 4,
				indentWithTabs: true, // 使用 tab 来缩进
				// viewportMargin: 1000,
				highlightSelectionMatches: {
					// 选中高亮
					minChars: 2,
					trim: true,
					style: "matchhighlight",
					showToken: false,
				},
				lineNumbers: false,
				scrollbarStyle: "overlay",
				readOnly: true,
			},
			optionsForOutPutArea: {
				mode: "shell", // Language mode
				theme: "panda-syntax", // Theme
				lineNumbers: true,
				readOnly: true,
				scrollbarStyle: "overlay",
			},
			optionsForInputArea: {
				mode: "text", // Language mode
				theme: "panda-syntax", // Theme
				lineNumbers: false,
				placeholder: "Input",
				scrollbarStyle: "overlay",
			},
			optionsForRightArea: {
				mode: "text/x-c++src", // Language mode
				theme: "panda-syntax", // Theme
				lineNumbers: false,
				// placeholder: "Input",
				scrollbarStyle: "overlay",
				height: "100px",
			},
			codeMirrorHeight: window.innerHeight + "px",
			rightDrawerCodeHeight: window.innerHeight * 0.4 + "px",
			runnerLoading: false,
			dialogVisible: false,
			runner_result: "",
			showcase: false,
			header_visibility: false,
			drawerBottomVisible: false,
			drawerRightVisible: false,
			inputText: "",
			code: "void solve()\n{\n\t\n}",
			solveCode: "void solve()\n{\n\t\n}",
			initCode: "void solve()\n{\n\t\n}",
			mainText:
				'int main()\n{\n\tfreopen("./cpp/input.txt","r",stdin);\n\tsolve();\n\treturn 0;\n}',
			includeText: "#include <iostream>\nusing namespace std;\n",
		};
	},
	methods: {
		// 创建一个函数，将文本复制到剪贴板
		copyToClipboard() {
			// 创建一个临时的文本区域元素
			const textArea = document.createElement("textarea");
			textArea.value =
				this.includeText + "\n" + this.solveCode + "\n" + this.mainText;

			// 将文本区域元素添加到文档中
			document.body.appendChild(textArea);

			// 选择文本
			textArea.select();

			try {
				// 尝试复制文本到剪贴板
				document.execCommand("copy");
				// console.log("已成功复制到剪贴板:", text);
			} catch (err) {
				// console.error("复制到剪贴板失败:", err);
			}

			// 清理临时文本区域元素
			document.body.removeChild(textArea);
		},

		// 重置代码
		reloadCode() {
			// this.$refs.SolveCodeMirror.setCursor(2, 0);
			console.log(this.$refs.SolveCodeMirror);

			ElMessage.closeAll();
			ElMessage({
				message: "Reload Code",
				type: "success",
			});

			this.solveCode = this.initCode;
		},
		// 复制代码
		copyCode() {
			console.log("copy Code");
			this.copyToClipboard();
			ElMessage.closeAll();
			ElMessage({
				message: "Copyed",
				type: "success",
			});
		},
		change() {},
		// 运行代码
		async RunCode() {
			// 运行代码
			this.dialogVisible = true;
			// this.code = "loading...";
			this.runnerLoading = true;

			this.runner_result = "";

			this.code = this.includeText + this.solveCode + this.mainText;
			const output = await window.electronAPI.runCPP(this.code, this.inputText);

			this.runnerLoading = false;
			this.runner_result = output;
		},
		// 显示底部抽屉
		showBottomDrawer() {
			// 显示抽屉
			// console.log("显示抽屉");
			if (this.drawerRightVisible) this.drawerRightVisible = false;
			this.drawerBottomVisible = !this.drawerBottomVisible;
		},
		// 底部抽屉打开
		BottomDrawerOpened() {
			document.getElementById("InputArea").focus();
		},
		// 显示右侧抽屉
		showRightDrawer() {
			// 显示抽屉
			// console.log("显示抽屉");
			if (this.drawerBottomVisible) this.drawerBottomVisible = false;
			this.drawerRightVisible = !this.drawerRightVisible;
			console.log(this.includeText);
		},

		onCmReady(cm) {
			// // 这里的 cm 对象就是 codemirror 对象，等于 this.$refs.myCm.codemirror
			// cm.on("inputRead", (cm, obj) => {
			// 	if (obj.text && obj.text.length > 0) {
			// 		let c = obj.text[0].charAt(obj.text[0].length - 1);
			// 		if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
			// 			cm.showHint({ completeSingle: false });
			// 		}
			// 	}
			// });
		},
		// 监听窗口尺寸更改
		resizeListener() {
			// console.log("resized")
			if (this.header_visibility)
				this.codeMirrorHeight = window.innerHeight - 30 + "px";
			else this.codeMirrorHeight = window.innerHeight + "px";

			// this.rightDrawerCodeHeight = window.innerHeight * 0.4 + "px";
		},
		// 关闭运行结果的对话框
		closeRunDialog() {
			this.runner_result = "";
		},
		async initData() {
			this.solveCode = await window.electronAPI.initSolve();
			this.mainText = await window.electronAPI.initMain();
			this.includeText = await window.electronAPI.initInclude();
		},
		async saveCode() {
			console.log(this.includeText);
			console.log(this.solveCode);

			const message = await window.electronAPI.saveCode(
				this.solveCode,
				this.includeText
			);

			// 保存代码
			ElMessage({
				message: "Saved",
				// messag:this.includeText,
				type: "success",
			});
		},
	},
	mounted() {
		window.addEventListener("resize", this.resizeListener);
		// 设置监听键盘快捷键
		window.addEventListener("keydown", (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "r") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.RunCode();
			} else if ((event.metaKey || event.ctrlKey) && event.key === "t") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.header_visibility = !this.header_visibility;
				this.resizeListener();
			} else if ((event.metaKey || event.ctrlKey) && event.key === "d") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.showBottomDrawer();
			} else if ((event.metaKey || event.ctrlKey) && event.key === "m") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.showRightDrawer();
			}
			// 复制代码 cmd + c;
			else if (event.metaKey && event.key === "o") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.copyCode();
			}
			// 保存代码到本地
			else if ((event.metaKey || event.ctrlKey) && event.key === "s") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.saveCode();
			}
			// 初始化代码 cmd + i;
			else if (event.metaKey && event.key === "i") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.reloadCode();
			}

			// 复制代码 shift + cmd + r;
			// else if (event.metaKey && event.shiftKey && event.key === "r") {
			// 	// 阻止默认的刷新行为
			// 	event.preventDefault();

			// 	// 在这里执行你想要的函数
			// 	this.reloadCode();
			// }
		});

		this.initData();
	},
};
</script>

<style scoped>
.code-mirror {
	/* 设置代码字体 */
	font-size: 13px;
	line-height: 150%;
	/* -webkit-app-region: drag; */
	/* flex: 1; */
	/* width: 100%; */
	height: 100%;
}

#Header {
	/* -webkit-app-region: drag; */
	height: 30px;
	width: 100%;
	background-color: rgb(39, 40, 50);
	display: flex;
	justify-content: end;
}

#dragArea {
	-webkit-app-region: drag;
	height: 100%;
	/* background-color: aliceblue; */
	flex: 1;
	/* width:100px; */
}

#container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.button_shape {
	height: 20px;
	width: 20px;
}

#buttonContainer {
	display: flex;
	justify-content: end;
	align-items: center;
	height: 100%;
	padding-right: 10px;
}
#rightDrawerContainer {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	background-color: rgb(39, 40, 50);
}

.codeMirror_right_1 {
	height: 70%;
}

.codeMirror_right_2 {
	height: 20%;
}
</style>
