import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioComponent } from './funcionario.component';
import { FormsModule } from '@angular/forms';
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { ErrorService } from 'src/app/base/services/error.service';
import { ExportService } from 'src/app/base/services/export.service';
import { AuthService } from 'src/app/base/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';  
import {MatSidenavModule} from '@angular/material/sidenav';  
import { FuncionarioDialogDelete } from './dialogs/funcionario.dialog-delete';
import { FuncionarioDialogMultipleDelete } from './dialogs/funcionario.dialog-multiple-delete';
import {MatGridListModule} from '@angular/material/grid-list'

@NgModule({
    imports: [
        CommonModule,
        FuncionarioRoutingModule,
        BaseComponentsModule,
        FormsModule, MatSidenavModule, MatGridListModule,
        MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule,
        MatPaginatorModule, MatTableModule, MatSortModule, MatCheckboxModule,
        MatInputModule, MatFormFieldModule, MatDialogModule, MatDividerModule
    ],
    declarations: [FuncionarioComponent, FuncionarioDialogDelete, FuncionarioDialogMultipleDelete],
    providers: [
        ExportService, ErrorService, AuthService
    ]
})
export class FuncionarioModule { }
