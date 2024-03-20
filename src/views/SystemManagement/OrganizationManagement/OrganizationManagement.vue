<template>
  <ProCard class="organization-management">
    <ProSearchTable
      ref="searchTableRef"
      v-bind="searchTable"
      v-model:loading="searchTable.loading"
    />
  </ProCard>
  <ProFormDialog v-bind="organizationFormDialog" v-model:show="organizationFormDialog.show" />
</template>

<script setup lang="ts">
import {
  getOrganizationTreeApi,
  addOrganizationApi,
  editOrganizationApi,
  deleteOrganizationApi
} from '@/api/organization'
import { useDict } from '@/hooks/web/useDict'
import { setFormItem } from '@/utils/component-library'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { UseDictReturnType } from '@/hooks/web/useDict'
import type {
  ProFormDialogProps,
  ProSearchTableInstance,
  ProSearchTableProps
} from 'component-library'

onMounted(async () => {
  /* 初始化字典 */
  dict = await useDict(['JGLX'])
  /* 初始化字典数据 */
  setFormItem(searchTable.tableProps!.columns!, {
    key: 'type',
    path: 'dict',
    value: dict.JGLX
  })
  /* 初始化查询 */
  searchTableRef.value!.query()
})
/* 删除机构 */
const deleteOrganization = (row: Record<string, any>) => {
  const { code, name } = row!
  ElMessageBox.confirm(`是否确定删除【${name}】机构？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id: code
      }
      const res = await deleteOrganizationApi(params)
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
  requestApi: getOrganizationTreeApi,
  responseMapping: (response) => {
    const { orgData } = response.data
    return {
      data: orgData.map((org) => {
        const { code, parentCode } = org
        return {
          ...org,
          id: code,
          pid: parentCode
        }
      })
    }
  },
  tableProps: {
    columns: [
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '机构名称',
        minWidth: 240,
        prop: 'name'
      },
      {
        dict: [],
        label: '机构类型',
        minWidth: 120,
        prop: 'type'
      },
      {
        label: '机构地址',
        minWidth: 300,
        prop: 'address'
      },
      {
        label: '备注',
        minWidth: 180,
        prop: 'remark'
      },
      {
        actions: [
          {
            click: (row) => {
              openOrganizationFormDialog('addChild', row!)
            },
            label: '新增'
          },
          {
            click: (row) => {
              openOrganizationFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              deleteOrganization(row!)
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
/* 机构表单弹窗 */
const organizationFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  dialogProps: {
    title: ''
  },
  formProps: {
    items: [
      {
        itemType: 'input',
        label: '机构名称',
        prop: 'name',
        rules: {
          message: '请输入机构名称',
          required: true
        },
        span: 12
      },
      {
        itemProps: {
          options: []
        },
        itemType: 'select',
        label: '机构类型',
        prop: 'type',
        rules: {
          message: '请选择机构类型',
          required: true
        },
        span: 12
      },
      {
        itemType: 'input',
        label: '机构地址',
        prop: 'address'
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
      address: null,
      code: null,
      name: null,
      parentCode: null,
      remark: null,
      type: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开机构表单弹窗 */
const openOrganizationFormDialog = (businessType: string, row?: Record<string, any>) => {
  organizationFormDialog.businessType = businessType
  organizationFormDialog.show = true
  /* 初始化字典数据 */
  setFormItem(organizationFormDialog.formProps!.items!, {
    key: 'type',
    path: 'itemProps.options',
    value: dict.JGLX
  })
  nextTick(() => {
    if (businessType === 'addChild') {
      organizationFormDialog.dialogProps!.title = '新增子级机构'
      organizationFormDialog.requestApi = addOrganizationApi
      const { code } = row!
      Object.assign(organizationFormDialog.formProps!.model!, {
        parentCode: code
      })
    } else if (businessType === 'edit') {
      organizationFormDialog.dialogProps!.title = '编辑机构'
      organizationFormDialog.requestApi = editOrganizationApi
      const { address, code, name, parentCode, remark, type } = row!
      Object.assign(organizationFormDialog.formProps!.model!, {
        address,
        code,
        name,
        parentCode,
        remark,
        type
      })
    }
  })
}
</script>
