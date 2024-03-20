<template>
  <ProFormDialog
    ref="passwordFormDialogRef"
    v-bind="passwordFormDialog"
    v-model:show="passwordFormDialog.show"
  />
</template>

<script setup lang="ts">
import { changeUserPasswordApi } from '@/api/user'
import md5 from 'md5'
import { ref, reactive, nextTick } from 'vue'
import type { ProFormDialogInstance, ProFormDialogProps } from 'component-library'

/* 密码表单弹窗 */
const passwordFormDialogRef = ref<ProFormDialogInstance>()
const passwordFormDialog = reactive<ProFormDialogProps>({
  businessType: '',
  customRequestParams: (params) => {
    const { newPassword, oldPassword } = params
    return {
      newPassword: md5(newPassword).toUpperCase(),
      oldPassword: md5(oldPassword).toUpperCase()
    }
  },
  dialogProps: {
    title: ''
  },
  formProps: {
    items: [
      {
        itemProps: {
          type: 'password'
        },
        itemType: 'input',
        label: '旧密码',
        prop: 'oldPassword',
        rules: {
          required: true,
          message: '请输入旧密码'
        }
      },
      {
        itemProps: {
          type: 'password'
        },
        itemType: 'input',
        label: '新密码',
        prop: 'newPassword',
        rules: {
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback(new Error('请输入新密码'))
            } else {
              if (passwordFormDialog.formProps!.model!.newPassword) {
                passwordFormDialogRef.value!.proFormRef!.ref!.validateField('confirmPassword')
              }
              callback()
            }
          }
        }
      },
      {
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
            } else if (value !== passwordFormDialog.formProps!.model!.newPassword) {
              callback(new Error('新密码与确认密码不一致'))
            } else {
              callback()
            }
          }
        }
      }
    ],
    model: {
      confirmPassword: null,
      newPassword: null,
      oldPassword: null
    }
  },
  requestApi: changeUserPasswordApi,
  show: false
})
/* 打开密码表单弹窗 */
const openUserPasswordFormDialog = (businessType: string) => {
  passwordFormDialog.businessType = businessType
  passwordFormDialog.show = true
  nextTick(() => {
    if (businessType === 'change') {
      passwordFormDialog.dialogProps!.title = '修改密码'
    }
  })
}

defineExpose({
  openUserPasswordFormDialog
})
</script>
