import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameter } from "src/app/admin/api/AdmParameter";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";
import { AdmParameterCategoryService } from "src/app/admin/service/AdmParameterCategoryService";

@Component({
    selector: 'adm-parameter.dialog-details',
    styleUrls: ["./adm-parameter.dialog-details.css"],
    templateUrl: 'adm-parameter.dialog-details.html',
    providers: [AdmParameterCategoryService]
})
export class AdmParameterDialogDetails {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterDialogDetails>,
        @Inject(MAT_DIALOG_DATA) public data: {
            listaAdmParameterCategory: AdmParameterCategory[],
            entidade: AdmParameter
        },
        private admParameterCategoryService: AdmParameterCategoryService
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave() {
        if (this.data.entidade.code.length > 0 
            && this.data.entidade.value.length > 0 
            && this.data.entidade.description.length > 0){
                         
            let indice = this.admParameterCategoryService.findIndexById(
                this.data.listaAdmParameterCategory, this.data.entidade.admParameterCategory.id);    
            
            this.data.entidade.admParameterCategory = this.data.listaAdmParameterCategory[indice];      

            this.dialogRef.close(this.data);
        }        
    }
}