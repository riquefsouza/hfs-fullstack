import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ReportPanelComponent } from './report-panel/report-panel.component';

@NgModule({
    declarations: [
        ReportPanelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        CheckboxModule,
    ],
    exports: [ReportPanelComponent]
})
export class BaseComponentsModule { }
