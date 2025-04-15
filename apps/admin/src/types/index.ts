export interface PaginationResponse<T> {
  data: T[] // 当前页的数据列表
  total: number // 总数据量
  page: number // 当前页码
  pageSize: number // 每页的数据量
  totalPages: number // 总页数
}

export interface User {
  id: number
  name: string
  email: string
}
