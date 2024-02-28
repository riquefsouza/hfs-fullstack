import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmParameterCategoryComponent } from './adm-parameter-category.component';
import { FormsModule } from '@angular/forms';
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { AdmParameterCategoryRoutingModule } from './adm-parameter-category-routing.module';
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
import { AdmParameterCategoryDialogDelete } from './dialogs/adm-parameter-category.dialog-delete';
import { AdmParameterCategoryDialogDetails } from './dialogs/adm-parameter-category.dialog-details';
import { AdmParameterCategoryDialogMultipleDelete } from './dialogs/adm-parameter-category.dialog-multiple-delete';

@NgModule({
    imports: [
        CommonModule,
        AdmParameterCategoryRoutingModule,
        BaseComponentsModule,
        FormsModule,
        MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule,
        MatPaginatorModule, MatTableModule, MatSortModule, MatCheckboxModule,
        MatInputModule, MatFormFieldModule, MatDialogModule
    ],
    declarations: [AdmParameterCategoryComponent, 
        AdmParameterCategoryDialogDetails, AdmParameterCategoryDialogDelete, 
        AdmParameterCategoryDialogMultipleDelete],
    providers: [
        ExportService, ErrorService, AuthService
    ]
})
export class AdmParameterCategoryModule { }
