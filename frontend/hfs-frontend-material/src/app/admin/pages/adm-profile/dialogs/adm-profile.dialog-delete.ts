import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmProfile } from "src/app/admin/api/AdmProfile";

@Component({
    selector: 'adm-profile.dialog-delete',
    templateUrl: 'adm-profile.dialog-delete.html'
})
export class AdmProfileDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmProfileDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmProfile[],
            entidade: AdmProfile
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}