<template>
  <ProCard class="role-management">
    <ProSearchTable ref="searchTableRef" v-bind="searchTable" v-model:loading="searchTable.loading">
      <!-- 表格上方内容 -->
      <template #over-table>
        <ActionButton class="float-right" v-bind="addButton" :loading="searchTable.loading" />
      </template>
    </ProSearchTable>
  </ProCard>
  <ProFormDialog v-bind="roleFormDialog" v-model:show="roleFormDialog.show" />
  <ProFormDialog
    ref="authorityFormDialogRef"
    v-bind="authorityFormDialog"
    v-model:show="authorityFormDialog.show"
  />
</template>

<script setup lang="ts">
import { getMenuTreeApi } from '@/api/menu'
import {
  getRolePageApi,
  addRoleApi,
  editRoleApi,
  deleteRoleApi,
  getRoleAuthorityApi,
  editRoleAuthorityApi
} from '@/api/role'
import { getFormItemIndex, setFormItem } from '@/utils/component-library'
import { cloneDeep } from 'lodash-es'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { ActionButtonProps } from '@/views/components/ActionButton'
import type {
  ProFormDialogInstance,
  ProFormDialogProps,
  ProSearchTableInstance,
  ProSearchTableProps
} from 'component-library'

onMounted(() => {
  /* 初始化查询 */
  searchTableRef.value!.query()
})
/* 获取菜单树 */
const getMenuTree = async () => {
  const res = await getMenuTreeApi({})
  if (res) {
    setFormItem(authorityFormDialog.formProps!.items!, {
      key: 'menuList',
      path: 'itemProps.data',
      value: res.data.menuData
    })
    const index = getFormItemIndex(authorityFormDialog.formProps!.items!, 'menuList')!
    expandAllTreeNode(authorityFormDialogRef.value!, index, res.data.menuData)
  }
}
/* 获取角色权限 */
const getRoleAuthority = async () => {
  const { id } = authorityFormDialog.formProps!.model!
  const params = {
    roleId: id
  }
  const res = await getRoleAuthorityApi(params)
  if (res) {
  }
}
/* 删除角色 */
const deleteMenu = (row: Record<string, any>) => {
  const { id, name } = row!
  ElMessageBox.confirm(`是否确定删除【${name}】角色？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id
      }
      const res = await deleteRoleApi(params)
      if (res) {
        ElMessage.success(res.msg)
        searchTableRef.value!.query()
      }
    })
    .catch(() => {})
}
/* 搜索表格 */
const searchTableRef = ref<ProSearchTableInstance>()
const searchTable = reactive<ProSearchTableProps>({
  formProps: {
    model: {
      name: null
    }
  },
  loading: false,
  requestApi: getRolePageApi,
  tableProps: {
    columns: [
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '角色名称',
        minWidth: 120,
        prop: 'name'
      },
      {
        dict: [],
        label: '备注',
        minWidth: 120,
        prop: 'remark'
      },
      {
        actions: [
          {
            click: (row) => {
              openRoleFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              openAuthorityFormDialog('set', row!)
            },
            label: '权限'
          },
          {
            click: (row) => {
              deleteMenu(row!)
            },
            label: '删除'
          }
        ],
        align: 'center',
        fixed: 'right',
        type: 'action',
        width: 150
      }
    ]
  }
})
/* 新增按钮 */
const addButton = reactive<ActionButtonProps>({
  actionType: 'add',
  click: () => {
    openRoleFormDialog('add')
  }
})
/* 角色表单弹窗 */
const roleFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  dialogProps: {
    title: ''
  },
  formProps: {
    items: [
      {
        itemType: 'input',
        label: '角色名称',
        prop: 'name',
        rules: {
          message: '请输入角色名称',
          required: true
        }
      },
      {
        itemProps: {
          resize: 'none',
          rows: 3,
          type: 'textarea'
        },
        itemType: 'input',
        label: '备注',
        prop: 'remark'
      }
    ],
    model: {
      id: null,
      name: null,
      remark: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开角色表单弹窗 */
const openRoleFormDialog = (businessType: string, row?: Record<string, any>) => {
  roleFormDialog.businessType = businessType
  roleFormDialog.show = true
  nextTick(() => {
    if (businessType === 'add') {
      roleFormDialog.dialogProps!.title = '新增角色'
      roleFormDialog.requestApi = addRoleApi
    } else if (businessType === 'edit') {
      roleFormDialog.dialogProps!.title = '编辑角色'
      roleFormDialog.requestApi = editRoleApi
      const { id, name, remark } = row!
      Object.assign(roleFormDialog.formProps!.model!, {
        id,
        name,
        remark
      })
    }
  })
}
/* 权限表单弹窗 */
const authorityFormDialogRef = ref<ProFormDialogInstance>()
const authorityFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  customRequestParams: (params) => {
    const { id, menuList } = params
    return {
      roleId: id,
      menuIds: menuList.map((menu) => menu.id).join(',')
    }
  },
  dialogProps: {
    beforeClose: () => {
      authorityFormDialog.formProps!.items = cloneDeep(authorityFormDialogFormItemsClone)
    },
    title: ''
  },
  formProps: {
    items: [
      {
        itemProps: {
          checkStrictly: true,
          data: [],
          defaultExpandAll: true,
          hideLoadMoreButton: true,
          hideSearchInput: true,
          height: 450,
          props: {
            label: 'name',
            value: 'id'
          },
          showCheckbox: true
        },
        itemType: 'virtualizedTree',
        prop: 'menuList'
      }
    ],
    model: {
      id: null,
      menuList: []
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开权限表单弹窗 */
const openAuthorityFormDialog = (businessType: string, row?: Record<string, any>) => {
  authorityFormDialog.businessType = businessType
  authorityFormDialog.show = true
  nextTick(async () => {
    if (businessType === 'set') {
      authorityFormDialog.dialogProps!.title = '设置角色权限'
      authorityFormDialog.requestApi = editRoleAuthorityApi
    }
    const { id } = row!
    Object.assign(authorityFormDialog.formProps!.model!, {
      id
    })
    await getMenuTree()
    getRoleAuthority()
  })
}
/* 权限表单弹窗表单项克隆 */
const authorityFormDialogFormItemsClone = cloneDeep(authorityFormDialog.formProps!.items)
/* 展开所有树节点 */
const expandAllTreeNode = (
  ref: ProFormDialogInstance,
  index: number,
  data: Record<string, any>[]
) => {
  ref!.proFormRef!.proFormItemRef![index].itemComponentRef!.ref.setExpandedKeys(
    data.map((item) => {
      const { id } = item
      return id
    })
  )
}
</script>
