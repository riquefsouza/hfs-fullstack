import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'funcionario', loadChildren: () => import('./pages/funcionario/funcionario.module').then(m => m.FuncionarioModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class HfsfullstackRoutingModule { }
