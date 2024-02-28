import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameterCategory } from "src/app/admin/api/AdmParameterCategory";
import { AdmParameterCategoryService } from "src/app/admin/service/AdmParameterCategoryService";

@Component({
    selector: 'adm-parameter-category.dialog-delete',
    templateUrl: 'adm-parameter-category.dialog-delete.html',
    providers: [AdmParameterCategoryService]
})
export class AdmParameterCategoryDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterCategoryDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameterCategory[],
            entidade: AdmParameterCategory
        },
        private admParameterCategoryService: AdmParameterCategoryService,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}