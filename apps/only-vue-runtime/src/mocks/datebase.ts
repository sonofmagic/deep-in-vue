import type { IDBPDatabase } from 'idb'
import { omit } from 'es-toolkit'
import { openDB } from 'idb'
import { shallowRef } from 'vue'
import users from './dataSource/users'

export const dbRef = shallowRef<IDBPDatabase<unknown>>()

export async function initDatebase() {
  const db = await openDB('ice-admin', 1, {
    upgrade(db, oldVersion, _newVersion) {
      // 版本 1 -> 2：初始化一些数据
      if (oldVersion < 2) {
        const userStore = db.createObjectStore('users', {
          keyPath: 'id', // 主键字段
          autoIncrement: true,
        })

        userStore.createIndex('by-email', 'email')
        userStore.createIndex('by-name', 'name')
        userStore.createIndex('by-phone', 'phone')
        userStore.createIndex('by-status', 'status')
        userStore.createIndex('by-role', 'role')
        userStore.createIndex('by-createdAt', 'createdAt')
        userStore.createIndex('by-updatedAt', 'updatedAt')
        userStore.createIndex('by-isActive', 'isActive')
        userStore.createIndex('by-address', 'address')
        userStore.createIndex('by-username', 'username')

        users.map((x) => {
          return {
            ...omit(x, ['id']),
            createdAt: new Date(x.createdAt).getTime(),
            updatedAt: new Date(x.updatedAt).getTime(),
          }
        }).forEach((user) => {
          userStore.add(user)
        })
      }
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
