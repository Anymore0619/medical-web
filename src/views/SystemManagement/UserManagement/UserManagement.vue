<template>
  <div class="user-management flex items-start">
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
  <ProFormDialog
    ref="userFormDialogRef"
    v-bind="userFormDialog"
    v-model:show="userFormDialog.show"
  />
  <ProFormDialog
    ref="roleFormDialogRef"
    v-bind="roleFormDialog"
    v-model:show="roleFormDialog.show"
  />
</template>

<script setup lang="ts">
import { getDepartmentListApi } from '@/api/department'
import { getOrganizationTreeApi } from '@/api/organization'
import { getRoleListApi } from '@/api/role'
import {
  getUserPageApi,
  addUserApi,
  editUserApi,
  deleteUserApi,
  getUserRoleListApi,
  editUserRoleListApi,
  resetUserPasswordApi
} from '@/api/user'
import { setFormItem } from '@/utils/component-library'
import { cloneDeep } from 'lodash-es'
import md5 from 'md5'
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { ActionButtonProps } from '@/views/components/ActionButton'
import type {
  ProFormDialogInstance,
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
/* 获取部门列表 */
const getDepartmentList = async () => {
  const params = {
    orgCode: tree.currentNode!.code
  }
  const res = await getDepartmentListApi(params)
  if (res) {
    setFormItem(userFormDialog.formProps!.items!, {
      key: 'deptCode',
      path: 'itemProps.options',
      value: res.data.deptData.map((dept) => {
        const { code, name } = dept
        return {
          label: name,
          value: code
        }
      })
    })
  }
}
/* 获取角色列表 */
const getRoleList = async () => {
  const res = await getRoleListApi({})
  if (res) {
    setFormItem(roleFormDialog.formProps!.items!, {
      key: 'roleList',
      path: 'itemProps.options',
      value: res.data.roleData.map((role) => {
        const { id, name } = role
        return {
          label: name,
          value: id
        }
      })
    })
  }
}
/* 获取用户角色列表 */
const getUserRoleList = async () => {
  const { id } = roleFormDialog.formProps!.model!
  const params = {
    userId: id
  }
  const res = await getUserRoleListApi(params)
  if (res) {
    roleFormDialog.formProps!.model!.roleList = res.data.map((item) => {
      const { roleId } = item
      return roleId
    })
  }
}
/* 删除用户 */
const deleteUser = (row: Record<string, any>) => {
  const { id, name } = row!
  ElMessageBox.confirm(`是否确定删除【${name}】用户？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id
      }
      const res = await deleteUserApi(params)
      if (res) {
        ElMessage.success(res.msg)
        searchTableRef.value!.query()
      }
    })
    .catch(() => {})
}
/* 重置用户密码 */
const resetUserPassword = (row: Record<string, any>) => {
  const { id, name } = row
  ElMessageBox.confirm(`是否确定重置【${name}】用户的密码？`, '提示', { type: 'warning' })
    .then(async () => {
      const params = {
        id
      }
      const res = await resetUserPasswordApi(params)
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
  requestApi: getUserPageApi,
  tableProps: {
    columns: [
      {
        label: '部门名称',
        minWidth: 120,
        prop: 'deptCode'
      },
      {
        label: '用户账号',
        minWidth: 120,
        prop: 'account'
      },
      {
        formItemProps: {
          itemType: 'input',
          span: 6
        },
        label: '用户名称',
        minWidth: 120,
        prop: 'name'
      },
      {
        label: '用户手机',
        minWidth: 120,
        prop: 'mobile'
      },
      {
        label: '用户邮箱',
        minWidth: 120,
        prop: 'email'
      },
      {
        actions: [
          {
            click: (row) => {
              openRoleFormDialog('association', row!)
            },
            label: '角色'
          },
          {
            click: (row) => {
              openUserFormDialog('edit', row!)
            },
            label: '编辑'
          },
          {
            click: (row) => {
              deleteUser(row!)
            },
            label: '删除'
          },
          {
            click: (row) => {
              resetUserPassword(row!)
            },
            label: '重置密码'
          }
        ],
        align: 'center',
        fixed: 'right',
        maxActionNumber: 0,
        type: 'action',
        width: 210
      }
    ]
  }
})
/* 新增按钮 */
const addButton = reactive<ActionButtonProps>({
  actionType: 'add',
  click: () => {
    openUserFormDialog('add')
  }
})
/* 用户表单弹窗 */
const userFormDialogRef = ref<ProFormDialogInstance>()
const userFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  customRequestParams: (params) => {
    const { confirmPassword, password } = params
    if (confirmPassword && password) {
      return {
        ...params,
        orgCode: tree.currentNode!.code,
        password: md5(password).toUpperCase()
      }
    } else {
      return {
        ...params,
        orgCode: tree.currentNode!.code
      }
    }
  },
  dialogProps: {
    beforeClose: () => {
      userFormDialog.formProps!.items = cloneDeep(userFormDialogFormItemsClone)
    },
    title: ''
  },
  formProps: {
    items: [
      {
        itemProps: {
          disabled: false,
          options: []
        },
        itemType: 'select',
        label: '部门名称',
        prop: 'deptCode'
      },
      {
        itemProps: {
          disabled: false
        },
        itemType: 'input',
        label: '用户账号',
        prop: 'account',
        rules: {
          message: '请输入用户账号',
          required: true
        },
        span: 12
      },
      {
        hidden: false,
        itemProps: {
          type: 'password'
        },
        itemType: 'input',
        label: '用户密码',
        prop: 'password',
        rules: {
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback(new Error('请输入用户密码'))
            } else {
              if (userFormDialog.formProps!.model!.password) {
                userFormDialogRef.value!.proFormRef!.ref!.validateField('confirmPassword')
              }
              callback()
            }
          }
        },
        span: 12
      },
      {
        hidden: false,
        itemProps: {
          type: 'password'
        },
        itemType: 'input',
        label: '确认密码',
        prop: 'confirmPassword',
        rules: {
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback(new Error('请输入确认密码'))
            } else if (value !== userFormDialog.formProps!.model!.password) {
              callback(new Error('用户密码与确认密码不一致'))
            } else {
              callback()
            }
          }
        },
        span: 12
      },
      {
        itemType: 'input',
        label: '用户名称',
        prop: 'name',
        rules: {
          message: '请输入用户名称',
          required: true
        },
        span: 12
      },
      {
        itemType: 'input',
        label: '用户手机',
        prop: 'mobile',
        span: 12
      },
      {
        itemType: 'input',
        label: '用户邮箱',
        prop: 'email',
        span: 12
      }
    ],
    model: {
      account: null,
      confirmPassword: null,
      deptCode: null,
      email: null,
      id: null,
      mobile: null,
      name: null,
      password: null
    }
  },
  onRequestComplete: () => {
    searchTableRef.value!.query()
  },
  requestApi: undefined,
  show: false
})
/* 打开用户表单弹窗 */
const openUserFormDialog = (businessType: string, row?: Record<string, any>) => {
  userFormDialog.businessType = businessType
  userFormDialog.show = true
  getDepartmentList()
  nextTick(() => {
    if (businessType === 'add') {
      userFormDialog.dialogProps!.title = '新增用户'
      userFormDialog.requestApi = addUserApi
    } else if (businessType === 'edit') {
      userFormDialog.dialogProps!.title = '编辑用户'
      userFormDialog.requestApi = editUserApi
      setFormItem(userFormDialog.formProps!.items!, [
        {
          key: 'deptCode',
          path: 'itemProps.disabled',
          value: true
        },
        {
          key: 'account',
          path: 'itemProps.disabled',
          value: true
        },
        {
          key: 'password',
          path: 'hidden',
          value: true
        },
        {
          key: 'confirmPassword',
          path: 'hidden',
          value: true
        }
      ])
      const { account, email, id, mobile, name, sueRef } = row!
      Object.assign(userFormDialog.formProps!.model!, {
        account,
        deptCode: sueRef.deptCode,
        email,
        id,
        mobile,
        name
      })
    }
  })
}
/* 用户表单弹窗表单项克隆 */
const userFormDialogFormItemsClone = cloneDeep(userFormDialog.formProps!.items)
/* 角色表单弹窗 */
const roleFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  customRequestParams: (params) => {
    const { id, roleList } = params
    return {
      userId: id,
      roleIds: roleList.join(',')
    }
  },
  dialogProps: {
    beforeClose: () => {
      roleFormDialog.formProps!.items = cloneDeep(roleFormDialogFormItemsClone)
    },
    title: ''
  },
  formProps: {
    items: [
      {
        itemProps: {
          multiple: true
        },
        itemType: 'select',
        prop: 'roleList'
      }
    ],
    model: {
      id: null,
      roleList: []
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
  nextTick(async () => {
    if (businessType === 'association') {
      roleFormDialog.dialogProps!.title = '关联用户角色'
      roleFormDialog.requestApi = editUserRoleListApi
    }
    const { id } = row!
    Object.assign(roleFormDialog.formProps!.model!, {
      id
    })
    await getRoleList()
    getUserRoleList()
  })
}
/* 角色表单弹窗表单项克隆 */
const roleFormDialogFormItemsClone = cloneDeep(roleFormDialog.formProps!.items)
</script>
