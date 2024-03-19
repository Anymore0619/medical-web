<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { provide, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ComponentSize } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { setCssVar } from '@/utils'
import { useDesign } from '@/hooks/web/useDesign'
import type { ProConfigProviderProps } from 'component-library'

const { variables } = useDesign()

const appStore = useAppStore()

const props = defineProps({
  size: propTypes.oneOf<ComponentSize>(['default', 'small', 'large']).def('default')
})

provide('configGlobal', props)

// 初始化所有主题色
onMounted(() => {
  appStore.setCssVarTheme()
})

const { width } = useWindowSize()

// 监听窗口变化
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      !appStore.getMobile ? appStore.setMobile(true) : undefined
      setCssVar('--left-menu-min-width', '0')
      appStore.setCollapse(true)
      appStore.getLayout !== 'classic' ? appStore.setLayout('classic') : undefined
    } else {
      appStore.getMobile ? appStore.setMobile(false) : undefined
      setCssVar('--left-menu-min-width', '64px')
    }
  },
  {
    immediate: true
  }
)

const configProvider: ProConfigProviderProps = {
  proFormDialogInjects: {
    responseMapping: (response) => {
      const { msg } = response
      return {
        message: msg
      }
    }
  },
  proSearchTableDialogInjects: {
    searchTableProps: {
      paginationProps: {
        props: {
          currentPage: 'rowIndex',
          pageSize: 'rowCount'
        }
      },
      responseMapping: (response) => {
        const { records, total } = response.data
        return {
          data: records.map((record, recordIndex) => {
            return {
              ...record,
              rowKey: recordIndex
            }
          }),
          total
        }
      },
      tableProps: {
        rowKey: 'id'
      }
    }
  },
  proSearchTableInjects: {
    paginationProps: {
      props: {
        currentPage: 'rowIndex',
        pageSize: 'rowCount'
      }
    },
    responseMapping: (response) => {
      const { records, total } = response.data
      return {
        data: records.map((record, recordIndex) => {
          return {
            ...record,
            rowKey: recordIndex
          }
        }),
        total
      }
    },
    tableProps: {
      rowKey: 'id',
      showToolbar: true
    }
  },
  proTreeInjects: {
    paginationProps: {
      props: {
        currentPage: 'rowIndex',
        pageSize: 'rowCount'
      }
    },
    responseMapping: (response) => {
      const { records, total } = response.data
      return {
        data: records,
        total
      }
    }
  }
}
</script>

<template>
  <ProConfigProvider
    v-bind="configProvider"
    :namespace="variables.elNamespace"
    :locale="zhCn"
    :message="{ max: 1 }"
    :size="size"
  >
    <slot></slot>
  </ProConfigProvider>
</template>
