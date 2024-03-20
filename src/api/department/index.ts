import request from '@/axios'

/* 获取部门分页 */
export const getDepartmentPageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysDept/page', params })
}
/* 获取部门列表 */
export const getDepartmentListApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysDept/list', params })
}
/* 新增部门 */
export const addDepartmentApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDept/save', data })
}
/* 编辑部门 */
export const editDepartmentApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDept/update', data })
}
/* 删除部门 */
export const deleteDepartmentApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDept/del', data })
}
