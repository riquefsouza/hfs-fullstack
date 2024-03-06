import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Funcionario } from "src/app/hfsfullstack/api/funcionario";

@Component({
    selector: 'funcionario.dialog-delete',
    templateUrl: 'funcionario.dialog-delete.html'
})
export class FuncionarioDialogDelete {
    constructor(
        public dialogRef: MatDialogRef<FuncionarioDialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            entidade: Funcionario
        },
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete() {
        this.dialogRef.close(this.data);
    }

}