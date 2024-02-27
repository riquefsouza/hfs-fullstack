import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        UsuarioRoutingModule,
        MatCardModule
    ],
    declarations: [UsuarioComponent]
})
export class UsuarioModule { }
