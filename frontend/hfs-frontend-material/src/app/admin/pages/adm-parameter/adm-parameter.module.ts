import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmParameterComponent } from './adm-parameter.component';
import { FormsModule } from '@angular/forms';
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { AdmParameterRoutingModule } from './adm-parameter-routing.module';
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
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { AdmParameterDialogDelete } from './dialogs/adm-parameter.dialog-delete';
import { AdmParameterDialogDetails } from './dialogs/adm-parameter.dialog-details';
import { AdmParameterDialogMultipleDelete } from './dialogs/adm-parameter.dialog-multiple-delete';

@NgModule({
    imports: [
        CommonModule,
        AdmParameterRoutingModule,
        BaseComponentsModule,
        FormsModule,
        MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule,
        MatPaginatorModule, MatTableModule, MatSortModule, MatCheckboxModule,
        MatInputModule, MatFormFieldModule, MatDialogModule, MatDividerModule,
        MatMenuModule, MatSelectModule
    ],
    declarations: [AdmParameterComponent, 
        AdmParameterDialogDetails, AdmParameterDialogDelete, 
        AdmParameterDialogMultipleDelete],
    providers: [
        ExportService, ErrorService, AuthService
    ]
})
export class AdmParameterModule { }
