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

@NgModule({
    imports: [
        CommonModule,
        AdmParameterCategoryRoutingModule,
        BaseComponentsModule,
        FormsModule,
        MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule
    ],
    declarations: [AdmParameterCategoryComponent],
    providers: [
        ExportService, ErrorService, AuthService
    ]
})
export class AdmParameterCategoryModule { }
