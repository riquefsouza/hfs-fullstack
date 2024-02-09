import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        UsuarioRoutingModule,
        CardModule
    ],
    declarations: [UsuarioComponent]
})
export class UsuarioModule { }
