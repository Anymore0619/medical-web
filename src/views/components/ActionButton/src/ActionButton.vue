<template>
  <ProButton
    v-if="isFunction(props.hidden) ? !props.hidden?.() : !props.hidden"
    class="action-button ml-4.5"
    @click="props.click"
    :disabled="props.loading"
    :icon="icon"
    :label="label"
    :loading="props.loading"
    :type="type"
  />
</template>

<script setup lang="ts">
import { Download, Plus } from '@element-plus/icons-vue'
import { isFunction } from 'lodash-es'
import { computed } from 'vue'
import type { ActionButtonProps } from './ActionButton'

/* 属性 */
const props = withDefaults(defineProps<ActionButtonProps>(), {
  loading: false
})
/* 辅助参数 */
const icon = computed(() => {
  switch (props.actionType) {
    case 'add':
      return Plus
    case 'syncExport':
      return Download
    default:
      return undefined
  }
})
const label = computed(() => {
  switch (props.actionType) {
    case 'add':
      return '新增'
    case 'syncExport':
      return '导出'
    default:
      return undefined
  }
})
const type = computed(() => {
  switch (props.actionType) {
    case 'add':
      return 'primary'
    case 'syncExport':
      return ''
    default:
      return undefined
  }
})
</script>
