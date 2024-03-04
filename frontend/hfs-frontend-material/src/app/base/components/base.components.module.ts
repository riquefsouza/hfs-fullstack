import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportPanelComponent } from './report-panel/report-panel.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PickListComponent } from './pick-list/pick-list.component';
import {MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        ReportPanelComponent, PickListComponent
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule, MatCheckboxModule, MatListModule, MatIconModule,
        MatFormFieldModule, MatSelectModule, MatInputModule, MatGridListModule, MatCardModule,
        MatButtonModule
    ],
    exports: [ReportPanelComponent, PickListComponent]
})
export class BaseComponentsModule { }
