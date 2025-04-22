import { createApp } from 'vue'
import App from './app'
import { enableMocking } from './mocks'
import router from './router'
import 'element-plus/dist/index.css'
import './style.css'

const app = createApp(App)
app.use(router)

enableMocking().then(() => {
  app.mount('#app')
})
