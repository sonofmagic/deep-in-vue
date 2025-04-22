import type { User } from '@/types'
import type { EntityTable } from 'dexie'
// db.js
import Dexie from 'dexie'
import { omit } from 'es-toolkit'
import users from './dataSource/users'

const db = new Dexie('ice') as Dexie & {
  users: EntityTable<
    User,
    'id'
  >
}
// name: string
//   email: string
//   username: string // 用户名
//   password: string // 密码 hash
//   createdAt: string // 账户创建时间
//   updatedAt: string // 账户更新时间
//   avatarUrl?: string // 头像图片 URL，可能为空
//   phone?: string // 用户的电话，可能为空
//   address?: string // 用户地址，可能为空
//   isActive: boolean // 用户是否激活
//   role?: 'admin' | 'user' | 'guest' | null // 用户角色，可能为空

function init() {
  db.version(1).stores({
    users: '++id, name, email, username, password, createdAt, updatedAt, avatarUrl, phone, address, isActive, role',
  })

  db.on('populate', (tx) => {
    tx.table('users').bulkAdd(users.map((x) => {
      return {
        ...omit(x, ['id']),
        createdAt: new Date(x.createdAt).getTime(),
        updatedAt: new Date(x.updatedAt).getTime(),
      }
    }))
  })

  db.open().catch(console.error)
}

export {
  db,
  init,
}
