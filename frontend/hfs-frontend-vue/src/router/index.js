import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AdmParameterCategory from "@/admin/admParameterCategory/AdmParameterCategory.vue";

const router = createRouter({
    //history: createWebHashHistory(),
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                { path: '/', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
                { path: '/hfs/funcionario', name: 'funcionario' },
                { path: '/admin/admParameterCategory', name: 'admParameterCategory', component: AdmParameterCategory },
                { path: '/admin/admParameter', name: 'admParameter' },
                { path: '/admin/admProfile', name: 'admProfile' },
                { path: '/admin/admPage', name: 'admPage' },
                { path: '/admin/admMenu', name: 'admMenu' },
                { path: '/system/usuario', name: 'usuario', component: () => import('@/system/config/ConfigPage.vue') },
                { path: '/system/config', name: 'config', component: () => import('@/system/usuario/UsuarioPage.vue') },
            ]
        },
        { path: '/pages/notfound', name: 'notfound', component: () => import('@/system/notfound/NotFoundPage.vue') }
    ]
});

/*
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !userService.value.isLogged()) 
    next({ name: 'Login' })
  else 
    next()
})
*/

export default router;
