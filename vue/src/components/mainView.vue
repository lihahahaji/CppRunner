<template>
	haji
	<codemirror v-model="code" :options="cmOptions"></codemirror>
</template>

<script>
// require component
import { codemirror } from "vue-codemirror";
// require styles
import "codemirror/lib/codemirror.css";

export default {
	components: {
		codemirror,
	},
	data() {
		return {
			code: '#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << "Hello World!" << endl;\n    return',
			cmOptions: {
				// codemirror options
				tabSize: 4,
				mode: "text/javascript",
				theme: "base16-dark",
				lineNumbers: true,
				line: true,
				// more codemirror options, 更多 codemirror 的高级配置...
			},
		};
	},
};
</script>

<style scoped></style>
