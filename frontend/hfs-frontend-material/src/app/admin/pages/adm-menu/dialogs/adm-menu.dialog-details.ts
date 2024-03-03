import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdmMenu } from "src/app/admin/api/AdmMenu";
import { AdmPage } from "src/app/admin/api/AdmPage";
import { AdmMenuService } from "src/app/admin/service/AdmMenuService";
import { AdmPageService } from "src/app/admin/service/AdmPageService";

@Component({
    selector: 'adm-menu.dialog-details',
    styleUrls: ["./adm-menu.dialog-details.css"],
    templateUrl: 'adm-menu.dialog-details.html',
    providers: [AdmMenuService, AdmPageService]
})
export class AdmMenuDialogDetails {
    constructor(
        public dialogRef: MatDialogRef<AdmMenuDialogDetails>,
        @Inject(MAT_DIALOG_DATA) public data: {
            listaAdmPage: AdmPage[],
            listaAdmMenuParent: AdmMenu[],
            entidade: AdmMenu
        },
        private admPageService: AdmPageService,
        private admMenuService: AdmMenuService,
    ) { }

    onNoClick(): void {        
        this.dialogRef.close();
    }

    onSave() {
        if (this.data.entidade.order > 0 
            && this.data.entidade.description.length > 0){
                        
            if (this.data.entidade.admPage) {
                let indice = this.admPageService.findIndexById(
                    this.data.listaAdmPage, this.data.entidade.admPage.id);
                this.data.entidade.admPage = this.data.listaAdmPage[indice];       
            }

            if (this.data.entidade.admMenuParent) {
                let indice = this.admMenuService.findIndexById(
                    this.data.listaAdmMenuParent, this.data.entidade.admMenuParent.id);
                this.data.entidade.admMenuParent = this.data.listaAdmMenuParent[indice];    
            }

            this.dialogRef.close(this.data);
        }        
    }
}