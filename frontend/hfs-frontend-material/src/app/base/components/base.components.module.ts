import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportPanelComponent } from './report-panel/report-panel.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    declarations: [
        ReportPanelComponent
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule, MatCheckboxModule,
        MatFormFieldModule, MatSelectModule, MatInputModule, MatGridListModule
    ],
    exports: [ReportPanelComponent]
})
export class BaseComponentsModule { }
