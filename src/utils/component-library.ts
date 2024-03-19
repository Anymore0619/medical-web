import { isArray, keyBy, set } from 'lodash-es'
import type {
  ProDescriptionsItemProps,
  ProFormItemProps,
  ProTableColumnProps,
  SearchTableTableColumnProps
} from 'component-library'

/* 被设置的值 */
type SetValue = {
  key: string
  path: string
  value: any
}
/* 获取数组中的对应项的索引 */
export const getIndex = <T extends Object>(
  array: T[],
  key: string,
  value: string
): number | undefined => {
  return array.findIndex((item) => item[key] === value)
}
/* 获取数组中的对应项 */
export const getItem = <T extends Object>(
  array: T[],
  key: string,
  value: string
): T | undefined => {
  return keyBy(array, key)[value]
}
/* 设置数组中的对应项 */
export const setItem = <T extends Object>(
  array: T[],
  key: string,
  setValues: SetValue | SetValue[]
) => {
  const map = keyBy(array, key)
  const setValueArray = isArray(setValues) ? setValues : [setValues]
  setValueArray.forEach((setValue) => {
    const { key, path, value } = setValue
    set(map[key], path, value)
  })
}
/* 获取描述列表中的单个描述列表项索引（适用于 descriptions.items） */
export const getDescriptionsItemIndex = (
  items: ProDescriptionsItemProps[],
  key: string
): number | undefined => {
  return getIndex(items, 'title', key)
}
/* 获取表单中的单个表单项索引（适用于 dialogForm.formProps.items、form.items、searchTable.formProps.items、searchTableDialog.searchTableProps.formProps.items） */
export const getFormItemIndex = (items: ProFormItemProps[], key: string): number | undefined => {
  return getIndex(items, 'prop', key)
}
/* 获取表格中的单个表格列索引（适用于 searchTable.tableProps.columns、searchTableDialog.searchTableProps.tableProps.columns、table.columns） */
export const getTableColumnIndex = (
  columns: (ProTableColumnProps | SearchTableTableColumnProps)[],
  key: string
): number | undefined => {
  return getIndex(columns, 'prop', key)
}
/* 获取描述列表中的单个描述列表项（适用于 descriptions.items） */
export const getDescriptionsItem = (
  items: ProDescriptionsItemProps[],
  key: string
): ProDescriptionsItemProps | undefined => {
  return getItem(items, 'title', key)
}
/* 获取表单中的单个表单项（适用于 dialogForm.formProps.items、form.items、searchTable.formProps.items、searchTableDialog.searchTableProps.formProps.items） */
export const getFormItem = (
  items: ProFormItemProps[],
  key: string
): ProFormItemProps | undefined => {
  return getItem(items, 'prop', key)
}

/* 获取表格中的单个表格列（适用于 searchTable.tableProps.columns、searchTableDialog.searchTableProps.tableProps.columns、table.columns） */
export const getTableColumn = <T extends Object = ProTableColumnProps>(
  columns: T[],
  key: string
): T | undefined => {
  return getItem(columns, 'prop', key)
}
/* 设置描述列表中的单个或多个描述列表项（适用于 descriptions.items） */
export const setDescriptionsItem = (
  items: ProDescriptionsItemProps[],
  setValues: SetValue | SetValue[]
) => {
  setItem(items, 'title', setValues)
}
/* 设置表单中的单个或多个表单项（适用于 dialogForm.formProps.items、form.items、searchTable.formProps.items、searchTableDialog.searchTableProps.formProps.items） */
export const setFormItem = (items: ProFormItemProps[], setValues: SetValue | SetValue[]) => {
  setItem(items, 'prop', setValues)
}
/* 设置表单中的单个或多个表单项（适用于 searchTable.tableProps.columns、searchTableDialog.searchTableProps.tableProps.columns、table.columns） */
export const setTableColumn = (
  columns: (ProTableColumnProps | SearchTableTableColumnProps)[],
  setValues: SetValue | SetValue[]
) => {
  setItem(columns, 'prop', setValues)
}
