import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";
import { AdmParameterCategoryService } from "src/app/admin/service/AdmParameterCategoryService";

@Component({
    selector: 'adm-parameter-category.dialog-multiple-delete',
    templateUrl: 'adm-parameter-category.dialog-multiple-delete.html',
    providers: [AdmParameterCategoryService]
})
export class AdmParameterCategoryDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameterCategory[],
            selecao: AdmParameterCategory[]
        },
        private admParameterCategoryService: AdmParameterCategoryService
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}