import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { ExportService } from 'src/app/base/services/export.service';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmPageService } from '../../service/AdmPageService';
import { AdmPage, cleanAdmPage } from '../../api/AdmPage';
import { AdmProfile } from '../../api/AdmProfile';
import { AdmProfileService } from '../../service/AdmProfileService';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './adm-page.component.html',
  providers: [MessageService, AdmPageService]
})
export class AdmPageComponent implements OnInit {

  admPageDialog: boolean;

  listaAdmPage: AdmPage[] = [];

  admPage: AdmPage = {};

  selectedAdmPage: AdmPage[] = [];

  submitted: boolean;

  cols: any[];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  deleteAdmPageDialog: boolean = false;

  deleteAdmPagesDialog: boolean = false;

  itemsMenuLinha: MenuItem[];  

  sourceProfiles: AdmProfile[];
  targetProfiles: AdmProfile[];

  constructor(private messageService: MessageService,
    private admPageService: AdmPageService,
    private admProfileService: AdmProfileService,
    private exportService: ExportService) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };

      this.itemsMenuLinha = [{ label: "Editar" }, { label: "Excluir" }];
  }

  toggleMenu(menu: Menu, event: any, rowData: AdmPage) {
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
    this.admPageService
      .findAll()
      .then(data => this.listaAdmPage = data);

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'url', header: 'Página' },
      { field: 'description', header: 'Descrição' },
      { field: 'pageProfiles', header: 'Perfil(s) da página' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

  }

  private loadAdmProfiles(admPage: AdmPage): void {
    this.targetProfiles = [];

    if (admPage == null) {

      this.admProfileService.findAll().then(profiles => {
        this.sourceProfiles = profiles;
      });

    } else {      
      
      if (this.admPage.id != null) {
        this.admProfileService.findProfilesByPage(admPage).then(data => {
          this.targetProfiles = data;
  
          this.admProfileService.findAll().then(profiles => {
            this.sourceProfiles = profiles.filter(profile => 
              !this.targetProfiles.find(target => target.id === profile.id)
            );
          });
  
        });
      }

    }
  }

  mostrarListar() {
    if (this.admPageDialog)
        return {display:'none'};
    else
        return {display:''};
  }

  mostrarEditar() {
      if (this.admPageDialog)
          return {display:''};
      else
          return {display:'none'};
  }

  onClean() {
    this.admPage = cleanAdmPage;
    this.loadAdmProfiles(null);
  }

  onSave() {
    this.submitted = true;
    this.admPage.admIdProfiles = [];
    this.targetProfiles.forEach(item => {
      this.admPage.admIdProfiles.push(item.id)
    });

    if (this.admPage.description.trim()) {
        if (this.admPage.id) {
          this.admPageService.update(this.admPage).then((obj: AdmPage) => {
            this.admPage = obj;

            this.listaAdmPage[
              this.admPageService.findIndexById(this.listaAdmPage, this.admPage.id)] = this.admPage;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Página Atualizada', life: 3000 });
          });
        } else {
          this.admPageService.insert(this.admPage).then((obj: AdmPage) => {
            this.admPage = obj;

            this.listaAdmPage.push(this.admPage);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Página Criada', life: 3000 });
          });
        }

        this.listaAdmPage = [...this.listaAdmPage];
        this.admPageDialog = false;
        this.admPage = {};
    }
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admPageService.report(this.reportParamForm).then(() => {
      this.messageService.add({severity: 'info', summary: 'Página Exportada', detail: 'Página Exportada', life: 1000});
    });
  }

  onInsert() {
    this.admPage = {};
    this.submitted = false;
    this.admPageDialog = true;
    this.loadAdmProfiles(null);
  }

  onEdit(admPage: AdmPage) {
    this.admPage = { ...admPage };
    this.admPageDialog = true;
    this.loadAdmProfiles(admPage);
  }

  hideDialog() {
    this.admPageDialog = false;
    this.submitted = false;
  }

  deleteSelected() {
    this.deleteAdmPagesDialog = true;
  }

  onDelete(admPage: AdmPage) {
    this.deleteAdmPageDialog = true;
    this.admPage = { ...admPage };
  } 

  confirmDeleteSelected() {    
    this.deleteAdmPagesDialog = false;
    this.listaAdmPage = this.listaAdmPage.filter(val => !this.selectedAdmPage.includes(val));

    let excluiu = false;
    this.selectedAdmPage.forEach((item) => {
      this.admPageService.delete(item.id).then(obj => {
        excluiu = true;
      });
    });

    if (excluiu) {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Páginas excluídas', life: 3000 });
      this.selectedAdmPage = [];  
    }
  }

  confirmDelete() {
    this.deleteAdmPageDialog = false;
    this.admPageService.delete(this.admPage.id).then(obj => {
      this.listaAdmPage = this.listaAdmPage.filter(val => val.id !== this.admPage.id);
      this.admPage = {};        
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Página excluída', life: 3000 });
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  exportPdf() {
    const head: string[] = [];
    const data: any[] = [];

    this.exportColumns.forEach(item => head.push(item.title));
    this.listaAdmPage.forEach(item => data.push(
      [item.id, item.url, item.description, item.pageProfiles]
    ));

    this.exportService.exportPdf(head, data, 'paginas.pdf');
  }

  exportExcel() {
    this.exportService.exportExcel(this.listaAdmPage, 'paginas');
  }

}
