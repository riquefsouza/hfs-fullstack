import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmParameterComponent } from './adm-parameter.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { AdmParameterRoutingModule } from './adm-parameter-routing.module';
import { ErrorService } from 'src/app/base/services/error.service';
import { ExportService } from 'src/app/base/services/export.service';
import { MessageService } from 'primeng/api';
import { AdmParameterCategoryService } from '../../service/AdmParameterCategoryService';
import { AuthService } from 'src/app/base/services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        AdmParameterRoutingModule,
        BaseComponentsModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        PanelModule,
        MenuModule
    ],
    declarations: [AdmParameterComponent],
    providers: [
        ExportService, ErrorService, MessageService, AuthService, AdmParameterCategoryService
    ]
})
export class AdmParameterModule { }
