import request from '@/axios'

/* 获取角色分页 */
export const getRolePageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysRole/page', params })
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
/* 获取角色权限 */
export const getRoleAuthorityApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysMenuLink/list', params })
}
/* 编辑角色权限 */
export const editRoleAuthorityApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysMenuLink/save', data })
}
