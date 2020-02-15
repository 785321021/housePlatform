import Nofound from '.././components/console/Nofound.vue'
import Login from '.././components/console/Login.vue'
import Logout from '.././components/console/Logout.vue'
import Iframe from '.././components/console/Iframe.vue'
import Main from '.././components/console/main/Main.vue'
import ArticleList from '.././components/console/main/ArticleList.vue'
import ArticleAdd from '.././components/console/main/ArticleAdd.vue'
import CateList from '.././components/console/main/CateList.vue'
import MenuTree from '.././components/console/main/MenuTree.vue'
import SectionList from '.././components/console/main/SectionList.vue'
import RoleList from '.././components/console/main/RoleList.vue'
import AdminList from '.././components/console/main/AdminList.vue'
import AdminSelfEditInfo from '.././components/console/main/AdminEditInfo.vue'
import AdminSelfEditPwd from '.././components/console/main/AdminEditPwd.vue'
import Config from '.././components/console/main/Config.vue'
import TypeList from '.././components/console/main/TypeList.vue'
import LogList from '.././components/console/main/LogList.vue'

import DictTypeList from '.././components/console/main/DictTypeList.vue'

import SellHouseList from '.././components/console/house/SellHouseList.vue'
import Building from '.././components/console/house/Building.vue'
import Town from '.././components/console/house/Town.vue'

export default [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    // 登录
    {
      path: '/console/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    // 内容的模板
    {
        path: '/console/',
        component: Iframe,
        meta: { requiresAuth: true },
        children: [
            // 操作日志
            {
              path: 'log/list',
              name: 'log-list',
              component: LogList,
              meta: { requiresAuth: true }
            },
            // 分类管理
            {
              path: 'type/list',
              name: 'type-list',
              component: TypeList,
              meta: { requiresAuth: true }
            },
            // 系统设置
            {
              path: 'config/index',
              name: 'config-index',
              component: Config,
              meta: { requiresAuth: true }
            },
            // 用户
            {
              path: 'admin/list',
              name: 'admin-list',
              component: AdminList,
              meta: { requiresAuth: true }
            },
            // 字典
            {
              path: 'dictType/list',
              name: 'dictType-list',
              component: DictTypeList,
              meta: { requiresAuth: true }
            },
            // 房屋
            {
              path: 'house/list',
              name: 'house-list',
              component: SellHouseList,
              meta: { requiresAuth: true }
            },
            // 楼盘
            {
              path: 'building/list',
              name: 'building-list',
              component: Building,
              meta: { requiresAuth: true }
            },
            // 片区
            {
              path: 'town/list',
              name: 'town-list',
              component: Town,
              meta: { requiresAuth: true }
            },
            {
              path: 'admin/selfeditinfo',
              name: 'admin-selfeditinfo',
              component: AdminSelfEditInfo,
              meta: { requiresAuth: true }
            },
            {
              path: 'admin/selfeditpwd',
              name: 'admin-selfeditpwd',
              component: AdminSelfEditPwd,
              meta: { requiresAuth: true }
            },
            // 角色
            {
              path: 'role/list',
              name: 'role-list',
              component: RoleList,
              meta: { requiresAuth: true }
            },
            // 部门
            {
              path: 'section/list',
              name: 'section-list',
              component: SectionList,
              meta: { requiresAuth: true }
            },
            // 权限菜单
            {
              path: 'menu/tree',
              name: 'menu-tree',
              component: MenuTree,
              meta: { requiresAuth: true }
            },
            // 其它404
            {
                path: '*',
                name: 'noaccess',
                meta: { requiresAuth: true },
                component: Nofound
            }
        ]
    },
    // 其它404
    {
        path: '*',
        name: 'noaccess2',
        meta: { requiresAuth: false },
        component: Nofound
    },
]