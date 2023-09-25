<template>
	<Codemirror
		v-model:value="code"
		:options="cmOptions"
		placeholder=""
		:height="800"
		@change="change"
		KeepCursorInEnd="true"
		:tabSize="4"
		@ready="onCmReady"
		className = "code-mirror"
	/>
</template>

<script>
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

export default {
	components: { Codemirror },
	data() {
		return {
			code: "void solve()\n{\n\t\n}",
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
			},
		};
	},
	methods: {
		change() {},

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
	},
};
</script>

<style scoped>
.code-mirror{
	/* 设置代码字体 */
    font-size : 13px;
    line-height : 150%;
}
</style>
