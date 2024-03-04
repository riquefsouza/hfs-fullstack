import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmPage } from "src/app/admin/api/AdmPage";

@Component({
    selector: 'adm-page.dialog-delete',
    templateUrl: 'adm-page.dialog-delete.html'
})
export class AdmPageDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmPageDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmPage[],
            entidade: AdmPage
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}