import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdmPageComponent } from './adm-page.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdmPageComponent }
	])],
	exports: [RouterModule]
})
export class AdmPageRoutingModule { }
