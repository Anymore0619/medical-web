import request from '@/axios'

/* 登录 */
export const loginApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/login', data })
}
/* 登出 */
export const loginOutApi = (): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/logOut' })
}
