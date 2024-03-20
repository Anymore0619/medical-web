<template>
  <div class="department-management flex items-start">
    <ProCard class="w-75 mr-2">
      <ProTree ref="treeRef" v-bind="tree" v-model:current-node="tree.currentNode" />
    </ProCard>
    <ProCard class="flex-1">
      <ProSearchTable
        ref="searchTableRef"
        v-bind="searchTable"
        v-model:loading="searchTable.loading"
      >
        <!-- 表格上方内容 -->
        <template #over-table>
          <ActionButton class="float-right" v-bind="addButton" :loading="searchTable.loading" />
        </template>
      </ProSearchTable>
    </ProCard>
  </div>
  <ProFormDialog v-bind="departmentFormDialog" v-model:show="departmentFormDialog.show" />
</template>

<script setup lang="ts">
import {
  getDepartmentPageApi,
  addDepartmentApi,
  editDepartmentApi,
  deleteDepartmentApi
} from '@/api/department'
import { getOrganizationTreeApi } from '@/api/organization'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { ActionButtonProps } from '@/views/components/ActionButton'
import type {
  ProFormDialogProps,
  ProSearchTableInstance,
  ProSearchTableProps,
  ProTreeInstance,
  ProTreeProps
} from 'component-library'

onMounted(async () => {
  /* 初始化查询 */
  await treeRef.value!.query()
  searchTableRef.value!.query()
})
/* 删除部门 */
const deleteDepartment = (row: Record<string, any>) => {
  const { code, name } = row!
  ElMessageBox.confirm(`是否确定删除【${name}】部门？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id: code
      }
      const res = await deleteDepartmentApi(params)
      if (res) {
        ElMessage.success(res.msg)
        searchTableRef.value!.query()
      }
    })
    .catch(() => {})
}
/* 树 */
const treeRef = ref<ProTreeInstance>()
const tree = reactive<ProTreeProps>({
  currentNode: {},
  defaultExpandAll: true,
  hideLoadMoreButton: true,
  hideSearchInput: true,
  nodeClick: () => {
    searchTableRef.value!.query()
  },
  nodeKey: 'code',
  onRequestComplete: (response) => {
    const { orgData } = response.data
    tree.currentNode = orgData.length ? orgData[0] : {}
  },
  props: {
    label: 'name'
  },
  requestApi: getOrganizationTreeApi,
  responseMapping: (response) => {
    const { orgData } = response.data
    return {
      data: orgData
    }
  }
})
/* 搜索表格 */
const searchTableRef = ref<ProSearchTableInstance>()
const searchTable = reactive<ProSearchTableProps>({
  customRequestParams: (params) => {
    return {
      ...params,
      orgCode: tree.currentNode!.code
    }
  },
  formProps: {
    model: {
      name: null
    }
  },
  loading: false,
  requestApi: getDepartmentPageApi,
  tableProps: {
    columns: [
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '部门名称',
        minWidth: 120,
        prop: 'name'
      },
      {
        label: '备注',
        minWidth: 120,
        prop: 'remark'
      },
      {
        actions: [
          {
            click: (row) => {
              openDepartmentFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              deleteDepartment(row!)
            },
            label: '删除'
          }
        ],
        align: 'center',
        fixed: 'right',
        type: 'action',
        width: 120
      }
    ]
  }
})
/* 新增按钮 */
const addButton = reactive<ActionButtonProps>({
  actionType: 'add',
  click: () => {
    openDepartmentFormDialog('add')
  }
})
/* 部门表单弹窗 */
const departmentFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  customRequestParams: (params) => {
    return {
      ...params,
      orgCode: tree.currentNode!.code
    }
  },
  dialogProps: {
    title: ''
  },
  formProps: {
    items: [
      {
        itemType: 'input',
        label: '部门名称',
        prop: 'name',
        rules: {
          message: '请输入部门名称',
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
      code: null,
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
/* 打开部门表单弹窗 */
const openDepartmentFormDialog = (businessType: string, row?: Record<string, any>) => {
  departmentFormDialog.businessType = businessType
  departmentFormDialog.show = true
  nextTick(() => {
    if (businessType === 'add') {
      departmentFormDialog.dialogProps!.title = '新增部门'
      departmentFormDialog.requestApi = addDepartmentApi
    } else if (businessType === 'edit') {
      departmentFormDialog.dialogProps!.title = '编辑部门'
      departmentFormDialog.requestApi = editDepartmentApi
      const { code, name, remark } = row!
      Object.assign(departmentFormDialog.formProps!.model!, {
        code,
        name,
        remark
      })
    }
  })
}
</script>
