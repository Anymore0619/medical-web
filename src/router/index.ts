import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { NO_RESET_WHITE_LIST } from '@/constants'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/home',
    redirect: '/home/index',
    component: Layout,
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Home.vue'),
        name: 'HomeIndex',
        meta: {
          affix: true,
          icon: 'ep:house',
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/system-management',
    redirect: '/system-management/menu-management',
    component: Layout,
    meta: {
      icon: 'ep:setting',
      title: '系统管理'
    },
    name: 'SystemManagement',
    children: [
      {
        path: 'role-management',
        component: () => import('@/views/SystemManagement/RoleManagement/RoleManagement.vue'),
        name: 'RoleManagement',
        meta: {
          icon: 'ep:avatar',
          title: '角色管理'
        }
      },
      {
        path: 'menu-management',
        component: () => import('@/views/SystemManagement/MenuManagement/MenuManagement.vue'),
        name: 'MenuManagement',
        meta: {
          icon: 'ep:menu',
          title: '菜单管理'
        }
      },
      {
        path: 'dictionary-type-management',
        component: () =>
          import('@/views/SystemManagement/DictionaryTypeManagement/DictionaryTypeManagement.vue'),
        name: 'DictionaryTypeManagement',
        meta: {
          icon: 'ep:reading',
          title: '字典类型管理'
        }
      },
      {
        path: 'dictionary-data-management',
        component: () =>
          import('@/views/SystemManagement/DictionaryDataManagement/DictionaryDataManagement.vue'),
        name: 'DictionaryDataManagement',
        meta: {
          icon: 'ep:document-copy',
          title: '字典数据管理'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
