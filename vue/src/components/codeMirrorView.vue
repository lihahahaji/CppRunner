<template>
	<div id="container" @resize="resizeListener">
		<div id="Header" v-show="header_visibility">
			<div id="dragArea"></div>
			<el-button type="success" @click="RunCode">
				<el-icon><CaretRight /></el-icon>
			</el-button>
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
			title="Run"
			width="70%"
			
			modal="false"
			lock-scroll="false"
			:show-close="showcase"
		>
			<div style="height: 400px; width: 100% ; background-color: black;" v-loading="runnerLoading">
				<span>{{ runner_result }}</span>
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
import { CaretRight } from "@element-plus/icons-vue";

import Codemirror from "codemirror-editor-vue3";

// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";
// import "codemirror/mode/cpp/cpp.js"

// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/monokai.css";
import "codemirror/theme/panda-syntax.css";

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

export default {
	components: { Codemirror, CaretRight },
	data() {
		return {
			code: '#include <iostream>\nusing namespace std;\nint main(){\n\tcout<<"helloworld"<<endl;\n}\n',
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
			codeMirrorHeight: window.innerHeight - 30 + "px",
			runnerLoading: false,
			dialogVisible: false,
			runner_result: "",
			showcase: false,
			header_visibility:true,
		};
	},
	methods: {
		change() {},
		async RunCode() {
			// console.log(this.code);
			this.dialogVisible = true;
			// this.code = "loading...";
			this.runnerLoading = true;

			const output = await window.electronAPI.runCPP();

			this.runnerLoading = false;
			this.runner_result = output;
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
		resizeListener() {
			// console.log("resized")
			if(this.header_visibility) this.codeMirrorHeight = window.innerHeight - 30 + "px";
			else this.codeMirrorHeight = window.innerHeight+ "px";
		},
	},
	mounted() {
		window.addEventListener("resize", this.resizeListener);
		// 设置监听键盘快捷键 cmd + R
		window.addEventListener("keydown", (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "r") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.RunCode();
			}
		});
		window.addEventListener("keydown", (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "h") {
				// 阻止默认的刷新行为
				event.preventDefault();

				// 在这里执行你想要的函数
				this.header_visibility = !this.header_visibility;
				this.resizeListener()
				
				
			}
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
</style>
