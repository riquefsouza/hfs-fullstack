import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'admParameterCategory', 
            loadChildren: () => import('./pages/adm-parameter-category/adm-parameter-category.module')
            .then(m => m.AdmParameterCategoryModule) 
        },
        { path: 'admParameter', 
            loadChildren: () => import('./pages/adm-parameter/adm-parameter.module').then(m => m.AdmParameterModule) 
        },
        { path: 'admPage', 
            loadChildren: () => import('./pages/adm-page/adm-page.module').then(m => m.AdmPageModule) 
        },
        { path: 'admMenu', 
            loadChildren: () => import('./pages/adm-menu/adm-menu.module').then(m => m.AdmMenuModule) 
        },
        { path: 'admProfile', 
            loadChildren: () => import('./pages/adm-profile/adm-profile.module').then(m => m.AdmProfileModule) 
        },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
