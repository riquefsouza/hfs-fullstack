'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableSelectionSingleChangeEvent, DataTableSelectAllChangeEvent, 
    DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import FuncionarioService from '../service/FuncionarioService';
import { Funcionario, cleanFuncionario, emptyFuncionario } from '../api/Funcionario';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { LazyTableState } from '../../base/models/LazyTableState';
import { ExportService } from '../../base/services/ExportService';
import { BaseUtilService } from '../../base/util/BaseUtilService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { FilterMatchMode } from 'primereact/api';

const FuncionarioPage = () => {

    const funcionarioService = new FuncionarioService();
    const exportService = new ExportService();
    const baseUtilService = new BaseUtilService();

    const [listaFuncionario, setListaFuncionario] = useState<Funcionario[]>([]);
    const [funcionarioDialog, setFuncionarioDialog] = useState<boolean>(false);
    const [deleteFuncionarioDialog, setDeleteFuncionarioDialog] = useState<boolean>(false);
    const [deleteFuncionariosDialog, setDeleteFuncionariosDialog] = useState<boolean>(false);
    const [funcionario, setFuncionario] = useState<Funcionario>(emptyFuncionario); 
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<Funcionario[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [exportColumns, setExportColumns] = useState<any[]>([]);
    //const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [, setDate] = useState<Nullable<Date>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const [totalRecords, setTotalRecords] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    const [selectAll, setSelectAll] = useState(false);

    const [lazyState, setlazyState] = useState<LazyTableState>({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'nome',
        sortOrder: 1,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'nome': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        }
    });    
/*
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nome': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });    
*/
    useEffect(() => {
        setCols([
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
        ]);

        setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
     
        loadFuncionarios();
    }, [lazyState]);

    
    const loadFuncionarios = () => {
        setLoading(true);

        funcionarioService.findAllPaginated(lazyState).then((data) => {
            setListaFuncionario(data.content);
            setTotalRecords(data.totalElements);
            setLoading(false);
        });

    }

    const onPage = (event: DataTablePageEvent) => {
        //setlazyState(event);
        
        setlazyState({
            first: event.first,
            rows: event.rows,
            page: event.page,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            filters: lazyState.filters
        });
        
    };

    const onSort = (event: DataTableSortEvent) => {
        setlazyState({
            first: lazyState.first,
            rows: lazyState.rows,
            page: lazyState.page,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
            filters: lazyState.filters
        });
    };

    const onFilter = (event: DataTableFilterEvent) => {
        event['first'] = 0;
        setlazyState({
            first: lazyState.first,
            rows: lazyState.rows,
            page: lazyState.page,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            filters: event.filters
        });
    };    

    const onSelectionChange = (event: DataTableSelectionSingleChangeEvent<any[]>) => {
        const value = event.value;

        setSelectedFuncionarios(value);
        setSelectAll(event.length === totalRecords);
    };

    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        const checked = event.checked;

        if (checked) {
            funcionarioService.findAll().then((res) => {
                setSelectedFuncionarios(res);
                setSelectAll(true);
            });
        } else {
            setSelectedFuncionarios([]);
            setSelectAll(false);
        }
    }

    const mostrarListar = () => {
        if (funcionarioDialog)
            return { display: 'none' };
        else
            return { display: '' };
    }

    const mostrarEditar = () => {
        if (funcionarioDialog)
            return { display: '' };
        else
            return { display: 'none' };
    }

    const onClean = () => {
        setFuncionario(cleanFuncionario);
    }

    const onInsert = () => {
        setFuncionario(emptyFuncionario);
        setSubmitted(false);
        setFuncionarioDialog(true);
    }
    
    const onEdit = (funcionario: Funcionario) => {
        setFuncionario({ ...funcionario });
        setFuncionarioDialog(true);
    }
    
    const hideDialog = () => {
        setFuncionarioDialog(false);
        setSubmitted(false);
    }

    const hideDeleteFuncionarioDialog = () => {
        setDeleteFuncionarioDialog(false);
    };

    const hideDeleteFuncionariosDialog = () => {
        setDeleteFuncionariosDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
        /*
        if (funcionario.cpfFormatado){
            funcionario.cpf = baseUtilService.cpfFormatadoParaCpf(funcionario.cpfFormatado);
        }
        if (funcionario.dataAdmissaoFormatada){
            funcionario.dataAdmissao = baseUtilService.dataStringToDate(funcionario.dataAdmissaoFormatada);
        }
        if (funcionario.dataSaidaFormatada){
            funcionario.dataSaida = baseUtilService.dataStringToDate(funcionario.dataSaidaFormatada);
        } 
        */       
    
        if (funcionario.nome.trim()) {
            let _listaFuncionario = [...listaFuncionario];
            let _funcionario = {...funcionario};

            if (funcionario.id) {
                funcionarioService.update(funcionario).then((obj: Funcionario) => {
                    _funcionario = obj;
                    
                    if(funcionario.id){
                        const index = funcionarioService.findIndexById(listaFuncionario, funcionario.id);
                        _listaFuncionario[index] = _funcionario;
                        setListaFuncionario(_listaFuncionario);
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Atualizado', life: 3000 });
                    }    
                });
            } else {
                funcionarioService.insert(funcionario).then((obj: Funcionario) => {
                    _funcionario = obj;
                    _listaFuncionario.push(_funcionario);
                    setListaFuncionario(_listaFuncionario);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Criado', life: 3000 });
                });
            }
            
            setFuncionarioDialog(false);
            setFuncionario(emptyFuncionario);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteFuncionariosDialog(true);
    }
  
    const onDelete = (funcionario: Funcionario) => {
        setDeleteFuncionarioDialog(true);
        setFuncionario({ ...funcionario });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteFuncionariosDialog(false);
        setListaFuncionario(listaFuncionario.filter(val => !selectedFuncionarios.includes(val)));
  
        let excluiu = false;
        selectedFuncionarios.forEach((item) => {
            if (item.id){
                funcionarioService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Funcionários excluídos', life: 3000 });
            setSelectedFuncionarios([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteFuncionarioDialog(false);
        if (funcionario.id){
            funcionarioService.delete(funcionario.id).then(() => {
                setListaFuncionario(listaFuncionario.filter(val => val.id !== funcionario.id));
                setFuncionario(emptyFuncionario); 
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário excluído', life: 3000 });
            });
        }
    }
  
    const onChangedTypeReport = (typeReport: ItypeReport) => {
        setSelectedTypeReport(typeReport);
        setReportParamForm({ reportType: typeReport.type, 
          forceDownload: selectedForceDownload });
    }
    
    const onChangedForceDownload = (event: CheckboxChangeEvent) => {
        const forceDownload = event.checked;
        if (forceDownload){
            setSelectedForceDownload(forceDownload);
            setReportParamForm({ reportType: selectedTypeReport.type, 
              forceDownload: forceDownload });    
        }
    }
    
    const onExport = () => {
        funcionarioService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Funcionário exportado', 
            detail: 'Funcionário exportada', life: 3000 });
        });
    }
/*
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
*/
    const exportCSV = (param: boolean) => {
        if (dt.current){
            dt.current.exportCSV({ selectionOnly: param });
        }
    };

    const exportPdf = () => {
        const head: string[] = [];
        const data: any[] = [];

        exportColumns.forEach(item => head.push(item.title));
        listaFuncionario.forEach(item => data.push(
            [item.id, item.nome, item.cpfFormatado, item.email, item.telefone, item.celular, 
            item.setor, item.codCargo, item.cargo, item.dataAdmissaoFormatada, item.dataSaidaFormatada, item.ativo]
        ));

        exportService.exportPdf(head, data, 'funcionarios.pdf');
    }
    
    const exportExcel = () => {
        exportService.exportExcel(listaFuncionario, 'funcionarios');
    }  

    const onNomeInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.nome = val;

        setFuncionario(_funcionario);
    };

    const onEmailInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.email = val;

        setFuncionario(_funcionario);
    };

    const onCpfInputChange = (e: InputMaskChangeEvent) => {
        const val: string = (e.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.cpf = baseUtilService.cpfFormatadoParaCpf(val);

        setFuncionario(_funcionario);
    };

    const onTelefoneInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.telefone = val;

        setFuncionario(_funcionario);
    };

    const onCelularInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.celular = val;

        setFuncionario(_funcionario);
    };

    const onSetorInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.setor = val;

        setFuncionario(_funcionario);
    };

    const onCodCargoInputNumberChange = (e: InputNumberValueChangeEvent) => {
        const val = e.value || 0;
        let _funcionario = { ...funcionario };
        _funcionario.codCargo = val;

        setFuncionario(_funcionario);
    };

    const onCargoInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.cargo = val;

        setFuncionario(_funcionario);
    };

    const onAtivoChange = (e: CheckboxChangeEvent) => {        
        let _funcionario = { ...funcionario };
        if (e.checked!==undefined){
            _funcionario.ativo = e.checked;
        }
        
        setFuncionario(_funcionario);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className=" mr-2" onClick={onInsert} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelected} 
                        disabled={!selectedFuncionarios || !(selectedFuncionarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={onExport} />
            </React.Fragment>
        );
    };

    const tabelaHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Funcionários</h5>

            <div className="flex">
                <Button type="button" icon="pi pi-file" onClick={() => exportCSV(false)} data-pr-tooltip="CSV"
                    className="mr-2" tooltip="CSV" tooltipOptions={{ position: 'bottom' }} />
                <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} data-pr-tooltip="XLS"
                    className="p-button-success mr-2" tooltip="XLS" tooltipOptions={{ position: 'bottom' }} />
                <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} data-pr-tooltip="PDF"
                    className="p-button-warning mr-2" tooltip="PDF" tooltipOptions={{ position: 'bottom' }} />
                <Button type="button" icon="pi pi-filter" onClick={() => exportCSV(true)} data-pr-tooltip="CSV"
                    className="p-button-info mr-2" tooltip="Somente Seleção" tooltipOptions={{ position: 'bottom' }} />
            </div>        
        </div>
    );

    const tabelaFooter = (
        <div className="p-d-flex p-ai-center p-jc-between">
            No total existem {listaFuncionario ? listaFuncionario.length : 0 } funcionários.
        </div>
    );

    const idBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };    

    const nomeBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };    

    const cpfBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Cpf</span>
                {rowData.cpfFormatado}
            </>
        );
    };    

    const emailBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };    

    const telefoneBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Telefone</span>
                {rowData.telefone}
            </>
        );
    };    

    const celularBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.celular}
            </>
        );
    };    

    const setorBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Setor</span>
                {rowData.setor}
            </>
        );
    };    

    const codCargoBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">CodCargo</span>
                {rowData.codCargo}
            </>
        );
    };    

    const cargoBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Cargo</span>
                {rowData.cargo}
            </>
        );
    };    

    const dataAdmissaoBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Data Admissão</span>
                {rowData.dataAdmissaoFormatada}
            </>
        );
    };    

    const dataSaidaBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Data Saída</span>
                {rowData.dataSaidaFormatada}
            </>
        );
    };    

    const ativoBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <span className="p-column-title">Ativo</span>
                {rowData.ativo}
            </>
        );
    };    

    const actionBodyTemplate = (rowData: Funcionario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    const leftEditToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    };

    const rightEditToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary mr-2" onClick={hideDialog} />
                <Button label="Limpar" icon="pi pi-star-o" className="p-button-primary mr-2" onClick={onClean} />
                <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={onSave} />
            </React.Fragment>
        );
    };

    const deleteFuncionarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteFuncionarioDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    const deleteFuncionariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteFuncionariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={confirmDeleteSelected} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card" style={mostrarListar()}>
                    <Toast ref={toast} />
                    <Panel header="Funcionário" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
    
                    <DataTable value={listaFuncionario} lazy filterDisplay="row" dataKey="id" paginator
                        first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage} 
                        onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                        onFilter={onFilter} filters={lazyState.filters} loading={loading} tableStyle={{ minWidth: '75rem' }}
                        selection={selectedFuncionarios} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange}
                        paginatorPosition="both" rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilterFields={['nome']} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} footer={tabelaFooter} responsiveLayout="scroll"                        
                    >                            
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '14%', minWidth: '10rem' }} body={idBodyTemplate}></Column>
                        <Column field="nome" header="Nome" sortable filter filterField="nome" headerStyle={{ minWidth: '20rem' }} body={nomeBodyTemplate}></Column>
                        <Column field="cpfFormatado" header="Cpf" sortable headerStyle={{ width: '14%', minWidth: '8rem' }} body={cpfBodyTemplate}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ minWidth: '10rem' }} body={emailBodyTemplate}></Column>
                        <Column field="telefone" header="Telefone" sortable headerStyle={{ minWidth: '10rem' }} body={telefoneBodyTemplate}></Column>
                        <Column field="celular" header="Celular" sortable headerStyle={{ minWidth: '10rem' }} body={celularBodyTemplate}></Column>
                        <Column field="setor" header="Setor" sortable headerStyle={{ minWidth: '10rem' }} body={setorBodyTemplate}></Column>
                        <Column field="codCargo" header="CodCargo" sortable headerStyle={{ minWidth: '10rem' }} body={codCargoBodyTemplate}></Column>
                        <Column field="cargo" header="Cargo" sortable headerStyle={{ minWidth: '10rem' }} body={cargoBodyTemplate}></Column>
                        <Column field="dataAdmissaoFormatada" header="Data Admissão" sortable headerStyle={{ minWidth: '10rem' }} body={dataAdmissaoBodyTemplate}></Column>
                        <Column field="dataSaidaFormatada" header="Data Saída" sortable headerStyle={{ minWidth: '10rem' }} body={dataSaidaBodyTemplate}></Column>
                        <Column field="ativo" header="Ativo" sortable headerStyle={{ minWidth: '10rem' }} body={ativoBodyTemplate}></Column>                        
                    </DataTable>
                </div>

                <div className="card px-6 py-6" style={mostrarEditar()}>
                    <Toast ref={toast} />
                    <Panel header="Detalhes do funcionário" className="p-mb-2">
                        <Toolbar className="mb-4" start={leftEditToolbarTemplate} end={rightEditToolbarTemplate}></Toolbar>                    
                        <div className="card p-fluid">
                            <div className="field">
                                <label htmlFor="nome">Nome</label>
                                <InputText id="nome" value={funcionario.nome} onChange={(e) => onNomeInputChange(e)} required                                    
                                    className={classNames({'p-invalid': submitted && !funcionario.nome})}
                                />
                                {submitted && !funcionario.nome && <small className="p-invalid">O Nome é obrigatório.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={funcionario.email} onChange={(e) => onEmailInputChange(e)} />
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="cpf">Cpf</label>
                                    <InputMask mask="999.999.999-99" id="cpf" value={funcionario.cpfFormatado} onChange={(e) => onCpfInputChange(e)} required                                    
                                        className={classNames({'p-invalid': submitted && !funcionario.cpf})}
                                    />
                                    {submitted && !funcionario.cpf && <small className="p-invalid">O Cpf é obrigatório.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="telefone">Telefone</label>
                                    <InputText id="telefone" value={funcionario.telefone} onChange={(e) => onTelefoneInputChange(e)} />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="celular">Celular</label>
                                    <InputText id="celular" value={funcionario.celular} onChange={(e) => onCelularInputChange(e)} />
                                </div>
                                <div className="field col">
                                    <label htmlFor="setor">Setor</label>
                                    <InputText id="setor" value={funcionario.celular} onChange={(e) => onSetorInputChange(e)} />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="codCargo">CodCargo</label>
                                    <InputNumber id="codCargo" value={funcionario.codCargo} locale="pt-BR" onValueChange={(e) => onCodCargoInputNumberChange(e)} />
                                </div>
                                <div className="field col">
                                    <label htmlFor="cargo">Cargo</label>
                                    <InputText id="cargo" value={funcionario.cargo} onChange={(e) => onCargoInputChange(e)} />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="dataAdmissao">Data Admissão</label>
                                    <Calendar id="dataAdmissao" value={funcionario.dataAdmissao} onChange={(e) => setDate(e.value)} showIcon 
                                        dateFormat="dd/mm/yy" />
                                </div>
                                <div className="field col">
                                    <label htmlFor="dataSaida">Data Saída</label>
                                    <Calendar id="dataSaida" value={funcionario.dataSaida} onChange={(e) => setDate(e.value)} showIcon 
                                        dateFormat="dd/mm/yy" />
                                </div>                            
                            </div>
                            <div className="flex align-items-center gap-1">
                                <Checkbox inputId="ativo" name="ativo" value="Ativo" onChange={onAtivoChange} checked={funcionario.ativo} />
                                <label htmlFor="ativo" className="ml-2">Ativo</label>
                            </div>
                        </div>
                    </Panel>
                </div>  

                <Dialog visible={deleteFuncionarioDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteFuncionarioDialogFooter} onHide={hideDeleteFuncionarioDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {funcionario && (
                            <span>
                                Tem certeza de que deseja excluir <b>{funcionario.nome}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteFuncionariosDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteFuncionariosDialogFooter} onHide={hideDeleteFuncionariosDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {funcionario && <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>}
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default FuncionarioPage;
