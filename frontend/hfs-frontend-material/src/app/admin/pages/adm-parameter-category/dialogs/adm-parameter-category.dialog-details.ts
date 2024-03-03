import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";

@Component({
    selector: 'adm-parameter-category.dialog-details',
    styleUrls: ["./adm-parameter-category.dialog-details.css"],
    templateUrl: 'adm-parameter-category.dialog-details.html'
})
export class AdmParameterCategoryDialogDetails {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogDetails>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameterCategory[],
            entidade: AdmParameterCategory
        }
    ) { }

    onNoClick(): void {        
        this.dialogRef.close();
    }

    onSave() {
        if (this.data.entidade.description.length > 0){
            this.dialogRef.close(this.data);     
        }
    }
}