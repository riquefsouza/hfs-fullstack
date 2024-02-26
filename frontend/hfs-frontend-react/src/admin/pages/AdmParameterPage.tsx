'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
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
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { AdmParameterCategory } from '../api/AdmParameterCategory';
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { CheckboxChangeEvent } from 'primereact/checkbox';

const AdmParameterPage = () => {

    const admParameterService = new AdmParameterService();
    const admParameterCategoryService = new AdmParameterCategoryService();
    //const exportService = new ExportService();

    const [listaAdmParameter, setListaAdmParameter] = useState<AdmParameter[]>([]);
    const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
    const [admParameterDialog, setAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParameterDialog, setDeleteAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParametersDialog, setDeleteAdmParametersDialog] = useState<boolean>(false);
    const [admParameter, setAdmParameter] = useState<AdmParameter>(emptyAdmParameter); 
    const [selectedAdmParameters, setSelectedAdmParameters] = useState<AdmParameter[]>([]);

    const [submitted, setSubmitted] = useState(false);
    //const [cols, setCols] = useState<any[]>([]);
    //const [exportColumns, setExportColumns] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const [itemsMenuLinha, setItemsMenuLinha] = useState<MenuItem[]>([]);
    const popupMenu = useRef<Menu>(null);

    useEffect(() => {
        admParameterCategoryService.findAll().then(data => setListaAdmParameterCategory(data));
  
        admParameterService.findAll().then(item => setListaAdmParameter(item));

        setItemsMenuLinha([{ label: "Editar" }, { label: "Excluir" }]);
/*
        setCols([
            { field: 'id', header: 'Id' },
            { field: 'admParameterCategory.description', header: 'Categoria de parâmetro' },
            { field: 'code', header: 'Parâmetro' },
            { field: 'value', header: 'Valor' },
            { field: 'description', header: 'Descrição' }
        ]);
      
        setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
*/      
    }, []);

    const toggleMenu = (menu: React.RefObject<Menu>, event: any, rowData: AdmParameter) => {
        setItemsMenuLinha([]);

        let _itemsMenuLinha: MenuItem[] = [];

        _itemsMenuLinha.push({
            label: 'Editar',
            command: () => {
                onEdit(rowData);
            }
        });

        _itemsMenuLinha.push({
            label: 'Excluir',
            command: () => {
                onDelete(rowData);
            }
        });

        setItemsMenuLinha(_itemsMenuLinha);

        if (menu.current){
            menu.current.toggle(event);
        }
    }
    
    const onInsert = () => {
        setAdmParameter(emptyAdmParameter);
        setSubmitted(false);
        
        if (listaAdmParameterCategory.length > 0) {
            admParameter.admParameterCategory = listaAdmParameterCategory.at(0);
        }
      
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
                    
                    if (admParameter.id) {
                        const index = admParameterService.findIndexById(listaAdmParameter, admParameter.id);
                        _listaAdmParameter[index] = _admParameter;
                        _listaAdmParameter[index].admParameterCategory = _admParameter.admParameterCategory;

                        setListaAdmParameter(_listaAdmParameter);
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro Atualizado', life: 3000 });                    
                    }
                });
            } else {
                admParameterService.insert(admParameter).then((obj: AdmParameter) => {
                    _admParameter = obj;
                    _listaAdmParameter.push(_admParameter);
                    setListaAdmParameter(_listaAdmParameter);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro Criado', life: 3000 });
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
            if (item.id){
                admParameterService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetros excluídos', life: 3000 });
            setSelectedAdmParameters([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterDialog(false);
        if (admParameter.id){
            admParameterService.delete(admParameter.id).then(() => {
                setListaAdmParameter(listaAdmParameter.filter(val => val.id !== admParameter.id));
                setAdmParameter(emptyAdmParameter); 
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro excluído', life: 3000 });
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
        admParameterService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Parâmetro exportado', 
            detail: 'Parâmetro exportado', life: 3000 });
        });
    }
/*
    const exportPdf = () => {
        const head: string[] = [];
        const data: any[] = [];
    
        exportColumns.forEach(item => head.push(item.title));
        listaAdmParameter.forEach(item => data.push(
          [item.id, item.admParameterCategory.description, item.code, item.value, item.description]
        ));
    
        exportService.exportPdf(head, data, 'Parametros.pdf');
      }
    
    const exportExcel = () => {
        exportService.exportExcel(listaAdmParameter, 'Parâmetros');
    }
*/
    const onAdmParameterCategoryChange = (e: DropdownChangeEvent) => {
        const val: any = e.value;
        let _admParameter = { ...admParameter };
        _admParameter.admParameterCategory = val;

        setAdmParameter(_admParameter);
    }

    const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.code = val;

        setAdmParameter(_admParameter);
    }

    const onValueChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.value = val;

        setAdmParameter(_admParameter);
    }

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.description = val;

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

    const tabelaFooter = (
        <div className="p-d-flex p-ai-center p-jc-between">
            No total existem {listaAdmParameter ? listaAdmParameter.length : 0 } parâmetros.
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

    const admParameterCategoryDescriptionBodyTemplate = (rowData: AdmParameter) => {
        if (rowData.admParameterCategory){
            return (
                <>
                    <span className="p-column-title">Categoria do parâmetro</span>                    
                    {rowData.admParameterCategory.description}                    
                </>
            );
        }
    };    

    const codeBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <span className="p-column-title">Parâmetro</span>
                {rowData.code}
            </>
        );
    };    

    const valueBodyTemplate = (rowData: AdmParameter) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.value}
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

    const actionBodyTemplate = (rowData: AdmParameter) => {
        if (rowData){            
            return (
                <>
                    <div className="flex">                        
                        <Button link icon="pi pi-ellipsis-v" onClick={(event) => toggleMenu(popupMenu, event, rowData)} style={{ cursor: 'pointer' }} 
                            aria-controls="popup_menu" aria-haspopup />                            
                    </div>
                </>
            );
        }
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
                    <Panel header="Parâmetro" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <Menu model={itemsMenuLinha} popup ref={popupMenu} id="popup_menu" popupAlignment="right" />

                    <DataTable ref={dt} value={listaAdmParameter} selection={selectedAdmParameters} paginatorPosition="both"
                        onSelectionChange={(e) => setSelectedAdmParameters(e.value as any)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} footer={tabelaFooter} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '5%', minWidth: '5rem' }} body={idBodyTemplate}></Column>
                        <Column field="admParameterCategory.description" header="Categoria do parâmetro" sortable headerStyle={{ minWidth: '10rem' }} 
                            body={admParameterCategoryDescriptionBodyTemplate}></Column>                        
                        <Column field="code" header="Parâmetro" sortable headerStyle={{ minWidth: '5rem' }} body={codeBodyTemplate}></Column>
                        <Column field="value" header="Valor" sortable headerStyle={{ minWidth: '8rem' }} body={valueBodyTemplate}></Column>
                        <Column field="description" header="Descrição" sortable headerStyle={{ minWidth: '8rem' }} body={descriptionBodyTemplate}></Column>                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={admParameterDialog} style={{ width: '650px' }} header="Detalhes do parâmetro" modal className="p-fluid" 
                        footer={admParameterDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="admParameterCategory">Categoria do Parâmetro:</label>
                            <Dropdown id="admParameterCategory" value={admParameter.admParameterCategory} options={listaAdmParameterCategory} 
                                onChange={(e) => onAdmParameterCategoryChange(e)}
                                optionLabel="description" placeholder="Selecione uma categoria de parâmetro">
                            </Dropdown>
                        </div>
                        <div className="field">
                            <label htmlFor="code">Parâmetro:</label>
                            <InputText id="code" value={admParameter.code} onChange={(e) => onCodeChange(e)} required 
                                className={classNames({'p-invalid': submitted && !admParameter.code})} />
                            {submitted && !admParameter.code && <small className="p-invalid">O Parâmetro é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="value">Valor:</label>
                            <InputTextarea id="value" value={admParameter.value} onChange={(e) => onValueChange(e)} required rows={5} cols={20} />
                            {submitted && !admParameter.value && <small className="p-error">O Valor é obrigatório.</small>}   
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={admParameter.description} onChange={(e) => onDescriptionInputChange(e)} 
                                required rows={3} cols={20} 
                                className={classNames({'p-invalid': submitted && !admParameter.description})}
                            />
                            {submitted && !admParameter.description && <small className="p-invalid">A descrição é obrigatória.</small>}
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

export default AdmParameterPage;
