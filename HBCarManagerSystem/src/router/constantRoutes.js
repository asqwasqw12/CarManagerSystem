const constantRoutes = [
  {
    path:'/login',
    name:'login',
    hidden:true,
    component: () => import('@/views/login')
  },
  {
    path:'/register',
    name:'register',
    hidden:true,
    component: () => import('@/views/register')
  },
  {
    path:'/404',
    name:'404',
    hidden:true,
    component:() => ('@/views/error/404')
  },
  {
    path:'/',
    redirect:'/home',
    hidden:true
  }
]
