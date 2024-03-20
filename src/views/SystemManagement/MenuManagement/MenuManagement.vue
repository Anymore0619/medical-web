<template>
  <ProCard class="menu-management">
    <ProSearchTable ref="searchTableRef" v-bind="searchTable" v-model:loading="searchTable.loading">
      <!-- 表格上方内容 -->
      <template #over-table>
        <ActionButton class="float-right" v-bind="addButton" :loading="searchTable.loading" />
      </template>
    </ProSearchTable>
  </ProCard>
  <ProFormDialog v-bind="menuFormDialog" v-model:show="menuFormDialog.show" />
</template>

<script setup lang="ts">
import { getMenuTreeApi, addMenuApi, editMenuApi, deleteMenuApi } from '@/api/menu'
import { useDict } from '@/hooks/web/useDict'
import { setFormItem } from '@/utils/component-library'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { ActionButtonProps } from '@/views/components/ActionButton'
import type { UseDictReturnType } from '@/hooks/web/useDict'
import type {
  ProFormDialogProps,
  ProSearchTableInstance,
  ProSearchTableProps
} from 'component-library'

onMounted(async () => {
  /* 初始化字典 */
  dict = await useDict(['CDLX'])
  /* 初始化字典数据 */
  setFormItem(searchTable.tableProps!.columns!, {
    key: 'type',
    path: 'dict',
    value: dict.CDLX
  })
  /* 初始化查询 */
  searchTableRef.value!.query()
})
/* 删除菜单 */
const deleteMenu = (row: Record<string, any>) => {
  const { id, name } = row!
  ElMessageBox.confirm(`是否确定删除【${name}】菜单？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id
      }
      const res = await deleteMenuApi(params)
      if (res) {
        ElMessage.success(res.msg)
        searchTableRef.value!.query()
      }
    })
    .catch(() => {})
}
/* 字典 */
let dict: UseDictReturnType = {}
/* 搜索表格 */
const searchTableRef = ref<ProSearchTableInstance>()
const searchTable = reactive<ProSearchTableProps>({
  formProps: {
    model: {
      name: null
    }
  },
  hidePagination: true,
  loading: false,
  requestApi: getMenuTreeApi,
  responseMapping: (response) => {
    const { menuData } = response.data
    return {
      data: menuData
    }
  },
  tableProps: {
    columns: [
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '菜单名称',
        minWidth: 240,
        prop: 'name'
      },
      {
        dict: [],
        label: '菜单类型',
        minWidth: 120,
        prop: 'type'
      },
      {
        label: '菜单排序',
        minWidth: 120,
        prop: 'sort'
      },
      {
        label: '菜单图标',
        minWidth: 120,
        prop: 'icon'
      },
      {
        label: '菜单地址',
        minWidth: 300,
        prop: 'url'
      },
      {
        label: '权限标识',
        minWidth: 300,
        prop: 'perms'
      },
      {
        actions: [
          {
            click: (row) => {
              openMenuFormDialog('addChild', row!)
            },
            label: '新增'
          },
          {
            click: (row) => {
              openMenuFormDialog('edit', row!)
            },
            label: '编辑'
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
    ],
    defaultExpandAll: true
  }
})
/* 新增按钮 */
const addButton = reactive<ActionButtonProps>({
  actionType: 'add',
  click: () => {
    openMenuFormDialog('addRoot')
  }
})
/* 菜单表单弹窗 */
const menuFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  dialogProps: {
    title: ''
  },
  formProps: {
    items: [
      {
        itemType: 'input',
        label: '菜单名称',
        prop: 'name',
        rules: {
          message: '请输入菜单名称',
          required: true
        },
        span: 12
      },
      {
        itemProps: {
          options: []
        },
        itemType: 'select',
        label: '菜单类型',
        prop: 'type',
        rules: {
          message: '请选择菜单类型',
          required: true
        },
        span: 12
      },
      {
        itemType: 'input',
        label: '菜单排序',
        prop: 'sort',
        rules: {
          message: '请选择菜单排序',
          required: true
        },
        span: 12
      },
      {
        itemType: 'input',
        label: '菜单图标',
        prop: 'icon',
        span: 12
      },
      {
        itemType: 'input',
        label: '菜单地址',
        rules: {
          message: '请输入菜单地址',
          required: true
        },
        prop: 'url'
      },
      {
        itemType: 'input',
        label: '权限标识',
        prop: 'perms'
      }
    ],
    model: {
      icon: null,
      id: null,
      name: null,
      parentId: null,
      perms: null,
      sort: null,
      type: null,
      url: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开菜单表单弹窗 */
const openMenuFormDialog = (businessType: string, row?: Record<string, any>) => {
  menuFormDialog.businessType = businessType
  menuFormDialog.show = true
  /* 初始化字典数据 */
  setFormItem(menuFormDialog.formProps!.items!, {
    key: 'type',
    path: 'itemProps.options',
    value: dict.CDLX
  })
  nextTick(() => {
    if (businessType === 'addRoot') {
      menuFormDialog.dialogProps!.title = '新增顶级菜单'
      menuFormDialog.requestApi = addMenuApi
      Object.assign(menuFormDialog.formProps!.model!, {
        parentId: 0
      })
    } else if (businessType === 'addChild') {
      menuFormDialog.dialogProps!.title = '新增子级菜单'
      menuFormDialog.requestApi = addMenuApi
      const { id } = row!
      Object.assign(menuFormDialog.formProps!.model!, {
        parentId: id
      })
    } else if (businessType === 'edit') {
      menuFormDialog.dialogProps!.title = '编辑菜单'
      menuFormDialog.requestApi = editMenuApi
      const { icon, id, name, parentId, perms, sort, type, url } = row!
      Object.assign(menuFormDialog.formProps!.model!, {
        icon,
        id,
        name,
        parentId,
        perms,
        sort,
        type,
        url
      })
    }
  })
}
</script>
