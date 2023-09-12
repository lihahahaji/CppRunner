import { createApp } from 'vue'
import App from './App.vue'

// 导入 VueCodemirror
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'


const app = createApp(App);
app.use(VueCodemirror);

app.mount('#app')