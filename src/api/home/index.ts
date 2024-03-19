import request from '@/axios'

/* 获取所有设备数量 */
export const getAllDeviceNumberApi = (): Promise<IResponse> => {
  return request.get({ url: '/lamp/mainReport/getAllDeviceCount' })
}
/* 获取路灯类型数量统计分页 */
export const getRoadLampTypeNumberStatisticsApi = (): Promise<IResponse> => {
  return request.get({ url: '/lamp/mainReport/getGroupRoadLampTypeCountList' })
}
/* 获取光源类型数量统计分页 */
export const getLampTypeNumberStatisticsApi = (): Promise<IResponse> => {
  return request.get({ url: '/lamp/mainReport/getGrouplampTypeCountList' })
}
