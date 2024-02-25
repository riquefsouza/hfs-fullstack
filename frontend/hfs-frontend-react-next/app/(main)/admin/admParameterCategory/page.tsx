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
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../api/AdmParameterCategory';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { CheckboxChangeEvent } from 'primereact/checkbox';

const AdmParameterCategoryPage = () => {

    const [admParameterCategoryService,] = useState<AdmParameterCategoryService>(new AdmParameterCategoryService());

    const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
    const [admParameterCategoryDialog, setAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategoryDialog, setDeleteAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategorysDialog, setDeleteAdmParameterCategorysDialog] = useState<boolean>(false);
    const [admParameterCategory, setAdmParameterCategory] = useState<AdmParameterCategory>(emptyAdmParameterCategory); 
    const [selectedAdmParameterCategorys, setSelectedAdmParameterCategorys] = useState<AdmParameterCategory[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    useEffect(() => {
        admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descrição' },
            { field: 'order', header: 'Ordem' }
        ]);
      
    }, [admParameterCategoryService, cols]);

    const onInsert = () => {
        setAdmParameterCategory(emptyAdmParameterCategory);
        setSubmitted(false);
        setAdmParameterCategoryDialog(true);
    }
    
    const onEdit = (admParameterCategory: AdmParameterCategory) => {
        setAdmParameterCategory({ ...admParameterCategory });
        setAdmParameterCategoryDialog(true);
    }
    
    const hideDialog = () => {
        setAdmParameterCategoryDialog(false);
        setSubmitted(false);
    }

    const hideDeleteAdmParameterCategoryDialog = () => {
        setDeleteAdmParameterCategoryDialog(false);
    };

    const hideDeleteAdmParameterCategorysDialog = () => {
        setDeleteAdmParameterCategorysDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
    
        if (admParameterCategory.description.trim()) {
            let _listaAdmParameterCategory = [...listaAdmParameterCategory];
            let _admParameterCategory = {...admParameterCategory};

            if (admParameterCategory.id) {
                admParameterCategoryService.update(admParameterCategory).then((obj: AdmParameterCategory) => {
                    _admParameterCategory = obj;
                    
                    if (admParameterCategory.id) {
                        const index = admParameterCategoryService.findIndexById(listaAdmParameterCategory, admParameterCategory.id);
                        _listaAdmParameterCategory[index] = _admParameterCategory;
                        setListaAdmParameterCategory(_listaAdmParameterCategory);
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro Atualizada', life: 3000 });                        
                    }
                });
            } else {
                admParameterCategoryService.insert(admParameterCategory).then((obj: AdmParameterCategory) => {
                    _admParameterCategory = obj;
                    _listaAdmParameterCategory.push(_admParameterCategory);
                    setListaAdmParameterCategory(_listaAdmParameterCategory);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro Criada', life: 3000 });
                });
            }
            
            setAdmParameterCategoryDialog(false);
            setAdmParameterCategory(emptyAdmParameterCategory);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmParameterCategorysDialog(true);
    }
  
    const onDelete = (admParameterCategory: AdmParameterCategory) => {
        setDeleteAdmParameterCategoryDialog(true);
        setAdmParameterCategory({ ...admParameterCategory });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmParameterCategorysDialog(false);
        setListaAdmParameterCategory(listaAdmParameterCategory.filter(val => !selectedAdmParameterCategorys.includes(val)));
  
        let excluiu = false;
        selectedAdmParameterCategorys.forEach((item) => {
            if (item.id) {
                admParameterCategoryService.delete(item.id).then(obj => {
                    excluiu = true;
                });    
            }
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categorias de parâmetro excluídos', life: 3000 });
            setSelectedAdmParameterCategorys([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterCategoryDialog(false);
        if (admParameterCategory.id) {
            admParameterCategoryService.delete(admParameterCategory.id).then(obj => {
                setListaAdmParameterCategory(listaAdmParameterCategory.filter(val => val.id !== admParameterCategory.id));
                setAdmParameterCategory(emptyAdmParameterCategory); 
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro excluído', life: 3000 });
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
        admParameterCategoryService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Categoria de parâmetro exportada', 
            detail: 'Categoria de parâmetro exportada', life: 3000 });
        });
    }

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameterCategory = { ...admParameterCategory };
        _admParameterCategory.description = val;

        setAdmParameterCategory(_admParameterCategory);
    };

    const onOrderInputNumberChange = (e: InputNumberValueChangeEvent) => {
        const val = e.value || 0;
        let _admParameterCategory = { ...admParameterCategory };
        _admParameterCategory.order = val;

        setAdmParameterCategory(_admParameterCategory);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className=" mr-2" onClick={onInsert} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelected} 
                        disabled={!selectedAdmParameterCategorys || !(selectedAdmParameterCategorys as any).length} />
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

    const tabelaFooter = (
        <div className="p-d-flex p-ai-center p-jc-between">
            No total existem {listaAdmParameterCategory ? listaAdmParameterCategory.length : 0 } categorias de parâmetro.
        </div>
    );

    const idBodyTemplate = (rowData: AdmParameterCategory) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };    

    const descriptionBodyTemplate = (rowData: AdmParameterCategory) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };    

    const orderBodyTemplate = (rowData: AdmParameterCategory) => {
        return (
            <>
                <span className="p-column-title">Ordem</span>
                {rowData.order}
            </>
        );
    };    

    const actionBodyTemplate = (rowData: AdmParameterCategory) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    const admParameterCategoryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={onSave} />
        </>
    );

    const deleteAdmParameterCategoryDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmParameterCategoryDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    const deleteAdmParameterCategorysDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmParameterCategorysDialog} />
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
                            forceDownloadChange={e => onChangedForceDownload(e)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={listaAdmParameterCategory} selection={selectedAdmParameterCategorys}
                        onSelectionChange={(e) => setSelectedAdmParameterCategorys(e.value as any)} paginatorPosition="both"
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} footer={tabelaFooter} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '14%', minWidth: '10rem' }} body={idBodyTemplate}></Column>
                        <Column field="description" header="Descrição" sortable headerStyle={{ minWidth: '10rem' }} body={descriptionBodyTemplate}></Column>
                        <Column field="order" header="Ordem" sortable headerStyle={{ width: '14%', minWidth: '8rem' }} body={orderBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={admParameterCategoryDialog} style={{ width: '450px' }} header="Detalhes da categoria de parâmetro" modal className="p-fluid" 
                        footer={admParameterCategoryDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={admParameterCategory.description} onChange={(e) => onDescriptionInputChange(e)} 
                                required rows={3} cols={20} 
                                className={classNames({'p-invalid': submitted && !admParameterCategory.description})}
                            />
                            {submitted && !admParameterCategory.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="order">Ordem</label>
                            <InputNumber id="order" value={admParameterCategory.order} locale="pt-BR" onValueChange={(e) => onOrderInputNumberChange(e)} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdmParameterCategoryDialog} style={{ width: '450px' }} header="Confirm" modal 
                        footer={deleteAdmParameterCategoryDialogFooter} onHide={hideDeleteAdmParameterCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {admParameterCategory && (
                                <span>
                                    Tem certeza de que deseja excluir <b>{admParameterCategory.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdmParameterCategorysDialog} style={{ width: '450px' }} header="Confirm" modal 
                        footer={deleteAdmParameterCategorysDialogFooter} onHide={hideDeleteAdmParameterCategorysDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {admParameterCategory && <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AdmParameterCategoryPage;
