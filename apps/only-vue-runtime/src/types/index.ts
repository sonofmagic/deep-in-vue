export interface PaginationResponse<T> {
  data: T[] // 当前页的数据列表
  total: number // 总数据量
  page: number // 当前页码
  pageSize: number // 每页的数据量
  totalPages: number // 总页数
}

export interface PaginationRequest {
  page: number
  pageSize?: number
  searchParams?: Record<string, any>
}

export interface User {
  id: number
  name: string
  email: string
  username: string // 用户名
  password: string // 密码 hash
  createdAt: number // 账户创建时间
  updatedAt: number // 账户更新时间
  avatarUrl?: string // 头像图片 URL，可能为空
  phone?: string // 用户的电话，可能为空
  address?: string // 用户地址，可能为空
  isActive: boolean // 用户是否激活
  role?: 'admin' | 'user' | 'guest' | null // 用户角色，可能为空
}

export enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
  None = 'none',
}

export function roleTextFilter(role: string): string {
  switch (role) {
    case Role.Admin:
      return '管理员'
    case Role.User:
      return '普通用户'
    case Role.Guest:
      return '游客'
    default:
      return '未知'
  }
}
