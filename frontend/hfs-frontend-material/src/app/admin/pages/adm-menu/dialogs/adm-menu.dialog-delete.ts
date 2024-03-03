import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmMenu } from "src/app/admin/api/AdmMenu";

@Component({
    selector: 'adm-menu.dialog-delete',
    templateUrl: 'adm-menu.dialog-delete.html'
})
export class AdmMenuDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmMenuDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmMenu[],
            entidade: AdmMenu
        },
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}