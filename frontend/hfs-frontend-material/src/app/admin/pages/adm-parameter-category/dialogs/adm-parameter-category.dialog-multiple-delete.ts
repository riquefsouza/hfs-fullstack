import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";

@Component({
    selector: 'adm-parameter-category.dialog-multiple-delete',
    templateUrl: 'adm-parameter-category.dialog-multiple-delete.html'
})
export class AdmParameterCategoryDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameterCategory[],
            selecao: AdmParameterCategory[]
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}