import layout from '@/layout'

const asyncRoutes = [
  {
    path:'/home',
    redirect:'/home/car_overview',
    hidden:true
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'car_overview',
        name:'car_overview',
        component:() => import('@/views/car/car_overview.vue'),
        meta:{
          icon:'fa truck',
          title:'车辆监管'
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'statistic_analysis',
        name:'statistic_analysis',
        component:() => import('@/views/analysis/statistic_analysis.vue'),
        meta:{
          icon:'fa line-chart',
          title:'统计分析',
          roles:['admin','technical']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'customer_manager',
        name:'customer_manager',
        component:() => import('@/views/customer/customer_manager.vue'),
        meta:{
          icon:'simle-o',
          title:'客户管理',
          roles:['sale','admin']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'info_in',
        name:'info_in',
        component:() => import('@/views/infomation/info_in.vue'),
        meta:{
          icon:'fa pencil',
          title:'信息录入',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'sys_log',
        name:'sys_log',
        component:() => import('@/views/log/sys_log.vue'),
        meta:{
          icon:'fa file-text-to',
          title:'系统日志',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'repair_manager',
        name:'repair_manager',
        component:() => import('@/views/support/repair_manager.vue'),
        meta:{
          icon:'fa wrench',
          title:'维修管理',
          roles:['service','admin']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'remote_upgrade',
        name:'remote_upgrade',
        component:() => import('@/views/upgrade/remote_upgrade.vue'),
        meta:{
          icon:'fa cloud-downdload',
          title:'远程升控',
          roles:['admin','operator','technical']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'upkeep_manager',
        name:'upkeep_manager',
        component:() => import('@/views/upkeep/upkeep_manager.vue'),
        meta:{
          icon:'fa gears',
          title:'保养管理',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/home',
    component:layout,
    children:[
      {
        path:'user_manager',
        name:'user_manager',
        component:() => import('@/views/user/user_manager.vue'),
        meta:{
          icon:'fa user-plus',
          title:'用户管理',
          roles:['admin','operator']
        }
      }
    ]
  }
]
export default asyncRoutes
