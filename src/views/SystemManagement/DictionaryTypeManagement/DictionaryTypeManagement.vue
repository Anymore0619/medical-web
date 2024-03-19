<template>
  <ProCard class="dictionary-type-management">
    <ProSearchTable ref="searchTableRef" v-bind="searchTable" v-model:loading="searchTable.loading">
      <!-- 表格上方内容 -->
      <template #over-table>
        <ActionButton class="float-right" v-bind="addButton" :loading="searchTable.loading" />
      </template>
    </ProSearchTable>
  </ProCard>
  <ProFormDialog v-bind="dictionaryTypeFormDialog" v-model:show="dictionaryTypeFormDialog.show" />
</template>

<script setup lang="ts">
import {
  getDictionaryTypePageApi,
  addDictionaryTypeApi,
  editDictionaryTypeApi,
  deleteDictionaryTypeApi
} from '@/api/dictionary'
import { setFormItem } from '@/utils/component-library'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { ActionButtonProps } from '@/views/components/ActionButton'
import type {
  ProFormDialogProps,
  ProSearchTableInstance,
  ProSearchTableProps
} from 'component-library'

onMounted(() => {
  /* 初始化查询 */
  searchTableRef.value!.query()
})
/* 删除字典类型 */
const deleteDictionaryType = (row: Record<string, any>) => {
  const { typeCode, typeName } = row!
  ElMessageBox.confirm(`是否确定删除【${typeName}】字典类型？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id: typeCode
      }
      const res = await deleteDictionaryTypeApi(params)
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
      typeCode: null,
      typeName: null
    }
  },
  loading: false,
  requestApi: getDictionaryTypePageApi,
  tableProps: {
    columns: [
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '字典类型编码',
        minWidth: 150,
        prop: 'typeCode'
      },
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '字典类型名称',
        minWidth: 150,
        prop: 'typeName'
      },
      {
        actions: [
          {
            click: (row) => {
              openDictionaryTypeFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              deleteDictionaryType(row!)
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
    openDictionaryTypeFormDialog('add')
  }
})
/* 字典类型表单弹窗 */
const dictionaryTypeFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  dialogProps: {
    beforeClose: () => {
      setFormItem(dictionaryTypeFormDialog.formProps!.items!, {
        key: 'typeCode',
        path: 'itemProps.disabled',
        value: false
      })
    },
    title: ''
  },
  formProps: {
    items: [
      {
        itemProps: {
          disabled: false
        },
        itemType: 'input',
        label: '字典类型编码',
        prop: 'typeCode',
        rules: {
          message: '请输入字典类型编码',
          required: true
        }
      },
      {
        itemType: 'input',
        label: '字典类型名称',
        prop: 'typeName',
        rules: {
          message: '请输入字典类型名称',
          required: true
        }
      }
    ],
    model: {
      typeCode: null,
      typeName: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开字典类型表单弹窗 */
const openDictionaryTypeFormDialog = (businessType: string, row?: Record<string, any>) => {
  dictionaryTypeFormDialog.businessType = businessType
  dictionaryTypeFormDialog.show = true
  nextTick(() => {
    if (businessType === 'add') {
      dictionaryTypeFormDialog.dialogProps!.title = '新增字典类型'
      dictionaryTypeFormDialog.requestApi = addDictionaryTypeApi
    } else if (businessType === 'edit') {
      dictionaryTypeFormDialog.dialogProps!.title = '编辑字典类型'
      setFormItem(dictionaryTypeFormDialog.formProps!.items!, {
        key: 'typeCode',
        path: 'itemProps.disabled',
        value: true
      })
      dictionaryTypeFormDialog.requestApi = editDictionaryTypeApi
      const { typeCode, typeName } = row!
      Object.assign(dictionaryTypeFormDialog.formProps!.model!, {
        typeCode,
        typeName
      })
    }
  })
}
</script>
