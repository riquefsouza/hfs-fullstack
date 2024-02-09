import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdmMenuComponent } from './adm-menu.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdmMenuComponent }
	])],
	exports: [RouterModule]
})
export class AdmMenuRoutingModule { }
