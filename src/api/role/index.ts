import request from '@/axios'

/* 获取角色分页 */
export const getRolePageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysRole/page', params })
}
/* 获取角色列表 */
export const getRoleListApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysRole/list', params })
}
/* 新增角色 */
export const addRoleApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysRole/save', data })
}
/* 编辑角色 */
export const editRoleApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysRole/update', data })
}
/* 删除角色 */
export const deleteRoleApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysRole/del', data })
}
/* 获取角色菜单列表 */
export const getRoleMenuListApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysMenuLink/list', params })
}
/* 编辑角色菜单列表 */
export const editRoleMenuListApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysMenuLink/save', data })
}
