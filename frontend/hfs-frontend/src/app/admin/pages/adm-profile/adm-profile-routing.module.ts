import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdmProfileComponent } from './adm-profile.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdmProfileComponent }
	])],
	exports: [RouterModule]
})
export class AdmProfileRoutingModule { }
