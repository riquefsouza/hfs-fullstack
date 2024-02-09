import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Funcionario, cleanFuncionario } from '../../api/funcionario';
import { FuncionarioService } from '../../service/funcionario.service';
import { LazyLoadEvent } from 'primeng/api';
import { ItypeReport } from '../../../base/services/ReportService';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';
import { ExportService } from '../../../base/services/export.service';
import { BaseUtilService } from '../../../base/util/base-util.service';

@Component({
    templateUrl: './funcionario.component.html',
    providers: [MessageService, ExportService, FuncionarioService, BaseUtilService]
})
export class FuncionarioComponent implements OnInit {

    funcionarioDialog: boolean = false;

    deleteFuncionarioDialog: boolean = false;

    deleteFuncionariosDialog: boolean = false;

    listaFuncionario: Funcionario[] = [];

    funcionario: Funcionario = {};

    selectedFuncionario: Funcionario[] = [];

    submitted: boolean = false;

    cols: any[];

    exportColumns: any[];
  
    reportParamForm: ReportParamForm;
  
    rowsPerPageOptions = [5, 10, 30, 50, 100, 150, 200];

    totalRecords!: number;

    loading: boolean = false;

    selectAll: boolean = false;

    constructor(private funcionarioService: FuncionarioService, 
        private messageService: MessageService,
        private exportService: ExportService,
        private baseUtilService: BaseUtilService) { }

    ngOnInit() {
        this.cols = [
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

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

        this.loading = true;
    }

    loadFuncionarios(event: LazyLoadEvent) {        
        this.loading = true;

        let nome: string = "";
        let page: number = 0;

        page = event.first / event.rows;
        
        if(event.sortField === undefined){
            event.sortField = 'id';
        }

        if (event.filters['nome'] !== undefined){
            nome = event.filters['nome'].value;
        }

        this.funcionarioService.findAllPaginated(nome,
            page, event.rows, event.sortField,
            event.sortOrder === 1 ? 'asc' : 'desc'
        ).then((data) => {
            this.listaFuncionario = data['content'];
            this.totalRecords = data['totalElements'];
            this.loading = false;
        });

    }        

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedFuncionario = value;
    }

    onSelectAllChange(event: any) {
        const checked = event.checked;

        if (checked) {
            this.funcionarioService.findAll().then((res) => {
                this.selectedFuncionario = res;
                this.selectAll = true;
            });
        } else {
            this.selectedFuncionario = [];
            this.selectAll = false;
        }
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

    onSave() {
        this.submitted = true;
        this.funcionario.cpf = this.baseUtilService.cpfFormatadoParaCpf(this.funcionario.cpfFormatado);
        this.funcionario.dataAdmissao = this.baseUtilService.dataStringToDate(this.funcionario.dataAdmissaoFormatada);
        this.funcionario.dataSaida = this.baseUtilService.dataStringToDate(this.funcionario.dataSaidaFormatada);

        if (this.funcionario.nome.trim()) {
            if (this.funcionario.id) {
                this.funcionarioService.update(this.funcionario).then((obj: Funcionario) => {
                this.funcionario = obj;

                this.listaFuncionario[
                    this.funcionarioService.findIndexById(this.listaFuncionario, this.funcionario.id)] = this.funcionario;
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Atualizado', life: 3000 });
                });
            } else {
                this.funcionarioService.insert(this.funcionario).then((obj: Funcionario) => {
                this.funcionario = obj;

                this.listaFuncionario.push(this.funcionario);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Criado', life: 3000 });
                });
            }

            this.listaFuncionario = [...this.listaFuncionario];
            this.funcionarioDialog = false;
            this.funcionario = {};
        }
    }

    onChangedTypeReport(typeReport: ItypeReport) {
        this.reportParamForm.reportType = typeReport.type;
    }

    onChangedForceDownload(forceDownload: boolean) {
        this.reportParamForm.forceDownload = forceDownload;
    }

    onExport() {
        this.funcionarioService.report(this.reportParamForm).then(() => {
            this.messageService.add({severity: 'info', summary: 'Funcionário Exportado', detail: 'Funcionário Exportado', life: 1000});
        });
    }

    onInsert() {
        this.funcionario = {};
        this.submitted = false;
        this.funcionarioDialog = true;
    }

    onEdit(funcionario: Funcionario) {
        this.funcionario = { ...funcionario };
        this.funcionarioDialog = true;
    }
    
    hideDialog() {
        this.funcionarioDialog = false;
        this.submitted = false;
    }

    deleteSelected() {
        this.deleteFuncionariosDialog = true;
    }

    onDelete(funcionario: Funcionario) {
        this.deleteFuncionarioDialog = true;
        this.funcionario = { ...funcionario };
    }

    confirmDeleteSelected() {    
        this.deleteFuncionariosDialog = false;
        this.listaFuncionario = this.listaFuncionario.filter(val => !this.selectedFuncionario.includes(val));

        let excluiu = false;
        this.selectedFuncionario.forEach((item) => {
            this.funcionarioService.delete(item.id).then(obj => {
                excluiu = true;
            });
        });

        if (excluiu) {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionários excluídos', life: 3000 });
            this.selectedFuncionario = [];  
        }
    }

    confirmDelete() {
        this.deleteFuncionarioDialog = false;
        this.funcionarioService.delete(this.funcionario.id).then(obj => {
          this.listaFuncionario = this.listaFuncionario.filter(val => val.id !== this.funcionario.id);
          this.funcionario = {};        
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Página excluída', life: 3000 });
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
