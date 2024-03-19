import { getDictionaryListApi } from '@/api/dictionary'
import { isString } from '@/utils/is'

export type UseDictReturnType = {
  getDictLabel?: (dict: Record<string, any>, value: any) => any
  [x: string]: any
}

const staticDict: Record<string, any>[] = []

export const useDict = async (typeCode?: string | string[]): Promise<UseDictReturnType> => {
  /* 类型编码列表 */
  const typeCodeList = typeCode ? (isString(typeCode) ? [typeCode] : typeCode) : []
  /* 字典对象 */
  let dict: Record<string, any> = {}
  /* 初始化字典 */
  const initDict = async () => {
    const dictMap: Map<string, any> = new Map()
    try {
      const params = {
        typeCode: typeCodeList.join(',')
      }
      const res = await getDictionaryListApi(params)
      if (res) {
        for (const key in res.data) {
          const list = JSON.parse(res.data[key]) || []
          list.map((item) => {
            dictMap.set(key, [
              ...(dictMap.get(key) || ''),
              {
                label: item.itemName,
                value: item.itemCode
              }
            ])
            /* 如果有此类型的动态字典，则在 typeCodeList 中删除此类型 */
            const typeIndex = typeCodeList.indexOf(key)
            if (typeIndex !== -1) {
              typeCodeList.splice(typeIndex, 1)
            }
          })
        }
      }
    } finally {
      /* 过滤 typeCodeList 中的剩余类型，静态字典本身就是排好序的，故无需排序 */
      staticDict
        .filter((item) => typeCodeList.indexOf(item.typeCode) !== -1)
        .map((item) => {
          /* 使用静态字典 */
          dictMap.set(item.typeCode, [
            ...(dictMap.get(item.typeCode) || ''),
            {
              label: item.itemName,
              value: item.itemCode
            }
          ])
        })
      dict = Object.fromEntries(dictMap)
    }
  }
  /* 获取字典文本 */
  const getDictLabel = (dict: Record<string, any>, value: any) => {
    /* 弱类型判断 */
    return dict.find((d) => d.value == value)?.label
  }
  /* 获取字典标签类型 */
  const getDictTagType = (dict: Record<string, any>, value: any) => {
    /* 弱类型判断 */
    return dict.find((d) => d.value == value)?.tagType
  }
  /* 初始化 */
  await initDict()

  return {
    ...dict,
    getDictLabel,
    getDictTagType
  }
}
