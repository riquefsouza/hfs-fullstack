import { AfterViewInit, ViewChild, Component, OnInit, Inject } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmParameterCategoryService } from '../../service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../../api/AdmParameterCategory';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AdmParameterCategoryDialogDelete } from './dialogs/adm-parameter-category.dialog-delete';
import { AdmParameterCategoryDialogDetails } from './dialogs/adm-parameter-category.dialog-details';
import { AdmParameterCategoryDialogMultipleDelete } from './dialogs/adm-parameter-category.dialog-multiple-delete';

@Component({
  templateUrl: './adm-parameter-category.component.html',
  styleUrls: ["./adm-parameter-category.component.css"],
  providers: [AdmParameterCategoryService]
})
export class AdmParameterCategoryComponent implements OnInit, AfterViewInit {

  listaAdmParameterCategory: AdmParameterCategory[];

  admParameterCategory: AdmParameterCategory;

  cols: any[] = [];

  reportParamForm: ReportParamForm;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<AdmParameterCategory>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<AdmParameterCategory>;

  constructor(private admParameterCategoryService: AdmParameterCategoryService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };

    this.dataSource = new MatTableDataSource<AdmParameterCategory>();  

    const initialSelection = [];
    const allowMultiSelect = true;  
    this.selection = new SelectionModel<AdmParameterCategory>(allowMultiSelect, initialSelection);
  }
    
  ngOnInit(): void {
    this.cols = [
      { field: 'select', header: '' },
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Descrição' },
      { field: 'order', header: 'Ordem' },
      { field: 'actions', header: '' }
    ];

    this.displayedColumns = this.cols.map(col => col.field);

    this.admParameterCategoryService.findAll().then(data => {      
      this.listaAdmParameterCategory = data;
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
    this.admParameterCategoryService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Categoria de parâmetro exportada', 'info', { duration: 3000 });
    });
  }

  openDialogDetails(insert: boolean, param: AdmParameterCategory){
    const dialogRef = this.dialog.open(AdmParameterCategoryDialogDetails, { 
      data: { 
        lista: this.listaAdmParameterCategory, 
        entidade: param
      } 
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmParameterCategory = result.lista;
        this.admParameterCategory = result.entidade;
        this.onSave();
      }
    });
  }

  onInsert() {
    this.admParameterCategory = emptyAdmParameterCategory;
    this.openDialogDetails(true, emptyAdmParameterCategory);
  }

  onEdit(admParameterCategory: AdmParameterCategory) {
    this.admParameterCategory = { ...admParameterCategory };
    this.openDialogDetails(false, this.admParameterCategory);
  }

  onSave() {
    if (this.admParameterCategory.description.trim()) {
        if (this.admParameterCategory.id) {
          this.admParameterCategoryService.update(this.admParameterCategory).then((obj: AdmParameterCategory) => {
            this.admParameterCategory = obj;
            this.listaAdmParameterCategory[this.admParameterCategoryService
              .findIndexById(this.listaAdmParameterCategory, this.admParameterCategory.id)] = this.admParameterCategory;

            this.listaAdmParameterCategory = [...this.listaAdmParameterCategory];
            this.admParameterCategory = emptyAdmParameterCategory;
            this.dataSource.data = this.listaAdmParameterCategory;
      
            this.snackBar.open('Categoria de parâmetro Atualizada', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admParameterCategoryService.insert(this.admParameterCategory).then((obj: AdmParameterCategory) => {
            this.admParameterCategory = obj;
            this.listaAdmParameterCategory.push(this.admParameterCategory);

            this.listaAdmParameterCategory = [...this.listaAdmParameterCategory];
            this.admParameterCategory = emptyAdmParameterCategory;
            this.dataSource.data = this.listaAdmParameterCategory;
    
            this.snackBar.open('Categoria de parâmetro Criada', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(AdmParameterCategoryDialogMultipleDelete, { 
      data: { 
        lista: this.listaAdmParameterCategory, 
        selecao: this.selection.selected
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmParameterCategory = result.lista;
        this.confirmDeleteSelected();
      }
    });
  }

  onDelete(admParameterCategory: AdmParameterCategory) {
    const dialogRef = this.dialog.open(AdmParameterCategoryDialogDelete, { 
      data: { 
        lista: this.listaAdmParameterCategory, 
        entidade: admParameterCategory
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmParameterCategory = result.lista;
        this.admParameterCategory = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDeleteSelected() {
    this.listaAdmParameterCategory = this.listaAdmParameterCategory.filter(val => !this.selection.selected.includes(val));

    this.selection.selected.forEach(async (item: AdmParameterCategory, index: number) => {
      await this.admParameterCategoryService.delete(item.id);
      
      if (this.selection.selected.length == (index+1)){
        this.selection.clear();
        this.dataSource.data = this.listaAdmParameterCategory;
        this.snackBar.open('Categorias de parâmetro excluídos', 'Sucesso', { duration: 3000 });        
      }
    });

  }

  confirmDelete() {
    this.admParameterCategoryService.delete(this.admParameterCategory.id).then(obj => {
      this.listaAdmParameterCategory = this.listaAdmParameterCategory.filter(val => val.id !== this.admParameterCategory.id);
      this.admParameterCategory = emptyAdmParameterCategory;     
      this.dataSource.data = this.listaAdmParameterCategory;   
      this.snackBar.open('Categoria de parâmetro excluído', 'Sucesso', { duration: 3000 });
    });
  }  

}
