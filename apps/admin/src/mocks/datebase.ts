import type { IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import { shallowRef } from 'vue'

export const dbRef = shallowRef<IDBPDatabase<unknown>>()

export async function initDatebase() {
  const db = await openDB('ice-admin', undefined, {
    upgrade() {
      console.log('database upgrade')
    },
    blocked() {
      console.log('database blocked')
    },
    blocking(currentVersion, blockedVersion, event) {
      console.log('database blocking', currentVersion, blockedVersion, event)
    },
    terminated() {
      console.log('database terminated')
    },
  })
  dbRef.value = db
  return db
}
