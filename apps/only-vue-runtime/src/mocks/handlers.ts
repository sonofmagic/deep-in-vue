import type { PaginationRequest, PaginationResponse, User } from '@/types'
import { sleepRandom } from '@/utils'
import { defu } from 'defu'
import { http, HttpResponse } from 'msw'
import { db } from './database'

type UserPaginationRequest = PaginationRequest<{ nameSearch?: string }>

async function getPagedItems(query: UserPaginationRequest) {
  const { page, pageSize, searchParams, orderBy } = defu<Required<UserPaginationRequest>, UserPaginationRequest[]>(query, {
    page: 1,
    pageSize: 10,
    searchParams: {},
    orderBy: {
      prop: 'id',
      order: 'descending',
    },
  })
  const { nameSearch } = searchParams

  const offset = (page - 1) * pageSize
  const x = db.users.orderBy(orderBy.prop)
  let collection = orderBy.order === 'descending' ? x.reverse() : x

  // 如果传入了 name 搜索，则添加 filter
  if (nameSearch && nameSearch.trim() !== '') {
    collection = collection.filter(user =>
      user.name?.toLowerCase().includes(nameSearch.toLowerCase()),
    )
  }

  // 计算筛选后的总数
  const total = await collection.clone().count()

  // 获取分页数据
  const data = await collection
    .offset(offset)
    .limit(pageSize)
    .toArray()

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export const handlers = [
  http.get('/api/user', async ({ request }) => {
    const url = new URL(request.url)
    // 从 1 开始分页有几个原因
    // 1: el 分页器就是从 1 开始的，2 是符合人类直觉，但是不符合我这种专业程序员从0开始的习惯
    const page = Number.parseInt(url.searchParams.get('page') ?? '1')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')
    const orderBy = {
      prop: url.searchParams.get('orderBy[prop]') ?? 'id',
      order: url.searchParams.get('orderBy[order]') ?? 'descending',
    }
    await sleepRandom()

    const result: PaginationResponse<User> = await getPagedItems({
      page,
      pageSize,
      searchParams: {
        nameSearch: url.searchParams.get('searchParams[name]') ?? '',
      },
      orderBy,
    })

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
  http.delete('/api/user', async ({ request }) => {
    const url = new URL(request.url)
    const id = Number.parseInt(url.searchParams.get('id') ?? '-1')
    if (id > -1) {
      await db.users.delete(id)
    }

    return HttpResponse.text('ok')
  }),
]
