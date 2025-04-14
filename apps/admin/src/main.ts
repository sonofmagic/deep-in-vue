import { createApp } from 'vue'
import App from './app'
import router from './router'
import 'element-plus/dist/index.css'
import './style.css'

const app = createApp(App)
app.use(router)

async function enableMocking() {
  if (import.meta.env.PROD) {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}
enableMocking().then(() => {
  app.mount('#app')
})
