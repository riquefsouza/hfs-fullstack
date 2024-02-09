import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmParameterCategoryComponent } from './adm-parameter-category.component';
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
import { BaseComponentsModule } from 'src/app/base/components/base.components.module';
import { AdmParameterCategoryRoutingModule } from './adm-parameter-category-routing.module';
import { ErrorService } from 'src/app/base/services/error.service';
import { ExportService } from 'src/app/base/services/export.service';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from 'src/app/base/services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        AdmParameterCategoryRoutingModule,
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
        MessagesModule
    ],
    declarations: [AdmParameterCategoryComponent],
    providers: [
        ExportService, ErrorService, MessageService, AuthService
    ]
})
export class AdmParameterCategoryModule { }
