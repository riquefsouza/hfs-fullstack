import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './system/notfound/notfound.component';
import { AuthGuard } from './base/guard/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, 
                canActivate: [AuthGuard],
                children: [
                    { 
                        path: 'admin', 
                        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),                        
                        canActivate: [AuthGuard]
                        //data: {roles: ['Administrador','Gestor']}
                    },
                    { 
                        path: 'system', 
                        loadChildren: () => import('./system/system.module').then(m => m.SystemModule),                        
                        canActivate: [AuthGuard]
                        //data: {roles: ['Administrador','Gestor']}
                    },
                    { 
                        path: 'hfs', 
                        loadChildren: () => import('./hfsfullstack/hfsfullstack.module').then(m => m.HfsfullstackModule),                        
                        canActivate: [AuthGuard]
                        //data: {roles: ['Administrador','Gestor']}
                    }
                ]
            },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], 
        { 
            useHash: true,
            scrollPositionRestoration: 'enabled', 
            anchorScrolling: 'enabled', 
            onSameUrlNavigation: 'reload' 
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
