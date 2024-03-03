import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameter } from "src/app/admin/api/AdmParameter";

@Component({
    selector: 'adm-parameter.dialog-delete',
    templateUrl: 'adm-parameter.dialog-delete.html'
})
export class AdmParameterDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameter[],
            entidade: AdmParameter
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}