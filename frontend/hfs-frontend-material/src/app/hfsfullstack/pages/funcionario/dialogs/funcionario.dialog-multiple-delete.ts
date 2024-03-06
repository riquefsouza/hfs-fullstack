import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Funcionario } from "src/app/hfsfullstack/api/funcionario";

@Component({
    selector: 'funcionario.dialog-multiple-delete',
    templateUrl: 'funcionario.dialog-multiple-delete.html'
})
export class FuncionarioDialogMultipleDelete {
    constructor(
        public dialogRef: MatDialogRef<FuncionarioDialogMultipleDelete>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lista: Funcionario[],
            selecao: Funcionario[]
        }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDeleteSelected() {
        this.dialogRef.close(this.data);
    }

}