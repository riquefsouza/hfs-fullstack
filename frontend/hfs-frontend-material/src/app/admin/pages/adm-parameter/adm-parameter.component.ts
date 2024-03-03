import { AfterViewInit, ViewChild, Component, OnInit, Inject } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmParameterService } from '../../service/AdmParameterService';
import { AdmParameter, emptyAdmParameter } from '../../api/AdmParameter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AdmParameterDialogDelete } from './dialogs/adm-parameter.dialog-delete';
import { AdmParameterDialogDetails } from './dialogs/adm-parameter.dialog-details';
import { AdmParameterDialogMultipleDelete } from './dialogs/adm-parameter.dialog-multiple-delete';
import { AdmParameterCategoryService } from '../../service/AdmParameterCategoryService';
import { AdmParameterCategory } from '../../api/AdmParameterCategory';
import { ExportService } from 'src/app/base/services/export.service';

@Component({
  templateUrl: './adm-parameter.component.html',
  styleUrls: ["./adm-parameter.component.css"],
  providers: [AdmParameterService, AdmParameterCategoryService]
})
export class AdmParameterComponent implements OnInit, AfterViewInit {

  listaAdmParameter: AdmParameter[];

  admParameter: AdmParameter;

  listaAdmParameterCategory: AdmParameterCategory[];
  
  cols: any[] = [];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<AdmParameter>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<AdmParameter>;

  constructor(private admParameterService: AdmParameterService,
    private admParameterCategoryService: AdmParameterCategoryService,
    private exportService: ExportService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
    };

    this.dataSource = new MatTableDataSource<AdmParameter>();  

    const initialSelection = [];
    const allowMultiSelect = true;  
    this.selection = new SelectionModel<AdmParameter>(allowMultiSelect, initialSelection);
  }
    
  ngOnInit(): void {
    this.cols = [
      { field: 'select', header: '' },
      { field: 'id', header: 'Id' },
      { field: 'admParameterCategory.description', header: 'Categoria de parâmetro' },
      { field: 'code', header: 'Parâmetro' },
      { field: 'value', header: 'Valor' },
      { field: 'description', header: 'Descrição' },
      { field: 'actions', header: '' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

    this.displayedColumns = this.cols.map(col => col.field);

    this.admParameterCategoryService
    .findAll()
    .then(data => this.listaAdmParameterCategory = data);

    this.admParameterService.findAll().then(data => {      
      this.listaAdmParameter = data;
      this.dataSource.data = data;
    });
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admParameterService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Parâmetro exportado', 'info', { duration: 3000 });
    });
  }

  openDialogDetails(param: AdmParameter){
    const dialogRef = this.dialog.open(AdmParameterDialogDetails, { 
      data: { 
        listaAdmParameterCategory: this.listaAdmParameterCategory,
        entidade: param
      } 
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.admParameter = result.entidade; 
        this.onSave(this.admParameter.admParameterCategory);
      }
    });
  }

  onInsert() {
    this.admParameter = emptyAdmParameter;

    if (this.listaAdmParameterCategory.length > 0) {
      this.admParameter.admParameterCategory = this.listaAdmParameterCategory.at(0);
    }

    this.openDialogDetails(emptyAdmParameter);
  }

  toggleMenu(rowData: AdmParameter) {
    this.admParameter = { ...rowData };
  }

  onEdit() {
    //this.admParameter = { ...admParameter };
    this.openDialogDetails(this.admParameter);
  }

  onSave(param: AdmParameterCategory) {
    if (this.admParameter.description.trim().length > 0) {
        if (this.admParameter.id) {
          this.admParameterService.update(this.admParameter).then((obj: AdmParameter) => {
            this.admParameter = obj;

            let indice = this.admParameterService.findIndexById(this.listaAdmParameter, this.admParameter.id);

            this.listaAdmParameter[indice] = this.admParameter;
            this.listaAdmParameter[indice].admParameterCategory = param; //this.admParameter.admParameterCategory;

            this.listaAdmParameter = [...this.listaAdmParameter];
            this.admParameter = emptyAdmParameter;
            this.dataSource.data = this.listaAdmParameter;
      
            this.snackBar.open('Parâmetro Atualizado', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admParameterService.insert(this.admParameter).then((obj: AdmParameter) => {
            this.admParameter = obj;
            this.listaAdmParameter.push(this.admParameter);

            this.listaAdmParameter = [...this.listaAdmParameter];
            this.admParameter = emptyAdmParameter;
            this.dataSource.data = this.listaAdmParameter;
    
            this.snackBar.open('Parâmetro Criado', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(AdmParameterDialogMultipleDelete, { 
      data: { 
        lista: this.listaAdmParameter, 
        selecao: this.selection.selected
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmParameter = result.lista;
        this.confirmDeleteSelected();
      }
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(AdmParameterDialogDelete, { 
      data: { 
        lista: this.listaAdmParameter, 
        entidade: this.admParameter
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmParameter = result.lista;
        this.admParameter = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDeleteSelected() {
    this.listaAdmParameter = this.listaAdmParameter.filter(val => !this.selection.selected.includes(val));

    this.selection.selected.forEach(async (item: AdmParameter, index: number) => {
      await this.admParameterService.delete(item.id);
      
      if (this.selection.selected.length == (index+1)){
        this.selection.clear();
        this.dataSource.data = this.listaAdmParameter;
        this.snackBar.open('Parâmetros excluídos', 'Sucesso', { duration: 3000 });        
      }
    });

  }

  confirmDelete() {
    this.admParameterService.delete(this.admParameter.id).then(obj => {
      this.listaAdmParameter = this.listaAdmParameter.filter(val => val.id !== this.admParameter.id);
      this.admParameter = emptyAdmParameter;     
      this.dataSource.data = this.listaAdmParameter;   
      this.snackBar.open('Parâmetro excluído', 'Sucesso', { duration: 3000 });
    });
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
