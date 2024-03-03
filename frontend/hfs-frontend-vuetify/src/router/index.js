import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
//import Funcionario from "@/hfsfullstack/pages/Funcionario.vue";
import AdmParameterCategory from "@/admin/pages/AdmParameterCategory.vue";
import AdmParameter from "@/admin/pages/AdmParameter.vue";
/*
import AdmProfile from "@/admin/pages/AdmProfile.vue";
import AdmPage from "@/admin/pages/AdmPage.vue";
import AdmMenu from "@/admin/pages/AdmMenu.vue";
*/
import UsuarioPage from "@/system/usuario/UsuarioPage.vue";
import ConfigPage from "@/system/config/ConfigPage.vue";

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
                { path: '/admin/admParameter', name: 'admParameter', component: AdmParameter },
                { path: '/admin/admProfile', name: 'admProfile' },
                { path: '/admin/admPage', name: 'admPage' },
                { path: '/admin/admMenu', name: 'admMenu' },
                { path: '/system/usuario', name: 'usuario', component: UsuarioPage },
                { path: '/system/config', name: 'config', component: ConfigPage },
            ]
        },
        //{ path: '*', name: 'notfound', component: () => import('@/system/notfound/NotFoundPage.vue') },
        { path: '/notfound', name: 'notfound', component: () => import('@/system/notfound/NotFoundPage.vue') }
        //{ path: '**', redirectTo: '/notfound' },
    ]
});

//const authGuard = new AuthGuard();
/*
router.beforeEach(async (to, from, next) => {

    //authGuard.canActivate(to.fullPath, []).then(() =>{
    //    next();
    //});

    next();        
})
*/

export default router;
