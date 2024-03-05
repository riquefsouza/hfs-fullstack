import { AfterViewInit, ViewChild, Component, OnInit, Inject } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmProfileService } from '../../service/AdmProfileService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '../../api/AdmProfile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AdmProfileDialogDelete } from './dialogs/adm-profile.dialog-delete';
import { AdmProfileDialogMultipleDelete } from './dialogs/adm-profile.dialog-multiple-delete';
import { ExportService } from 'src/app/base/services/export.service';
import { AdmPage } from '../../api/AdmPage';
import { AdmPageService } from '../../service/AdmPageService';

@Component({
  templateUrl: './adm-profile.component.html',
  styleUrls: ["./adm-profile.component.css"],
  providers: [AdmProfileService, AdmPageService]
})
export class AdmProfileComponent implements OnInit, AfterViewInit {

  admProfileDialog: boolean = false;
  
  listaAdmProfile: AdmProfile[] = [];

  admProfile: AdmProfile = emptyAdmProfile;
  
  cols: any[] = [];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<AdmProfile>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<AdmProfile>;

  sourcePages: AdmPage[];
  targetPages: AdmPage[];

  constructor(private admProfileService: AdmProfileService,
    private admPageService: AdmPageService,
    private exportService: ExportService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
    };

    this.dataSource = new MatTableDataSource<AdmProfile>();  

    const initialSelection = [];
    const allowMultiSelect = true;  
    this.selection = new SelectionModel<AdmProfile>(allowMultiSelect, initialSelection);
  }
    
  ngOnInit(): void {

    this.cols = [
      { field: 'select', header: '' },
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Descrição' },
      { field: 'profilePages', header: 'Páginas(s) do perfil' },
      { field: 'actions', header: '' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

    this.displayedColumns = this.cols.map(col => col.field);

    this.admProfileService.findAll().then(data => {      
      this.listaAdmProfile = data;
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

  hideDialog() {
    this.admProfileDialog = false;
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admProfileService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Página exportada', 'info', { duration: 3000 });
    });
  }

  onInsert() {
    this.admProfile = emptyAdmProfile;
    this.admProfileDialog = true;
    this.loadAdmPages();
  }

  toggleMenu(rowData: AdmProfile) {
    this.admProfile = { ...rowData };
  }

  onEdit() {
    //this.admProfile = { ...admProfile };
    this.admProfileDialog = true;
    this.loadAdmPages();
  }

  onSave() {
    this.admProfile.admPages = [];
    this.targetPages.forEach(item => {
      this.admProfile.admPages.push(item)
    });

    if (this.admProfile.description.trim().length > 0) {
        if (this.admProfile.id) {
          this.admProfileService.update(this.admProfile).then((obj: AdmProfile) => {
            this.admProfile = obj;

            let indice = this.admProfileService.findIndexById(this.listaAdmProfile, this.admProfile.id);

            this.listaAdmProfile[indice] = this.admProfile;

            this.listaAdmProfile = [...this.listaAdmProfile];
            this.admProfile = emptyAdmProfile;
            this.dataSource.data = this.listaAdmProfile;
      
            this.snackBar.open('Página Atualizada', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admProfileService.insert(this.admProfile).then((obj: AdmProfile) => {
            this.admProfile = obj;
            this.listaAdmProfile.push(this.admProfile);

            this.listaAdmProfile = [...this.listaAdmProfile];
            this.admProfile = emptyAdmProfile;
            this.dataSource.data = this.listaAdmProfile;
    
            this.snackBar.open('Página Criada', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(AdmProfileDialogMultipleDelete, { 
      data: { 
        lista: this.listaAdmProfile, 
        selecao: this.selection.selected
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmProfile = result.lista;
        this.confirmDeleteSelected();
      }
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(AdmProfileDialogDelete, { 
      data: { 
        lista: this.listaAdmProfile, 
        entidade: this.admProfile
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmProfile = result.lista;
        this.admProfile = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDeleteSelected() {
    this.listaAdmProfile = this.listaAdmProfile.filter(val => !this.selection.selected.includes(val));

    this.selection.selected.forEach(async (item: AdmProfile, index: number) => {
      await this.admProfileService.delete(item.id);
      
      if (this.selection.selected.length == (index+1)){
        this.selection.clear();
        this.dataSource.data = this.listaAdmProfile;
        this.snackBar.open('Páginas excluídas', 'Sucesso', { duration: 3000 });        
      }
    });

  }

  confirmDelete() {
    this.admProfileService.delete(this.admProfile.id).then(obj => {
      this.listaAdmProfile = this.listaAdmProfile.filter(val => val.id !== this.admProfile.id);
      this.admProfile = emptyAdmProfile;     
      this.dataSource.data = this.listaAdmProfile;   
      this.snackBar.open('Página excluída', 'Sucesso', { duration: 3000 });
    });
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
