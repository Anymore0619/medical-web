<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useDesign } from '@/hooks/web/useDesign'
import LockDialog from './components/LockDialog.vue'
import { ref, computed } from 'vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { useUserStore } from '@/store/modules/user'
import UserPasswordFormDialog from '@/views/components/UserPasswordFormDialog'
import type { UserPasswordFormDialogInstance } from '@/views/components/UserPasswordFormDialog'

const userStore = useUserStore()

const lockStore = useLockStore()

const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const loginOut = () => {
  userStore.logoutConfirm()
}

const dialogVisible = ref<boolean>(false)

/* 用户密码表单弹窗 */
const userPasswordFormDialogRef = ref<UserPasswordFormDialogInstance>()
/* 打开用户密码表单弹窗 */
const openUserPasswordFormDialog = (businessType: string) => {
  userPasswordFormDialogRef.value!.openUserPasswordFormDialog(businessType)
}

// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <Icon icon="ep:avatar" :size="18" />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        {{ userStore.getUserInfo?.userData?.name }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="openUserPasswordFormDialog('change')">修改密码</div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="lockScreen">锁定屏幕</div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="loginOut">退出系统</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <UserPasswordFormDialog ref="userPasswordFormDialogRef" />
  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
