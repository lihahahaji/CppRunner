<template>
	<div id="container" @resize="resizeListener">
		<!-- 右侧抽屉(预处理/主函数) -->
		<el-drawer v-model="drawerRightVisible" title="Drawer" :with-header="false">
			<!-- 预处理 -->
			<Codemirror height="300px" />
			<!-- 主函数 -->
			<Codemirror height="300px" />
		</el-drawer>

		<!-- 底部抽屉(输入) -->
		<el-drawer
			v-model="drawerBottomVisible"
			title="Input"
			:with-header="false"
			direction="btt"
			size="40%"
			@opened="BottomDrawerOpened"
			style="background-color: black"
		>
			<div style="height: 100%">
				<Codemirror
					id="InputArea"
					:options="optionsForInputArea"
					class="code-mirror"
					height="100%"
					v-model:value="inputText"
					style="width: 100%"
				/>
			</div>
		</el-drawer>
		<!-- 头部标签栏(默认不可见) -->
		<div id="Header" v-show="header_visibility">
			<!-- 可拖拽区域 -->
			<div id="dragArea"></div>

			<!-- 按钮区域 -->
			<div id="buttonContainer">
				<!-- 运行按钮 -->
				<el-tooltip content="RunCode" placement="top">
					<el-button type="success" @click="RunCode" class="button_shape">
						<el-icon><CaretRight /></el-icon>
					</el-button>
				</el-tooltip>

				<!-- 复制代码按钮 -->
				<el-tooltip content="CopyCode" placement="top">
					<el-button type="primary" @click="copyCode" class="button_shape">
						<el-icon><DocumentCopy /></el-icon>
					</el-button>
				</el-tooltip>

				<!-- 初始化代码按钮 -->
				<el-tooltip content="ReLoad" placement="top">
					<el-button type="primary" @click="reloadCode" class="button_shape">
						<el-icon><Refresh /></el-icon>
					</el-button>
				</el-tooltip>
			</div>
		</div>

		<Codemirror
			v-model:value="code"
			:options="cmOptions"
			placeholder=""
			@change="change"
			KeepCursorInEnd="true"
			:tabSize="4"
			@ready="onCmReady"
			className="code-mirror "
			:height="codeMirrorHeight"
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
		>
			<div
				style="height: auto; width: 100%; background-color: black"
				v-loading="runnerLoading"
			>
				<Codemirror
					v-model:value="runner_result"
					:options="optionsForOutPutArea"
					class="code-mirror"
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
import { CaretRight, Operation, DocumentCopy,Refresh } from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";

export default {
	components: { Codemirror, CaretRight, Operation, DocumentCopy,Refresh },
	data() {
		return {
			code: '#include <iostream>\nusing namespace std;\nint main(){\n\tcout<<"helloworld"<<endl;\n}\n',
			initCode: '#include <iostream>\nusing namespace std;\nint main(){\n\tcout<<"helloworld"<<endl;\n}\n',
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
			codeMirrorHeight: window.innerHeight + "px",
			runnerLoading: false,
			dialogVisible: false,
			runner_result: "",
			showcase: false,
			header_visibility: false,
			drawerBottomVisible: false,
			drawerRightVisible: false,
			inputText: "",
		};
	},
	methods: {
		// 重置代码
		reloadCode()
		{
			ElMessage.closeAll();
			ElMessage({
				message: "Reload Code",
				type: "success",
			});

			this.code = this.initCode;
		},	
		// 复制代码
		copyCode() {
			console.log("copy Code");
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

			const output = await window.electronAPI.runCPP(this.code);

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
		},
		// 关闭运行结果的对话框
		closeRunDialog() {
			this.runner_result = "";
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
			}
			else if ((event.metaKey || event.ctrlKey) && event.key === "t") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.header_visibility = !this.header_visibility;
				this.resizeListener();
			}
			else if ((event.metaKey || event.ctrlKey) && event.key === "i") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.showBottomDrawer();
			}
			else if ((event.metaKey || event.ctrlKey) && event.key === "d") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.showRightDrawer();
			}
			// 复制代码 shift + cmd + c;
			else if (event.metaKey && event.shiftKey && event.key === "c") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.copyCode();
			}
			// 复制代码 shift + cmd + r;
			// else if (event.metaKey && event.shiftKey && event.key === "r") {
			// 	// 阻止默认的刷新行为
			// 	event.preventDefault();

			// 	// 在这里执行你想要的函数
			// 	this.reloadCode();
			// }
		});
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
	/* height:100%; */
}

#Header {
	/* -webkit-app-region: drag; */
	height: 30px;
	width: 100%;
	background-color: black;
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

.CodeMirror {
	height: auto;
}

.CodeMirror-scroll {
	height: 100%;
	overflow-y: hidden;
	overflow-x: auto;
	background-color: rgb(31, 31, 32);
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
</style>
