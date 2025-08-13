import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pages
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import AddProject from '@/pages/AddProject.vue'
import ProjectDetail from '@/pages/ProjectDetail.vue'
import Reports from '@/pages/Reports.vue'
import Settings from '@/pages/Settings.vue'
import Support from '@/pages/Support.vue'
import Users from '@/pages/Users.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'DashboardOngoing',
    component: Dashboard,
    meta: { requiresAuth: true },
    props: { projectType: 'ongoing' }
  },
  {
    path: '/dashboard/completed',
    name: 'DashboardCompleted',
    component: Dashboard,
    meta: { requiresAuth: true },
    props: { projectType: 'completed' }
  },
  {
    path: '/dashboard/shipped',
    name: 'DashboardShipped',
    component: Dashboard,
    meta: { requiresAuth: true },
    props: { projectType: 'shipped' }
  },
  {
    path: '/add-project',
    name: 'AddProject',
    component: AddProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router