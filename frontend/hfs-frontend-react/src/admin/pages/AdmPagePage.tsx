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
import AdmPageService from '../service/AdmPageService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '../api/AdmPage';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ExportService } from '../../base/services/ExportService';
import { Dropdown } from 'primereact/dropdown';
import { MyEventType } from "../../base/models/MyEventType";
import { AdmProfile } from '../api/AdmProfile';
import AdmProfileService from '../service/AdmProfileService';
import { PickList } from 'primereact/picklist';

const AdmPagePage = () => {

    const admPageService = new AdmPageService();
    const admProfileService = new AdmProfileService();
    const exportService = new ExportService();

    const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
    const [admPageDialog, setAdmPageDialog] = useState<boolean>(false);
    const [deleteAdmPageDialog, setDeleteAdmPageDialog] = useState<boolean>(false);
    const [deleteAdmPagesDialog, setDeleteAdmPagesDialog] = useState<boolean>(false);
    const [admPage, setAdmPage] = useState<AdmPage>(emptyAdmPage); 
    const [selectedAdmPages, setSelectedAdmPages] = useState<AdmPage[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [exportColumns, setExportColumns] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const [itemsMenuLinha, setItemsMenuLinha] = useState<MenuItem[]>([]);
    const popupMenu = useRef<Menu>(null);

    const [sourceProfiles, setSourceProfiles] = useState<AdmProfile[]>([]);
    const [targetProfiles, setTargetProfiles] = useState<AdmProfile[]>([]);

    useEffect(() => {  
        admPageService.findAll().then(item => setListaAdmPage(item));

        setItemsMenuLinha([{ label: "Editar" }, { label: "Excluir" }]);

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'url', header: 'Página' },
            { field: 'description', header: 'Descrição' },
            { field: 'pageProfiles', header: 'Perfil(s) da página' }
        ]);
            
        setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
      
    }, []);

    const toggleMenu = (menu: Menu, event: any, rowData: AdmPage) => {
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

        menu.toggle(event);
    }
    
    const loadAdmProfiles = (admPage: AdmPage | null): void => {
        setTargetProfiles([]);

        if (admPage == null) {

            admProfileService.findAll().then(profiles => {
                setSourceProfiles(profiles);
            });

        } else {

            if (admPage.id != null) {
                admProfileService.findProfilesByPage(admPage).then(data => {
                    setTargetProfiles(data);

                    admProfileService.findAll().then(profiles => {
                        setSourceProfiles(profiles.filter(profile =>
                            !targetProfiles.find(target => target.id === profile.id))
                        );
                    });

                });
            }

        }
    }

    const mostrarListar = () => {
        if (admPageDialog)
            return { display: 'none' };
        else
            return { display: '' };
    }

    const mostrarEditar = () => {
        if (admPageDialog)
            return { display: '' };
        else
            return { display: 'none' };
    }

    const onClean = () => {
        setAdmPage(cleanAdmPage);
        loadAdmProfiles(null);
    }

    const onInsert = () => {
        setAdmPage(emptyAdmPage);
        setSubmitted(false);      
        setAdmPageDialog(true);
        loadAdmProfiles(null);
    }
    
    const onEdit = (admPage: AdmPage) => {
        setAdmPage({ ...admPage });
        setAdmPageDialog(true);
        loadAdmProfiles(admPage);
    }
    
    const hideDialog = () => {
        setAdmPageDialog(false);
        setSubmitted(false);
    }

    const hideDeleteAdmPageDialog = () => {
        setDeleteAdmPageDialog(false);
    };

    const hideDeleteAdmPagesDialog = () => {
        setDeleteAdmPagesDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
        admPage.admIdProfiles = [];
        targetProfiles.forEach(item => {
            admPage.admIdProfiles.push(item.id)
        });
        
        if (admPage.description.trim()) {
            let _listaAdmPage = [...listaAdmPage];
            let _admPage = {...admPage};

            if (admPage.id) {
                admPageService.update(admPage).then((obj: AdmPage) => {
                    _admPage = obj;
                    
                    const index = admPageService.findIndexById(listaAdmPage, admPage.id);
                    _listaAdmPage[index] = _admPage;
                    _listaAdmPage[index].admPageCategory = _admPage.admPageCategory;

                    setListaAdmPage(_listaAdmPage);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Página Atualizada', life: 3000 });                    
                });
            } else {
                admPageService.insert(admPage).then((obj: AdmPage) => {
                    _admPage = obj;
                    _listaAdmPage.push(_admPage);
                    setListaAdmPage(_listaAdmPage);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Página Criada', life: 3000 });
                });
            }
            
            setAdmPageDialog(false);
            setAdmPage(emptyAdmPage);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmPagesDialog(true);
    }
  
    const onDelete = (admPage: AdmPage) => {
        setDeleteAdmPageDialog(true);
        setAdmPage({ ...admPage });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmPagesDialog(false);
        setListaAdmPage(listaAdmPage.filter(val => !selectedAdmPages.includes(val)));
  
        let excluiu = false;
        selectedAdmPages.forEach((item) => {
            admPageService.delete(item.id).then(obj => {
                excluiu = true;
            });
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Páginas excluídas', life: 3000 });
            setSelectedAdmPages([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmPageDialog(false);
        admPageService.delete(admPage.id).then(obj => {
            setListaAdmPage(listaAdmPage.filter(val => val.id !== admPage.id));
            setAdmPage(emptyAdmPage); 
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Página excluída', life: 3000 });
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
        admPageService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Página exportada', 
            detail: 'Página exportada', life: 3000 });
        });
    }

    const exportPdf = () => {
        const head: string[] = [];
        const data: any[] = [];
    
        exportColumns.forEach(item => head.push(item.title));
        listaAdmPage.forEach((item: AdmPage) => data.push(
            [item.id, item.url, item.description, item.pageProfiles]
        ));
    
        exportService.exportPdf(head, data, 'Paginas.pdf');
      }
    
    const exportExcel = () => {
        exportService.exportExcel(listaAdmPage, 'Paginas');
    }

    const onUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _admPage = { ...admPage };
        _admPage.url = val;

        setAdmPage(_admPage);
    }

    const onDescriptionInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val = (e.target && e.currentTarget.value) || '';
        let _admPage = { ...admPage };
        _admPage.description = val;

        setAdmPage(_admPage);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className=" mr-2" onClick={onInsert} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelected} 
                        disabled={!selectedAdmPages || !(selectedAdmPages as any).length} />
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

    const tabelaHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciar páginas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const tabelaFooter = (
        <div className="p-d-flex p-ai-center p-jc-between">
            No total existem {listaAdmPage ? listaAdmPage.length : 0 } páginas.
        </div>
    );

    const idBodyTemplate = (rowData: AdmPage) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };    

    const urlBodyTemplate = (rowData: AdmPage) => {
        return (
            <>
                <span className="p-column-title">Página</span>
                {rowData.url}
            </>
        );
    };    

    const pageProfilesBodyTemplate = (rowData: AdmPage) => {
        return (
            <>
                <span className="p-column-title">Perfil(s) da página</span>
                {rowData.pageProfiles}
            </>
        );
    };    

    const descriptionBodyTemplate = (rowData: AdmPage) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };    

    const actionBodyTemplate = (rowData: AdmPage) => {
        if (rowData){            
            return (
                <>
                    <div className="flex">                        
                        <Button link icon="pi pi-ellipsis-v" onClick={(event) => toggleMenu(popupMenu.current, event, rowData)} style={{ cursor: 'pointer' }} 
                            aria-controls="popup_menu" aria-haspopup />                            
                    </div>
                </>
            );
        }
    };

    const onPageProfilesChange = (event: { 
        source: React.SetStateAction<AdmProfile[]>; 
        target: React.SetStateAction<AdmProfile[]>; }) => {
        setSourceProfiles(event.source);
        setTargetProfiles(event.target);
    }    

    const itemTemplate = (item: AdmProfile) => {
        return (
          <div>
              {item.description}
          </div>
        );
    }
        
    const deleteAdmPageDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmPageDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    const deleteAdmPagesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmPagesDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={confirmDeleteSelected} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card px-6 py-6" style={mostrarListar()}>
                    <Toast ref={toast} />
                    <Panel header="Página" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e.checked)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <Menu model={itemsMenuLinha} popup ref={popupMenu} id="popup_menu" popupAlignment="right" />

                    <DataTable ref={dt} value={listaAdmPage} selection={selectedAdmPages} paginatorPosition="both"
                        onSelectionChange={(e) => setSelectedAdmPages(e.value as any)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} footer={tabelaFooter} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '5%', minWidth: '5rem' }} body={idBodyTemplate}></Column>
                        <Column field="url" header="Página" sortable headerStyle={{ minWidth: '10rem' }} body={urlBodyTemplate}></Column>
                        <Column field="description" header="Descrição" sortable headerStyle={{ minWidth: '8rem' }} body={descriptionBodyTemplate}></Column>
                        <Column field="pageProfiles" header="Perfil(s) da página" sortable headerStyle={{ minWidth: '8rem' }} body={pageProfilesBodyTemplate}></Column>                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>

                <div className="card px-6 py-6" style={mostrarEditar()}>
                    <Toast ref={toast} />
                    <Panel header="Detalhes da página" className="p-mb-2">
                        <Toolbar className="mb-4" start={leftEditToolbarTemplate} end={rightEditToolbarTemplate}></Toolbar>
                    </Panel>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="url">Página:</label>
                            <InputText id="url" value={admPage.url} onChange={(e) => onUrlChange(e)} required 
                                className={classNames({'p-invalid': submitted && !admPage.url})} />
                            {submitted && !admPage.url && <small className="p-invalid">A página é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText id="description" value={admPage.description} onChange={(e) => onDescriptionInputChange(e)} required
                                className={classNames({'p-invalid': submitted && !admPage.description})}
                            />
                            {submitted && !admPage.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="pageProfiles">Perfil(s) da página:</label>
                            <PickList source={sourceProfiles} target={targetProfiles} itemTemplate={itemTemplate}
                                sourceHeader="Disponível" targetHeader="Selecionada"
                                sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onPageProfilesChange}>
                            </PickList>                            
                        </div>    
                    </div>
                </div>                

                <Dialog visible={deleteAdmPageDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteAdmPageDialogFooter} onHide={hideDeleteAdmPageDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {admPage && (
                            <span>
                                Tem certeza de que deseja excluir <b>{admPage.description}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteAdmPagesDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteAdmPagesDialogFooter} onHide={hideDeleteAdmPagesDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {admPage && <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>}
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default AdmPagePage;
