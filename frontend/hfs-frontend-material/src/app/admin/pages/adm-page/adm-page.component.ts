import { AfterViewInit, ViewChild, Component, OnInit, Inject } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmPageService } from '../../service/AdmPageService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '../../api/AdmPage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AdmPageDialogDelete } from './dialogs/adm-page.dialog-delete';
import { AdmPageDialogMultipleDelete } from './dialogs/adm-page.dialog-multiple-delete';
import { ExportService } from 'src/app/base/services/export.service';
import { AdmProfile } from '../../api/AdmProfile';
import { AdmProfileService } from '../../service/AdmProfileService';

@Component({
  templateUrl: './adm-page.component.html',
  styleUrls: ["./adm-page.component.css"],
  providers: [AdmPageService, AdmProfileService]
})
export class AdmPageComponent implements OnInit, AfterViewInit {

  admPageDialog: boolean = false;
  
  listaAdmPage: AdmPage[] = [];

  admPage: AdmPage = emptyAdmPage;
  
  cols: any[] = [];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<AdmPage>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<AdmPage>;

  sourceProfiles: AdmProfile[];
  targetProfiles: AdmProfile[];

  constructor(private admPageService: AdmPageService,
    private admProfileService: AdmProfileService,
    private exportService: ExportService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
    };

    this.dataSource = new MatTableDataSource<AdmPage>();  

    const initialSelection = [];
    const allowMultiSelect = true;  
    this.selection = new SelectionModel<AdmPage>(allowMultiSelect, initialSelection);
  }
    
  ngOnInit(): void {

    this.cols = [
      { field: 'select', header: '' },
      { field: 'id', header: 'Id' },
      { field: 'url', header: 'Página' },
      { field: 'description', header: 'Descrição' },
      { field: 'pageProfiles', header: 'Perfil(s) da página' },
      { field: 'actions', header: '' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

    this.displayedColumns = this.cols.map(col => col.field);

    this.admPageService.findAll().then(data => {      
      this.listaAdmPage = data;
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

  hideDialog() {
    this.admPageDialog = false;
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admPageService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Página exportada', 'info', { duration: 3000 });
    });
  }

  onInsert() {
    this.admPage = emptyAdmPage;
    this.admPageDialog = true;
    this.loadAdmProfiles(null);
  }

  toggleMenu(rowData: AdmPage) {
    this.admPage = { ...rowData };
  }

  onEdit() {
    //this.admPage = { ...admPage };
    this.admPageDialog = true;
    this.loadAdmProfiles(this.admPage);
  }

  onSave() {
    this.admPage.admIdProfiles = [];
    this.targetProfiles.forEach(item => {
      this.admPage.admIdProfiles.push(item.id)
    });

    if (this.admPage.description.trim().length > 0) {
        if (this.admPage.id) {
          this.admPageService.update(this.admPage).then((obj: AdmPage) => {
            this.admPage = obj;

            let indice = this.admPageService.findIndexById(this.listaAdmPage, this.admPage.id);

            this.listaAdmPage[indice] = this.admPage;

            this.listaAdmPage = [...this.listaAdmPage];
            this.admPage = emptyAdmPage;
            this.dataSource.data = this.listaAdmPage;
      
            this.snackBar.open('Página Atualizada', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admPageService.insert(this.admPage).then((obj: AdmPage) => {
            this.admPage = obj;
            this.listaAdmPage.push(this.admPage);

            this.listaAdmPage = [...this.listaAdmPage];
            this.admPage = emptyAdmPage;
            this.dataSource.data = this.listaAdmPage;
    
            this.snackBar.open('Página Criada', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(AdmPageDialogMultipleDelete, { 
      data: { 
        lista: this.listaAdmPage, 
        selecao: this.selection.selected
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmPage = result.lista;
        this.confirmDeleteSelected();
      }
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(AdmPageDialogDelete, { 
      data: { 
        lista: this.listaAdmPage, 
        entidade: this.admPage
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmPage = result.lista;
        this.admPage = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDeleteSelected() {
    this.listaAdmPage = this.listaAdmPage.filter(val => !this.selection.selected.includes(val));

    this.selection.selected.forEach(async (item: AdmPage, index: number) => {
      await this.admPageService.delete(item.id);
      
      if (this.selection.selected.length == (index+1)){
        this.selection.clear();
        this.dataSource.data = this.listaAdmPage;
        this.snackBar.open('Páginas excluídas', 'Sucesso', { duration: 3000 });        
      }
    });

  }

  confirmDelete() {
    this.admPageService.delete(this.admPage.id).then(obj => {
      this.listaAdmPage = this.listaAdmPage.filter(val => val.id !== this.admPage.id);
      this.admPage = emptyAdmPage;     
      this.dataSource.data = this.listaAdmPage;   
      this.snackBar.open('Página excluída', 'Sucesso', { duration: 3000 });
    });
  }  

  exportPdf() {
    const head: string[] = [];
    const data: any[] = [];

    this.exportColumns.forEach(item => head.push(item.title));
    this.listaAdmPage.forEach(item => data.push(
      [item.id, item.url, item.description, item.pageProfiles]
    ));

    this.exportService.exportPdf(head, data, 'Paginas.pdf');
  }

  exportExcel() {
    this.exportService.exportExcel(this.listaAdmPage, 'Páginas');
  }

}
