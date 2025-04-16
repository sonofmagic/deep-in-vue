import { initDatebase } from './datebase'

export async function enableMocking() {
  if (import.meta.env.PROD) {
    return
  }

  const { worker } = await import('./browser')
  await initDatebase()
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}
