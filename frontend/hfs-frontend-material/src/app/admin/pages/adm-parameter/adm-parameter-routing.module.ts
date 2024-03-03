import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdmParameterComponent } from './adm-parameter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdmParameterComponent }
	])],
	exports: [RouterModule]
})
export class AdmParameterRoutingModule { }
