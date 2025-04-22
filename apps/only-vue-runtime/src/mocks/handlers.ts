import type { PaginationResponse, User } from '@/types'
import { sleepRandom } from '@/utils'
import { http, HttpResponse } from 'msw'
import { db } from './database'

async function getPagedItems(page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize

  const total = await db.users.count() // 获取总记录数

  const data = await db.users
    .orderBy('id')
    .reverse()
    .offset(offset)
    .limit(pageSize)
    .toArray()

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export const handlers = [
  http.get('/api/user', async ({ request }) => {
    const url = new URL(request.url)
    // 从 1 开始分页有几个原因
    // 1: el 分页器就是从 1 开始的，2 是符合人类直觉，但是不符合我这种专业程序员从0开始的习惯
    const page = Number.parseInt(url.searchParams.get('page') ?? '1')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

    await sleepRandom()

    const result: PaginationResponse<User> = await getPagedItems(page, pageSize)

    return HttpResponse.json(result)
  }),
  http.post('/api/user', async ({ request }) => {
    const body = await request.json() as User

    await sleepRandom()
    if (body.id !== undefined) {
      body.updatedAt = Date.now()
      await db.users.update(body.id, body)
    }
    else {
      body.createdAt = Date.now()
      body.updatedAt = Date.now()
      await db.users.add(body)
    }

    return HttpResponse.text('ok')
  }),
]
