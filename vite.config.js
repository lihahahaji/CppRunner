import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// 1
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
	// 2
	base: path.resolve(__dirname, "./dist/"),
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
