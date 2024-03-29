import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";

@Component({
    selector: 'adm-parameter-category.dialog-delete',
    templateUrl: 'adm-parameter-category.dialog-delete.html'
})
export class AdmParameterCategoryDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            entidade: AdmParameterCategory
        },
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}