'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import AdmProfileService from '../service/AdmProfileService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '../api/AdmProfile';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ExportService } from '../../base/services/ExportService';
import { PickList } from 'primereact/picklist';
import { AdmPage } from '../api/AdmPage';
import AdmPageService from '../service/AdmPageService';

const AdmProfilePage = () => {

    const admProfileService = new AdmProfileService();
    const admPageService = new AdmPageService();
    const exportService = new ExportService();

    const [listaAdmProfile, setListaAdmProfile] = useState<AdmProfile[]>([]);
    const [admProfileDialog, setAdmProfileDialog] = useState<boolean>(false);
    const [deleteAdmProfileDialog, setDeleteAdmProfileDialog] = useState<boolean>(false);
    const [deleteAdmProfilesDialog, setDeleteAdmProfilesDialog] = useState<boolean>(false);
    const [admProfile, setAdmProfile] = useState<AdmProfile>(emptyAdmProfile); 
    const [selectedAdmProfiles, setSelectedAdmProfiles] = useState<AdmProfile[]>([]);

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

    const [sourcePages, setSourcePages] = useState<AdmPage[]>([]);
    const [targetPages, setTargetPages] = useState<AdmPage[]>([]);

    useEffect(() => {  
        admProfileService.findAll().then(item => setListaAdmProfile(item));

        setItemsMenuLinha([{ label: "Editar" }, { label: "Excluir" }]);

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descrição' },
            { field: 'profilePages', header: 'Páginas(s) do perfil' }
        ]);
            
        setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
      
    }, []);

    const toggleMenu = (menu: Menu, event: any, rowData: AdmProfile) => {
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
    
    const loadAdmPages = (profile: AdmProfile) => {
        let _targetPages: AdmPage[] = [];

        if (profile.id != null) {
            _targetPages = profile.admPages;
            setTargetPages(_targetPages);
        }
        admPageService.findAll().then(pages => {
            setSourcePages(pages.filter(page => !_targetPages.find(target => target.id === page.id)));
        });
    }

    const mostrarListar = () => {
        if (admProfileDialog)
            return { display: 'none' };
        else
            return { display: '' };
    }

    const mostrarEditar = () => {
        if (admProfileDialog)
            return { display: '' };
        else
            return { display: 'none' };
    }

    const onClean = () => {
        setAdmProfile(cleanAdmProfile);
        loadAdmPages(cleanAdmProfile);
    }

    const onInsert = () => {
        setAdmProfile(emptyAdmProfile);
        setSubmitted(false);      
        setAdmProfileDialog(true);
        loadAdmPages(emptyAdmProfile);
    }
    
    const onEdit = (admProfile: AdmProfile) => {
        setAdmProfile({ ...admProfile });
        setAdmProfileDialog(true);
        loadAdmPages(admProfile);
    }
    
    const hideDialog = () => {
        setAdmProfileDialog(false);
        setSubmitted(false);
    }

    const hideDeleteAdmProfileDialog = () => {
        setDeleteAdmProfileDialog(false);
    };

    const hideDeleteAdmProfilesDialog = () => {
        setDeleteAdmProfilesDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
        admProfile.admPages = [];
        targetPages.forEach(item => {
            admProfile.admPages.push(item)
        });
            
        if (admProfile.description.trim()) {
            let _listaAdmProfile = [...listaAdmProfile];
            let _admProfile = {...admProfile};

            if (admProfile.id) {
                admProfileService.update(admProfile).then((obj: AdmProfile) => {
                    _admProfile = obj;
                    
                    const index = admProfileService.findIndexById(listaAdmProfile, admProfile.id);
                    _listaAdmProfile[index] = _admProfile;

                    setListaAdmProfile(_listaAdmProfile);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Atualizado', life: 3000 });                    
                });
            } else {
                admProfileService.insert(admProfile).then((obj: AdmProfile) => {
                    _admProfile = obj;
                    _listaAdmProfile.push(_admProfile);
                    setListaAdmProfile(_listaAdmProfile);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil Criada', life: 3000 });
                });
            }
            
            setAdmProfileDialog(false);
            setAdmProfile(emptyAdmProfile);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmProfilesDialog(true);
    }
  
    const onDelete = (admProfile: AdmProfile) => {
        setDeleteAdmProfileDialog(true);
        setAdmProfile({ ...admProfile });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmProfilesDialog(false);
        setListaAdmProfile(listaAdmProfile.filter(val => !selectedAdmProfiles.includes(val)));
  
        let excluiu = false;
        selectedAdmProfiles.forEach((item) => {
            admProfileService.delete(item.id).then(obj => {
                excluiu = true;
            });
        });
    
        if (excluiu) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfis excluídos', life: 3000 });
            setSelectedAdmProfiles([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmProfileDialog(false);
        admProfileService.delete(admProfile.id).then(obj => {
            setListaAdmProfile(listaAdmProfile.filter(val => val.id !== admProfile.id));
            setAdmProfile(emptyAdmProfile); 
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil excluído', life: 3000 });
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
        admProfileService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Perfil exportado', 
            detail: 'Perfil exportado', life: 3000 });
        });
    }

    const exportPdf = () => {
        const head: string[] = [];
        const data: any[] = [];
    
        exportColumns.forEach(item => head.push(item.title));
        listaAdmProfile.forEach((item: AdmProfile) => data.push(
            [item.id, item.description, item.profilePages]
        ));
    
        exportService.exportPdf(head, data, 'Parametros.pdf');
      }
    
    const exportExcel = () => {
        exportService.exportExcel(listaAdmProfile, 'Parâmetros');
    }

    const onDescriptionInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val = (e.target && e.currentTarget.value) || '';
        let _admProfile = { ...admProfile };
        _admProfile.description = val;

        setAdmProfile(_admProfile);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className=" mr-2" onClick={onInsert} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelected} 
                        disabled={!selectedAdmProfiles || !(selectedAdmProfiles as any).length} />
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
            <h5 className="m-0">Gerenciar perfis</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const tabelaFooter = (
        <div className="p-d-flex p-ai-center p-jc-between">
            No total existem {listaAdmProfile ? listaAdmProfile.length : 0 } perfis.
        </div>
    );

    const idBodyTemplate = (rowData: AdmProfile) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };    

    const urlBodyTemplate = (rowData: AdmProfile) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.url}
            </>
        );
    };    

    const profilePagesBodyTemplate = (rowData: AdmProfile) => {
        return (
            <>
                <span className="p-column-title">Páginas(s) do perfil</span>
                {rowData.profilePages}
            </>
        );
    };    

    const descriptionBodyTemplate = (rowData: AdmProfile) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };    

    const actionBodyTemplate = (rowData: AdmProfile) => {
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

    const onProfilePagesChange = (event: { 
        source: React.SetStateAction<AdmPage[]>; 
        target: React.SetStateAction<AdmPage[]>; }) => {
        setSourcePages(event.source);
        setTargetPages(event.target);
    }    

    const itemTemplate = (item: AdmPage) => {
        return (
          <div>
              {item.description}
          </div>
        );
    }
        
    const deleteAdmProfileDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmProfileDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    const deleteAdmProfilesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmProfilesDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={confirmDeleteSelected} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card px-6 py-6" style={mostrarListar()}>
                    <Toast ref={toast} />
                    <Panel header="Perfil" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e.checked)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <Menu model={itemsMenuLinha} popup ref={popupMenu} id="popup_menu" popupAlignment="right" />

                    <DataTable ref={dt} value={listaAdmProfile} selection={selectedAdmProfiles} paginatorPosition="both"
                        onSelectionChange={(e) => setSelectedAdmProfiles(e.value as any)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[10,30,50,100,150,200]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas" 
                        globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado."
                        header={tabelaHeader} footer={tabelaFooter} responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '5%', minWidth: '5rem' }} body={idBodyTemplate}></Column>
                        <Column field="description" header="Descrição" sortable headerStyle={{ minWidth: '8rem' }} body={descriptionBodyTemplate}></Column>
                        <Column field="profilePages" header="Páginas(s) do perfil" sortable headerStyle={{ minWidth: '8rem' }} body={profilePagesBodyTemplate}></Column>                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>

                <div className="card px-6 py-6" style={mostrarEditar()}>
                    <Toast ref={toast} />
                    <Panel header="Detalhes do perfil" className="p-mb-2">
                        <Toolbar className="mb-4" start={leftEditToolbarTemplate} end={rightEditToolbarTemplate}></Toolbar>
                    </Panel>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText id="description" value={admProfile.description} onChange={(e) => onDescriptionInputChange(e)} required
                                className={classNames({'p-invalid': submitted && !admProfile.description})}
                            />
                            {submitted && !admProfile.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="profilePages">Página(s):</label>
                            <PickList source={sourcePages} target={targetPages} itemTemplate={itemTemplate}
                                sourceHeader="Disponível" targetHeader="Selecionada"
                                sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onProfilePagesChange}>
                            </PickList>                            
                        </div>    
                    </div>
                </div>                

                <Dialog visible={deleteAdmProfileDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteAdmProfileDialogFooter} onHide={hideDeleteAdmProfileDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {admProfile && (
                            <span>
                                Tem certeza de que deseja excluir <b>{admProfile.description}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteAdmProfilesDialog} style={{ width: '450px' }} header="Confirm" modal 
                    footer={deleteAdmProfilesDialogFooter} onHide={hideDeleteAdmProfilesDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {admProfile && <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>}
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default AdmProfilePage;
