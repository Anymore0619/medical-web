import request from '@/axios'

/* 获取菜单树 */
export const getMenuTreeApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysMenu/getMenuByOrigin', params })
}
/* 新增菜单 */
export const addMenuApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysMenu/save', data })
}
/* 编辑菜单 */
export const editMenuApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysMenu/update', data })
}
/* 删除菜单 */
export const deleteMenuApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysMenu/del', data })
}
