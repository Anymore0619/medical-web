import request from '@/axios'

/* 获取用户分页 */
export const getUserPageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysUser/page', params })
}
/* 新增用户 */
export const addUserApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/save', data })
}
/* 编辑用户 */
export const editUserApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/update', data })
}
/* 删除用户 */
export const deleteUserApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/del', data })
}
/* 获取用户角色列表 */
export const getUserRoleListApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysRoleLink/list', params })
}
/* 编辑用户角色列表 */
export const editUserRoleListApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysRoleLink/save', data })
}
/* 获取用户菜单列表 */
export const getUserMenuListApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/toMainChildByOrigin', data })
}
/* 修改用户密码 */
export const changeUserPasswordApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/changePassword', data })
}
/* 重置用户密码 */
export const resetUserPasswordApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysUser/resetPassword', data })
}
