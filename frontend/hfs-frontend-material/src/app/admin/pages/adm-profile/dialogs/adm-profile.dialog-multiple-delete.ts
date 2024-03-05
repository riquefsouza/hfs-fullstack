import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmProfile } from "src/app/admin/api/AdmProfile";

@Component({
    selector: 'adm-profile.dialog-multiple-delete',
    templateUrl: 'adm-profile.dialog-multiple-delete.html'
})
export class AdmProfileDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmProfileDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmProfile[],
            selecao: AdmProfile[]
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}