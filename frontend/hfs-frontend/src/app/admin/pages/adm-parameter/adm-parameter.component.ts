import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AdmParameter } from '../../api/AdmParameter';
import { AdmParameterCategory } from '../../api/AdmParameterCategory';
import { ExportService } from 'src/app/base/services/export.service';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { AdmParameterCategoryService } from '../../service/AdmParameterCategoryService';
import { AdmParameterService } from '../../service/AdmParameterService';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';

@Component({
  templateUrl: './adm-parameter.component.html',
  providers: [MessageService, AdmParameterService, AdmParameterCategoryService]
})
export class AdmParameterComponent implements OnInit {

  admParameterDialog: boolean;

  listaAdmParameter: AdmParameter[];

  admParameter: AdmParameter;

  selectedAdmParameter: AdmParameter[];

  submitted: boolean;

  listaAdmParameterCategory: AdmParameterCategory[];

  cols: any[];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  deleteAdmParameterDialog: boolean = false;

  deleteAdmParametersDialog: boolean = false;

  itemsMenuLinha: MenuItem[];

  constructor(private messageService: MessageService,
    private admParameterService: AdmParameterService,
    private admParameterCategoryService: AdmParameterCategoryService,
    private exportService: ExportService) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };

      this.itemsMenuLinha = [{ label: "Editar" }, { label: "Excluir" }];
  }

  toggleMenu(menu: Menu, event: any, rowData: AdmParameter) {
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
    this.admParameterCategoryService
      .findAll()
      .then(data => this.listaAdmParameterCategory = data);

    this.admParameterService
      .findAll()
      .then(data => this.listaAdmParameter = data);

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'admParameterCategory.description', header: 'Categoria de parâmetro' },
      { field: 'code', header: 'Parâmetro' },
      { field: 'value', header: 'Valor' },
      { field: 'description', header: 'Descrição' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admParameterService.report(this.reportParamForm).then(() => {
      this.messageService.add({severity: 'info', summary: 'Parâmetro Exportado', detail: 'Parâmetro Exportado', life: 1000});
    });
  }

  onInsert() {
    this.admParameter = {};
    this.submitted = false;

    if (this.listaAdmParameterCategory.length > 0) {
      this.admParameter.admParameterCategory = this.listaAdmParameterCategory.at(0);
    }

    this.admParameterDialog = true;
  }

  onEdit(admParameter: AdmParameter) {
    this.admParameter = { ...admParameter };
    this.admParameterDialog = true;
  }

  hideDialog() {
    this.admParameterDialog = false;
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;

    if (this.admParameter.description.trim()) {
        if (this.admParameter.id) {
          this.admParameterService.update(this.admParameter).then((obj: AdmParameter) => {
            this.admParameter = obj;

            let indice = this.admParameterService.findIndexById(this.listaAdmParameter, this.admParameter.id);

            this.listaAdmParameter[indice] = this.admParameter;
            this.listaAdmParameter[indice].admParameterCategory = this.admParameter.admParameterCategory;

            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro Atualizado', life: 3000 });
          });
        } else {
          this.admParameterService.insert(this.admParameter).then((obj: AdmParameter) => {
            this.admParameter = obj;

            this.listaAdmParameter.push(this.admParameter);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro Criado', life: 3000 });
          });
        }

        this.listaAdmParameter = [...this.listaAdmParameter];
        this.admParameterDialog = false;
        this.admParameter = {};
    }
  }

  deleteSelected() {
    this.deleteAdmParametersDialog = true;
  }

  onDelete(admParameter: AdmParameter) {
    this.deleteAdmParameterDialog = true;
    this.admParameter = { ...admParameter };
  } 

  confirmDeleteSelected() {    
    this.deleteAdmParametersDialog = false;
    this.listaAdmParameter = this.listaAdmParameter.filter(val => !this.selectedAdmParameter.includes(val));

    let excluiu = false;
    this.selectedAdmParameter.forEach((item) => {
      this.admParameterService.delete(item.id).then(obj => {
        excluiu = true;
      });
    });

    if (excluiu) {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetros excluídos', life: 3000 });
      this.selectedAdmParameter = [];  
    }
  }

  confirmDelete() {
    this.deleteAdmParameterDialog = false;
    this.admParameterService.delete(this.admParameter.id).then(obj => {
      this.listaAdmParameter = this.listaAdmParameter.filter(val => val.id !== this.admParameter.id);
      this.admParameter = {};        
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro excluído', life: 3000 });
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportPdf() {
    const head: string[] = [];
    const data: any[] = [];

    this.exportColumns.forEach(item => head.push(item.title));
    this.listaAdmParameter.forEach(item => data.push(
      [item.id, item.admParameterCategory.description, item.code, item.value, item.description]
    ));

    this.exportService.exportPdf(head, data, 'Parametros.pdf');
  }

  exportExcel() {
    this.exportService.exportExcel(this.listaAdmParameter, 'Parâmetros');
  }

}
