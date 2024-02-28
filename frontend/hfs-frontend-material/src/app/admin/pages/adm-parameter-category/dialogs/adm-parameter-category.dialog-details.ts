import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";
import { AdmParameterCategoryService } from "src/app/admin/service/AdmParameterCategoryService";

@Component({
    selector: 'adm-parameter-category.dialog-details',
    templateUrl: 'adm-parameter-category.dialog-details.html',
    providers: [AdmParameterCategoryService]
})
export class AdmParameterCategoryDialogDetails {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogDetails>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameterCategory[],
            entidade: AdmParameterCategory
        },
        private admParameterCategoryService: AdmParameterCategoryService,
        private snackBar: MatSnackBar
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave() {
        this.dialogRef.close(this.data);
    }
}