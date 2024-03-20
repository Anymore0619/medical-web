import request from '@/axios'

/* 获取机构树 */
export const getOrganizationTreeApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysOrg/getOrg', params })
}
/* 新增机构 */
export const addOrganizationApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysOrg/save', data })
}
/* 编辑机构 */
export const editOrganizationApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysOrg/update', data })
}
/* 删除机构 */
export const deleteOrganizationApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysOrg/del', data })
}
