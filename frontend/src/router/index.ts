import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CustomerDashboard from '../views/CustomerDashboard.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard,
            meta: { requiresAuth: true, role: 'ADMIN' },
            children: [
                {
                    path: 'users',
                    name: 'admin-users',
                    component: () => import('../views/admin/UsersView.vue')
                },
                {
                    path: 'lessons',
                    name: 'admin-lessons',
                    component: () => import('../views/admin/LessonsView.vue')
                },
                {
                    path: 'notifications',
                    name: 'admin-notifications',
                    component: () => import('../views/admin/NotificationsView.vue')
                }
            ]
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: CustomerDashboard,
            meta: { requiresAuth: true, role: 'CUSTOMER' },
            children: [
                {
                    path: '', // Defaults to showing "My Lessons" or generic welcome? Let's generic welcome or just notifications for now? 
                    // Actually easier to just keep router-view simple. 
                    // CustomerDashboard template has `<router-view />`. 
                    // If ID 308 view_file showed CustomerDashboard having links to /lessons and /profile.
                    // We should add /notifications link there as well.
                    name: 'customer-home',
                    component: () => import('../views/customer/NotificationsView.vue') // Temporarily default to Notifs or Lessons?
                    // Let's create a dedicated file structure.
                },
                {
                    path: '/notifications',
                    component: () => import('../views/customer/NotificationsView.vue')
                },
                {
                    path: '/lessons',
                    component: () => import('../views/customer/LessonsView.vue')
                },
                {
                    path: '/lessons/:id',
                    component: () => import('../views/customer/LessonDetailView.vue')
                }
            ]
        },
        {
            path: '/',
            redirect: '/dashboard'
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.token) {
        next('/login');
    } else {
        next();
    }
});

export default router
