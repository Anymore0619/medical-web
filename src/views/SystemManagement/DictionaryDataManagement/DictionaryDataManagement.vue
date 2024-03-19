<template>
  <ProCard class="dictionary-data-management">
    <ProSearchTable ref="searchTableRef" v-bind="searchTable" v-model:loading="searchTable.loading">
      <!-- 表格上方内容 -->
      <template #over-table>
        <ActionButton class="float-right" v-bind="addButton" :loading="searchTable.loading" />
      </template>
    </ProSearchTable>
  </ProCard>
  <ProFormDialog v-bind="dictionaryDataFormDialog" v-model:show="dictionaryDataFormDialog.show" />
</template>

<script setup lang="ts">
import {
  getDictionaryDataPageApi,
  addDictionaryDataApi,
  editDictionaryDataApi,
  deleteDictionaryDataApi
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
/* 删除字典数据 */
const deleteDictionaryData = (row: Record<string, any>) => {
  const { itemCode, itemName, typeCode } = row!
  ElMessageBox.confirm(`是否确定删除【${itemName}】字典数据？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        itemCode,
        typeCode
      }
      const res = await deleteDictionaryDataApi(params)
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
      typeName: null,
      itemCode: null,
      itemName: null
    }
  },
  loading: false,
  requestApi: getDictionaryDataPageApi,
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
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '字典数据编码',
        minWidth: 150,
        prop: 'itemCode'
      },
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '字典数据名称',
        minWidth: 150,
        prop: 'itemName'
      },
      {
        label: '排序',
        minWidth: 120,
        prop: 'sort'
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
              openDictionaryDataFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              deleteDictionaryData(row!)
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
    openDictionaryDataFormDialog('add')
  }
})
/* 字典数据表单弹窗 */
const dictionaryDataFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  dialogProps: {
    beforeClose: () => {
      setFormItem(dictionaryDataFormDialog.formProps!.items!, [
        {
          key: 'typeCode',
          path: 'itemProps.disabled',
          value: false
        },
        {
          key: 'itemCode',
          path: 'itemProps.disabled',
          value: false
        }
      ])
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
        itemProps: {
          disabled: false
        },
        itemType: 'input',
        label: '字典数据编码',
        prop: 'itemCode',
        rules: {
          message: '请输入字典数据编码',
          required: true
        }
      },
      {
        itemType: 'input',
        label: '字典数据名称',
        prop: 'itemName',
        rules: {
          message: '请输入字典数据名称',
          required: true
        }
      },
      {
        itemProps: {
          align: 'left',
          min: 1,
          precision: 0
        },
        itemType: 'inputNumber',
        label: '排序',
        prop: 'sort',
        rules: {
          message: '请输入排序',
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
      itemCode: null,
      itemName: null,
      remark: null,
      sort: null,
      typeCode: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开字典数据表单弹窗 */
const openDictionaryDataFormDialog = (businessType: string, row?: Record<string, any>) => {
  dictionaryDataFormDialog.businessType = businessType
  dictionaryDataFormDialog.show = true
  nextTick(() => {
    if (businessType === 'add') {
      dictionaryDataFormDialog.dialogProps!.title = '新增字典数据'
      dictionaryDataFormDialog.requestApi = addDictionaryDataApi
    } else if (businessType === 'edit') {
      dictionaryDataFormDialog.dialogProps!.title = '编辑字典数据'
      setFormItem(dictionaryDataFormDialog.formProps!.items!, [
        {
          key: 'typeCode',
          path: 'itemProps.disabled',
          value: true
        },
        {
          key: 'itemCode',
          path: 'itemProps.disabled',
          value: true
        }
      ])
      dictionaryDataFormDialog.requestApi = editDictionaryDataApi
      const { itemCode, itemName, remark, sort, typeCode } = row!
      Object.assign(dictionaryDataFormDialog.formProps!.model!, {
        itemCode,
        itemName,
        remark,
        sort,
        typeCode
      })
    }
  })
}
</script>
