import type { AxiosResponse } from 'axios'

export const exportByStream = (response: AxiosResponse<any>) => {
  const href = window.URL.createObjectURL(
    new Blob([response.data as unknown as Blob], { type: 'xlsx' })
  )
  console.log(response)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = href
  link.setAttribute('download', `${JSON.parse(response.config.data).fileName || '导出Excel'}.xlsx`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(href)
}
export const exportByUrl = (url: string, fileName?: string) => {
  const href = url
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = href
  link.setAttribute('download', `${fileName || '导出Excel'}.xlsx`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(href)
}
