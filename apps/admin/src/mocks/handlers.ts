import type { PaginationResponse, User } from '@/types'
import { sleepRandom } from '@/utils'
import { http, HttpResponse } from 'msw'
import mockedUsers from './dataSource/users'

export const handlers = [
  http.get('/api/table', async ({ request }) => {
    const url = new URL(request.url)
    // 从 1 开始分页有几个原因
    // 1: el 分页器就是从 1 开始的，2 是符合人类直觉，但是不符合我这种专业程序员从0开始的习惯
    const page = Number.parseInt(url.searchParams.get('page') ?? '1')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')
    const data = mockedUsers.slice((page - 1) * pageSize, (page) * pageSize)

    await sleepRandom()

    const result: PaginationResponse<User> = {
      data,
      total: mockedUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockedUsers.length / pageSize),
    }

    return HttpResponse.json(result)
  }),
]
