import request from '@/axios'

/* 获取字典列表 */
export const getDictionaryListApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysDict/getDict', params })
}

/* 获取字典类型分页 */
export const getDictionaryTypePageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysDictType/page', params })
}
/* 新增字典类型 */
export const addDictionaryTypeApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDictType/save', data })
}
/* 编辑字典类型 */
export const editDictionaryTypeApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDictType/update', data })
}
/* 删除字典类型 */
export const deleteDictionaryTypeApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDictType/del', data })
}
/* 获取字典数据分页 */
export const getDictionaryDataPageApi = (params): Promise<IResponse> => {
  return request.get({ url: '/sys/sysDict/page', params })
}
/* 新增字典数据 */
export const addDictionaryDataApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDict/save', data })
}
/* 编辑字典数据 */
export const editDictionaryDataApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDict/update', data })
}
/* 删除字典数据 */
export const deleteDictionaryDataApi = (data): Promise<IResponse> => {
  return request.post({ url: '/sys/sysDict/del', data })
}
