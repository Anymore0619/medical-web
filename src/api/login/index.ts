import request from '@/axios'

export const loginApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/logOut' })
}
