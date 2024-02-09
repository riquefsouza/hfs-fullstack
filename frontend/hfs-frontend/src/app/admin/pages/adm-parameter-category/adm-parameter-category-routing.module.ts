import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdmParameterCategoryComponent } from './adm-parameter-category.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdmParameterCategoryComponent }
	])],
	exports: [RouterModule]
})
export class AdmParameterCategoryRoutingModule { }
