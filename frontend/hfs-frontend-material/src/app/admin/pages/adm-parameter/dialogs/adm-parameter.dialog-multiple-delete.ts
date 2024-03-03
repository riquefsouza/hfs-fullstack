import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmParameter } from "src/app/admin/api/AdmParameter";

@Component({
    selector: 'adm-parameter.dialog-multiple-delete',
    templateUrl: 'adm-parameter.dialog-multiple-delete.html'
})
export class AdmParameterDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<AdmParameterDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: AdmParameter[],
            selecao: AdmParameter[]
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}