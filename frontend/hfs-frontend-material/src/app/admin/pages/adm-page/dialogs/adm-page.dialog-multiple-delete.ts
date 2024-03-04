import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmPage } from "src/app/admin/api/AdmPage";

@Component({
    selector: 'adm-page.dialog-multiple-delete',
    templateUrl: 'adm-page.dialog-multiple-delete.html'
})
export class AdmPageDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmPageDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmPage[],
            selecao: AdmPage[]
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}