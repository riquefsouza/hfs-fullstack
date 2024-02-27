import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'admParameterCategory', 
            loadChildren: () => import('./pages/adm-parameter-category/adm-parameter-category.module')
            .then(m => m.AdmParameterCategoryModule) 
        },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
