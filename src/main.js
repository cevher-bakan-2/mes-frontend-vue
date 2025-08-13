import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(VCalendar, { masks: { title: 'MMM YYYY', input: 'DD.MM.YYYY' } })
app.use(router)

app.mount('#app')