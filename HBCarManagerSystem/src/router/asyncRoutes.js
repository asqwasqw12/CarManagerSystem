import layout from '@/layout'

const asyncRoutes = [
  {
    path:'/user_manager',
    component:layout,
    redirect:'/user_manager/right_config',
    name:'user_manager',
    meta:{
      title:'用户管理',
      icon:'fa fa-user-o',
      roles:['admin','operator']
    },
    children:[
      {
        path:'right_config',
        name:'right_config',
        component: () => import('@/views/user/user_right_config.vue'),
        //component:() => import('@/views/car/car_overview.vue'),
        meta:{
          icon:'fa fa-users',
          title:'权限设置',
          roles:['admin','operator']
        }
      },
      {
        path:'new_user_check',
        name:'new_user_check',
        component:() => import('@/views/user/new_user_check.vue'),
        //component:() => import('@/views/car/car_overview.vue'),
        meta:{
          icon:'fa fa-user-plus',
          title:'新用户审核',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/home',
    redirect:'/car_overview/index',
    component:layout,
    hidden:true
  },
  {
    path: '/car_overview',
    component:layout,
    children:[
      {
         path:'index',
         name:'car_overview',
        component:() => import('@/views/car/car_overview.vue'),
        meta:{
          icon:'fa fa-truck',
          title:'车辆监管'
        }
      }
    ]
  },
  {
    path:'/statistic_analysis',
    component:layout,
    children:[
      {
        path:'index',
        name:'statistic_analysis',
        component:() => import('@/views/analysis/statistic_analysis.vue'),
        meta:{
          icon:'fa fa-line-chart',
          title:'统计分析',
          roles:['admin','technical']
        }
      }
    ]
  },
  {
    path:'/customer_manager',
    component:layout,
    children:[
      {
        path:'index',
        name:'customer_manager',
        component:() => import('@/views/customer/customer_manager.vue'),
        meta:{
          icon:'fa fa-smile-o',
          title:'客户管理',
          roles:['sale','admin']
        }
      }
    ]
  },
  {
    path:'/info_in',
    component:layout,
    children:[
      {
        path:'index',
        name:'info_in',
        component:() => import('@/views/infomation/info_in.vue'),
        meta:{
          icon:'fa fa-pencil',
          title:'信息录入',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/sys_log',
    component:layout,
    children:[
      {
        path:'index',
        name:'sys_log',
        component:() => import('@/views/log/sys_log.vue'),
        meta:{
          icon:'fa fa-file-text-o',
          title:'系统日志',
          roles:['admin','operator']
        }
      }
    ]
  },
  {
    path:'/repair_manager',
    component:layout,
    children:[
      {
        path:'index',
        name:'repair_manager',
        component:() => import('@/views/support/repair_manager.vue'),
        meta:{
          icon:'fa fa-wrench',
          title:'维修管理',
          roles:['service','admin']
        }
      }
    ]
  },
  {
    path:'/remote_upgrade',
    component:layout,
    children:[
      {
        path:'index',
        name:'remote_upgrade',
        component:() => import('@/views/upgrade/remote_upgrade.vue'),
        meta:{
          icon:'fa fa-cloud-download',
          title:'远程升控',
          roles:['admin','operator','technical']
        }
      }
    ]
  },
  {
    path:'/upkeep_manager',
    component:layout,
    children:[
      {
        path:'index',
        name:'upkeep_manager',
        component:() => import('@/views/upkeep/upkeep_manager.vue'),
        meta:{
          icon:'fa fa-gears',
          title:'保养管理',
          roles:['admin','operator']
        }
      }
    ]
  }
]
export default asyncRoutes
