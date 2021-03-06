import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

import UserList from '../components/user/UserList.vue'

const DataList = () => import('../components/data_report/DataList.vue')
const RoleList = () => import('../components/order_management/RoleList.vue')
const PermissionList = () => import('../components/order_management/PermissionList.vue')
const GoodsList = () => import('../components/goods/GoodsList.vue')
const SortList = () => import('../components/goods/SortList.vue')
const GoodsSort = () => import('../components/goods/GoodsSort.vue')
const OrderList = () => import('../components/goods_management/OrderList.vue')

const AddGood = () => import('../components/goods/AddGood.vue')
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/userlist',
    component: Home,
    children: [
      {
        path: '/home/userlist',
        name: 'UserList',
        component: UserList
      },
      {
        path: '/home/rolelist',
        name: 'RoleList',
        component: RoleList
      },
      {
        path: '/home/permissionlist',
        name: 'PermissionList',
        component: PermissionList
      },
      {
        path: '/home/goodslist',
        name: 'GoodsList',
        component: GoodsList,
      },
      {
        path: '/goodslist/addGood',
        name: 'AddGood',
        component: AddGood
      },
      {
        path: '/home/sortlist',
        name: 'SortList',
        component: SortList
      },
      {
        path: '/home/goodssort',
        name: 'GoodsSort',
        component: GoodsSort
      },
      {
        path: '/home/datalist',
        name: 'DataList',
        component: DataList
      },
      {
        path: '/home/orderlist',
        name: 'OrderList',
        component: OrderList
      },
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = window.sessionStorage.getItem('token');
    if(token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
