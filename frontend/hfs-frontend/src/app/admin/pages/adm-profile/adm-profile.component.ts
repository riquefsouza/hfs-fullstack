import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { ExportService } from 'src/app/base/services/export.service';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmProfileService } from '../../service/AdmProfileService';
import { AdmProfile, cleanAdmProfile } from '../../api/AdmProfile';
import { AdmPage } from '../../api/AdmPage';
import { AdmPageService } from '../../service/AdmPageService';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './adm-profile.component.html',
  providers: [MessageService, AdmProfileService]
})
export class AdmProfileComponent implements OnInit {

  admProfileDialog: boolean;

  listaAdmProfile: AdmProfile[] = [];

  admProfile: AdmProfile = {};

  selectedAdmProfile: AdmProfile[] = [];

  submitted: boolean;

  cols: any[];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  deleteAdmProfileDialog: boolean = false;

  deleteAdmProfilesDialog: boolean = false;

  itemsMenuLinha: MenuItem[];

  sourcePages: AdmPage[];
  targetPages: AdmPage[];

  constructor(private messageService: MessageService,
    private admProfileService: AdmProfileService,
    private admPageService: AdmPageService,
    private exportService: ExportService) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };

      this.itemsMenuLinha = [{ label: "Editar" }, { label: "Excluir" }];
  }

  toggleMenu(menu: Menu, event: any, rowData: AdmProfile) {
    this.itemsMenuLinha = [];

    this.itemsMenuLinha.push({
      label: 'Editar',
      command: (event: any) => {
        this.onEdit(rowData);
      }
    });

    this.itemsMenuLinha.push({
      label: 'Excluir',
      command: (event: any) => {
        this.onDelete(rowData);
      }
    });

    menu.toggle(event);
  }

  ngOnInit(): void {
    this.admProfileService
      .findAll()
      .then(data => this.listaAdmProfile = data);

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Descrição' },
      { field: 'profilePages', header: 'Páginas(s) do perfil' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  private loadAdmPages(): void {
    this.targetPages = [];
    if (this.admProfile.id != null) {
      // this.admPageService.findPagesByProfile(this.admProfile).then(data => this.targetPages = data);
      this.targetPages = [...this.admProfile.admPages];
    }
    this.admPageService.findAll().then(pages => {
      this.sourcePages = pages.filter(pager => !this.targetPages.find(target => target.id === pager.id));
    });
  }

  mostrarListar() {
    if (this.admProfileDialog)
        return {display:'none'};
    else
        return {display:''};
  }

  mostrarEditar() {
      if (this.admProfileDialog)
          return {display:''};
      else
          return {display:'none'};
  }

  onClean() {
    this.admProfile = cleanAdmProfile;
    this.loadAdmPages();
  }

  onSave() {
    this.submitted = true;
    this.admProfile.admPages = [];
    this.targetPages.forEach(item => {
      this.admProfile.admPages.push(item)
    });

    if (this.admProfile.description.trim()) {
        if (this.admProfile.id) {
          this.admProfileService.update(this.admProfile).then((obj: AdmProfile) => {
            this.admProfile = obj;

            this.listaAdmProfile[
              this.admProfileService.findIndexById(this.listaAdmProfile, this.admProfile.id)] = this.admProfile;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Atualizado', life: 3000 });
          });
        } else {
          this.admProfileService.insert(this.admProfile).then((obj: AdmProfile) => {
            this.admProfile = obj;

            this.listaAdmProfile.push(this.admProfile);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Criado', life: 3000 });
          });
        }

        this.listaAdmProfile = [...this.listaAdmProfile];
        this.admProfileDialog = false;
        this.admProfile = {};
    }
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admProfileService.report(this.reportParamForm).then(() => {
      this.messageService.add({severity: 'info', summary: 'Perfil Exportado', detail: 'Perfil Exportado', life: 1000});
    });
  }

  onInsert() {
    this.admProfile = {};
    this.submitted = false;
    this.admProfileDialog = true;
    this.loadAdmPages();
  }

  onEdit(admProfile: AdmProfile) {
    this.admProfile = { ...admProfile };
    this.admProfileDialog = true;
    this.loadAdmPages();
  }

  hideDialog() {
    this.admProfileDialog = false;
    this.submitted = false;
  }

  deleteSelected() {
    this.deleteAdmProfilesDialog = true;
  }

  onDelete(admProfile: AdmProfile) {
    this.deleteAdmProfileDialog = true;
    this.admProfile = { ...admProfile };
  }

  confirmDeleteSelected() {    
    this.deleteAdmProfilesDialog = false;
    this.listaAdmProfile = this.listaAdmProfile.filter(val => !this.selectedAdmProfile.includes(val));

    let excluiu = false;
    this.selectedAdmProfile.forEach((item) => {
      this.admProfileService.delete(item.id).then(obj => {
        excluiu = true;
      });
    });

    if (excluiu) {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil(s) excluídos', life: 3000 });
      this.selectedAdmProfile = [];  
    }
  }

  confirmDelete() {
    this.deleteAdmProfileDialog = false;
    this.admProfileService.delete(this.admProfile.id).then(obj => {
      this.listaAdmProfile = this.listaAdmProfile.filter(val => val.id !== this.admProfile.id);
      this.admProfile = {};
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Excluído', life: 3000 });
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportPdf() {
    const head: string[] = [];
    const data: any[] = [];

    this.exportColumns.forEach(item => head.push(item.title));
    this.listaAdmProfile.forEach(item => data.push(
      [item.id, item.description, item.profilePages]
    ));

    this.exportService.exportPdf(head, data, 'perfis.pdf');
  }

  exportExcel() {
    this.exportService.exportExcel(this.listaAdmProfile, 'perfis');
  }

}
