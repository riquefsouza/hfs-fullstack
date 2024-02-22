/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import AdmParameterService from '../service/AdmParameterService';
import { AdmParameter, emptyAdmParameter } from '../api/AdmParameter';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';

const Crud = () => {

    const admParameterService = new AdmParameterService();

    const [listaAdmParameter, setListaAdmParameter] = useState<AdmParameter[]>([]);
    const [admParameterDialog, setAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParameterDialog, setDeleteAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParametersDialog, setDeleteAdmParametersDialog] = useState<boolean>(false);
    const [admParameter, setAdmParameter] = useState<AdmParameter>(emptyAdmParameter); 
    const [selectedAdmParameters, setSelectedAdmParameters] = useState<AdmParameter[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    useEffect(() => {
        admParameterService.findAll().then(item => setListaAdmParameter(item));

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descrição' },
            { field: 'order', header: 'Ordem' }
        ]);
      
    }, []);

    const onInsert = () => {
        setAdmParameter(emptyAdmParameter);
        setSubmitted(false);
        setAdmParameterDialog(true);
    }
    
    const onEdit = (admParameter: AdmParameter) => {
        setAdmParameter({ ...admParameter });
        setAdmParameterDialog(true);
    }
    
    const hideDialog = () => {
        setAdmParameterDialog(false);
        setSubmitted(false);
    }

    const hideDeleteAdmParameterDialog = () => {
        setDeleteAdmParameterDialog(false);
    };

    const hideDeleteAdmParametersDialog = () => {
        setDeleteAdmParametersDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
    
        if (admParameter.description.trim()) {
            let _listaAdmParameter = [...listaAdmParameter];
            let _admParameter = {...admParameter};

            if (admParameter.id) {
                admParameterService.update(admParameter).then((obj: AdmParameter) => {
                    _admParameter = obj;
                    
                    const index = admParameterService.findIndexById(listaAdmParameter, admParameter.id);
                    _listaAdmParameter[index] = _admParameter;
                    setListaAdmParameter(_listaAdmParameter);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro Atualizada', life: 3000 });                    
                });
            } else {
                admParameterService.insert(admParameter).then((obj: AdmParameter) => {
                    _admParameter = obj;
                    _listaAdmParameter.push(_admParameter);
                    setListaAdmParameter(_listaAdmParameter);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro Criada', life: 3000 });
                });
            }
            
            setAdmParameterDialog(false);
            setAdmParameter(emptyAdmParameter);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmParametersDialog(true);
    }
  
    const onDelete = (admParameter: AdmParameter) => {
        setDeleteAdmParameterDialog(true);
        setAdmParameter({ ...admParameter });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmParametersDialog(false);
        setListaAdmParameter(listaAdmParameter.filter(val => !selectedAdmParameters.includes(val)));
  
        let excluiu = false;
        selectedAdmParameters.forEach((item) => {
            admParameterService.delete(item.id).then(obj => {
                excluiu = true;
            });
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categorias de parâmetro excluídos', life: 3000 });
            setSelectedAdmParameters([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterDialog(false);
        admParameterService.delete(admParameter.id).then(obj => {
            setListaAdmParameter(listaAdmParameter.filter(val => val.id !== admParameter.id));
            setAdmParameter(emptyAdmParameter); 
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro excluído', life: 3000 });
        });
    }
  
    const onChangedTypeReport = (typeReport: ItypeReport) => {
        setSelectedTypeReport(typeReport);
        setReportParamForm({ reportType: typeReport.type, 
          forceDownload: selectedForceDownload });
    }
    
    const onChangedForceDownload = (forceDownload: boolean) => {
        setSelectedForceDownload(forceDownload);
        setReportParamForm({ reportType: selectedTypeReport.type, 
          forceDownload: forceDownload });
    }
    
    const onExport = () => {
        admParameterService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Categoria de parâmetro exportada', 
            detail: 'Categoria de parâmetro exportada', life: 3000 });
        });
    }

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.description = val;

        setAdmParameter(_admParameter);
    };

    const onOrderInputNumberChange = (e: InputNumberValueChangeEvent) => {
        const val = e.value || 0;
        let _admParameter = { ...admParameter };
        _admParameter.order = val;

        setAdmParameter(_admParameter);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className=" mr-2" onClick={onInsert} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelected} 
                        disabled={!selectedAdmParameters || !(selectedAdmParameters as any).length} />
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
            <h5 className="m-0">Gerenciar categorias de parâmetros</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const idBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };    

    const descriptionBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };    

    const orderBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <span className="p-column-title">Ordem</span>
                {rowData.order}
            </>
        );
    };    

    const actionBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    const admParameterDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={onSave} />
        </>
    );

    const deleteAdmParameterDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmParameterDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    const deleteAdmParametersDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmParametersDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={confirmDeleteSelected} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Panel header="Categoria de parâmetro de configuração" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e.checked)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={listaAdmParameter} selection={selectedAdmParameters}
                        onSelectionChange={(e) => setSelectedAdmParameters(e.value as any)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '14%', minWidth: '10rem' }} body={idBodyTemplate}></Column>
                        <Column field="description" header="Descrição" sortable headerStyle={{ minWidth: '10rem' }} body={descriptionBodyTemplate}></Column>
                        <Column field="order" header="Ordem" sortable headerStyle={{ width: '14%', minWidth: '8rem' }} body={orderBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={admParameterDialog} style={{ width: '450px' }} header="Detalhes da categoria de parâmetro" modal className="p-fluid" 
                        footer={admParameterDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={admParameter.description} onChange={(e) => onDescriptionInputChange(e)} 
                                required rows={3} cols={20} 
                                className={classNames({'p-invalid': submitted && !admParameter.description})}
                            />
                            {submitted && !admParameter.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="order">Ordem</label>
                            <InputNumber id="order" value={admParameter.order} locale="pt-BR" onValueChange={(e) => onOrderInputNumberChange(e)} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdmParameterDialog} style={{ width: '450px' }} header="Confirm" modal 
                        footer={deleteAdmParameterDialogFooter} onHide={hideDeleteAdmParameterDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {admParameter && (
                                <span>
                                    Tem certeza de que deseja excluir <b>{admParameter.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdmParametersDialog} style={{ width: '450px' }} header="Confirm" modal 
                        footer={deleteAdmParametersDialogFooter} onHide={hideDeleteAdmParametersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {admParameter && <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
