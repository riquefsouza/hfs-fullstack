import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmProfileComponent } from './adm-profile.component';
import { FormsModule } from '@angular/forms';
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { AdmProfileRoutingModule } from './adm-profile-routing.module';
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
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import { AdmProfileDialogDelete } from './dialogs/adm-profile.dialog-delete';
import { AdmProfileDialogMultipleDelete } from './dialogs/adm-profile.dialog-multiple-delete';

@NgModule({
    imports: [
        CommonModule,
        AdmProfileRoutingModule,
        BaseComponentsModule,
        FormsModule,
        MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule,
        MatPaginatorModule, MatTableModule, MatSortModule, MatCheckboxModule,
        MatInputModule, MatFormFieldModule, MatDialogModule, MatDividerModule,
        MatMenuModule, MatSelectModule, MatListModule, MatGridListModule
    ],
    declarations: [AdmProfileComponent, AdmProfileDialogDelete, AdmProfileDialogMultipleDelete],
    providers: [
        ExportService, ErrorService, AuthService
    ]
})
export class AdmProfileModule { }
