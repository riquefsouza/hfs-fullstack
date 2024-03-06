import { AfterViewInit, ViewChild, Component, OnInit, Inject, ElementRef } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { FuncionarioDialogDelete } from './dialogs/funcionario.dialog-delete';
import { FuncionarioDialogMultipleDelete } from './dialogs/funcionario.dialog-multiple-delete';
import { Funcionario, cleanFuncionario, emptyFuncionario } from '../../api/funcionario';
import { FuncionarioService } from '../../service/funcionario.service';
import { ExportService } from 'src/app/base/services/export.service';
import { BaseUtilService } from 'src/app/base/util/base-util.service';
import { DataTableFilterMeta, LazyTableParam, emptyLazyTableParam } from 'src/app/base/models/LazyTableParam';
import { PaginationDTO } from 'src/app/base/models/PaginationDTO';
import { FuncionarioDataSource } from './funcionario.data-source';
import { debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';

@Component({
  templateUrl: './funcionario.component.html',
  styleUrls: ["./funcionario.component.css"],
  providers: [FuncionarioService, BaseUtilService]
})
export class FuncionarioComponent implements OnInit, AfterViewInit {

  funcionarioDialog: boolean = false;

  listaFuncionario: Funcionario[];

  funcionario: Funcionario = emptyFuncionario;

  submitted: boolean = false;

  cols: any[] = [];

  exportColumns: any[];

  reportParamForm: ReportParamForm;

  displayedColumns: string[] = [];
  dataSource: FuncionarioDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<Funcionario>;

  totalRecords: number = 0;
  loading: boolean = false;
  @ViewChild('input') inputPesquisa: ElementRef;
  valorInputPesquisa = '';

  constructor(private funcionarioService: FuncionarioService,
    private exportService: ExportService,
    private baseUtilService: BaseUtilService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };

    const initialSelection = [];
    const allowMultiSelect = true;  
    this.selection = new SelectionModel<Funcionario>(allowMultiSelect, initialSelection);
  }
    
  ngOnInit(): void {
    this.cols = [
      { field: 'select', header: '' },
      { field: 'actions', header: '' },
      { field: 'id', header: 'Código' },
      { field: 'nome', header: 'Nome' },
      { field: 'cpfFormatado', header: 'Cpf' },
      { field: 'email', header: 'Email' },
      { field: 'telefone', header: 'Telefone' },
      { field: 'celular', header: 'Celular' },
      { field: 'setor', header: 'Setor' },
      { field: 'codCargo', header: 'CodCargo' },
      { field: 'cargo', header: 'Cargo' },
      { field: 'dataAdmissaoFormatada', header: 'Data Admissão' },
      { field: 'dataSaidaFormatada', header: 'Data Saída' },
      { field: 'ativo', header: 'Ativo' }      
    ];

    this.displayedColumns = this.cols.map(col => col.field);
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));        
    
    this.dataSource = new FuncionarioDataSource(this.funcionarioService);
    this.dataSource.loadFuncionarios().then((dto: PaginationDTO) => {
      this.listaFuncionario = dto.content;
      this.totalRecords = dto.totalElements;
    });
  }
        
  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.inputPesquisa.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;
                this.loadFuncionarioPage();
            })
        )
        .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadFuncionarioPage())
        )
        .subscribe();    
  }

  loadFuncionarioPage() {
    this.dataSource.loadFuncionarios(
      this.inputPesquisa.nativeElement.value, this.sort.direction, 
      this.paginator.pageIndex, this.paginator.pageSize).then((dto: PaginationDTO) => {
        this.listaFuncionario = dto.content;
        this.totalRecords = dto.totalElements;
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.content.length;
    return numSelected == numRows;
  }
  
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
        this.dataSource.data.content.forEach(row => this.selection.select(row));
  }

  onInputPesquisaClick(){
    this.valorInputPesquisa = '';
    this.inputPesquisa.nativeElement.value = '';
    this.paginator.pageIndex = 0;
    this.loadFuncionarioPage();
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.funcionarioService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Funcionário exportado', 'info', { duration: 3000 });
    });
  }

  mostrarListar() {
    if (this.funcionarioDialog)
        return {display:'none'};
    else
        return {display:''};
  }

  mostrarEditar() {
      if (this.funcionarioDialog)
          return {display:''};
      else
          return {display:'none'};
  }

  onClean() {
    this.funcionario = cleanFuncionario;
  }

  hideDialog() {
    this.funcionarioDialog = false;
    this.submitted = false;
  }

  onInsert() {
    this.funcionario = emptyFuncionario;
    this.submitted = false;
    this.funcionarioDialog = true;
  }

  onEdit(funcionario: Funcionario) {
    this.funcionario = { ...funcionario };
    this.funcionarioDialog = true;
  }

  onSave() {    
    this.submitted = true;
    this.funcionario.cpf = this.baseUtilService.cpfFormatadoParaCpf(this.funcionario.cpfFormatado);
    this.funcionario.dataAdmissao = this.baseUtilService.dataStringToDate(this.funcionario.dataAdmissaoFormatada);
    this.funcionario.dataSaida = this.baseUtilService.dataStringToDate(this.funcionario.dataSaidaFormatada);

    if (this.funcionario.nome.trim()) {
        if (this.funcionario.id) {
          this.funcionarioService.update(this.funcionario).then((obj: Funcionario) => {
            this.funcionario = obj;
            this.listaFuncionario[this.funcionarioService
              .findIndexById(this.listaFuncionario, this.funcionario.id)] = this.funcionario;

            this.listaFuncionario = [...this.listaFuncionario];
            this.funcionario = emptyFuncionario;
            this.dataSource.data.content = this.listaFuncionario;
      
            this.snackBar.open('Funcionário Atualizado', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.funcionarioService.insert(this.funcionario).then((obj: Funcionario) => {
            this.funcionario = obj;
            this.listaFuncionario.push(this.funcionario);

            this.listaFuncionario = [...this.listaFuncionario];
            this.funcionario = emptyFuncionario;
            this.dataSource.data.content = this.listaFuncionario;
    
            this.snackBar.open('Funcionário Criado', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(FuncionarioDialogMultipleDelete, { 
      data: { 
        lista: this.listaFuncionario, 
        selecao: this.selection.selected
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaFuncionario = result.lista;
        this.confirmDeleteSelected();
      }
    });
  }

  onDelete(funcionario: Funcionario) {
    const dialogRef = this.dialog.open(FuncionarioDialogDelete, { 
      data: { 
        lista: this.listaFuncionario, 
        entidade: funcionario
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaFuncionario = result.lista;
        this.funcionario = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDeleteSelected() {
    this.listaFuncionario = this.listaFuncionario.filter(val => !this.selection.selected.includes(val));

    this.selection.selected.forEach(async (item: Funcionario, index: number) => {
      await this.funcionarioService.delete(item.id);
      
      if (this.selection.selected.length == (index+1)){
        this.selection.clear();
        this.dataSource.data.content = this.listaFuncionario;
        this.snackBar.open('Funcionários excluídos', 'Sucesso', { duration: 3000 });        
      }
    });

  }

  confirmDelete() {
    this.funcionarioService.delete(this.funcionario.id).then(obj => {
      this.listaFuncionario = this.listaFuncionario.filter(val => val.id !== this.funcionario.id);
      this.funcionario = emptyFuncionario;     
      //this.dataSource.data = this.listaFuncionario;   
      this.snackBar.open('Funcionário excluído', 'Sucesso', { duration: 3000 });
    });
  }  

  exportPdf() {
    const head: string[] = [];
    const data: any[] = [];

    this.exportColumns.forEach(item => head.push(item.title));
    this.listaFuncionario.forEach(item => data.push(
        [item.id, item.nome, item.cpfFormatado, item.email, item.telefone, item.celular, 
        item.setor, item.codCargo, item.cargo, item.dataAdmissaoFormatada, item.dataSaidaFormatada, item.ativo]
    ));

    this.exportService.exportPdf(head, data, 'funcionarios.pdf');
  }

  exportExcel() {
      this.exportService.exportExcel(this.listaFuncionario, 'funcionarios');
  }    

}
