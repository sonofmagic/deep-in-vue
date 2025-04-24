import { init } from './database'

export async function enableMocking() {
  // if (import.meta.env.PROD) {
  //   return
  // }
  await init()
  const { worker } = await import('./browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}
