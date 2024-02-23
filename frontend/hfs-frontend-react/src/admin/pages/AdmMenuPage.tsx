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
import AdmMenuService from '../service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../api/AdmMenu';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { TreeNode } from 'primereact/treenode';
import { NodeOnSelectEventType, emptyTreeNode } from '../../base/models/NodeOnSelectEventType';
import AdmPageService from '../service/AdmPageService';
import { AdmPage } from '../api/AdmPage';
import { Tree } from 'primereact/tree';

const AdmMenuPage = () => {

    const admMenuService = new AdmMenuService();
    const admPageService = new AdmPageService();

    const [listaAdmMenu, setListaAdmMenu] = useState<AdmMenu[]>([]);
    const [admMenuDialog, setAdmMenuDialog] = useState<boolean>(false);
    const [deleteAdmMenuDialog, setDeleteAdmMenuDialog] = useState<boolean>(false);
    const [deleteAdmMenusDialog, setDeleteAdmMenusDialog] = useState<boolean>(false);
    const [admMenu, setAdmMenu] = useState<AdmMenu>(emptyAdmMenu); 
    const [selectedAdmMenu, setSelectedAdmMenu] = useState<AdmMenu>(emptyAdmMenu);

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [, setExportColumns] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);  
    
    const [listaNodeMenu, setListaNodeMenu] = useState<TreeNode[]>([]);
    const [selectedNodeMenu, setSelectedNodeMenu] = useState<TreeNode>(emptyTreeNode);
    const [menuRoot, setMenuRoot] = useState<TreeNode>(emptyTreeNode);
    const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
    const [listaAdmMenuParent, setListaAdmMenuParent] = useState<AdmMenu[]>([]);

    useEffect(() => {
        atualizarArvore();

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Description' }
          ]);
      
          setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
      
    }, []);

    const atualizarArvore = () => {
        setListaNodeMenu([]);
        setListaAdmMenu([]);
        setListaAdmMenuParent([]);
        
        admPageService.findAll().then(data => setListaAdmPage(data));      
    
        admMenuService.findAll().then(data => {
            setListaAdmMenu(data);
    
            setListaAdmMenuParent(listaAdmMenu.filter(menu => menu.idMenuParent == null));
    
            updateMenusTree(listaAdmMenu);
        });
    }
    
    const updateMenusTree = (listaAdmMenu: AdmMenu[]) => {
        setListaNodeMenu([]);
        setMenuRoot({
          'label': 'Menu do sistema',
          'data': '0',
          'children': []
        });
    
        listaAdmMenu.forEach((itemMenu: AdmMenu) => {
            const m: TreeNode = {};
            m.data = itemMenu;
            m.label = itemMenu.description;      

            if (itemMenu.idPage === null) {
                m.children = mountSubMenu(itemMenu);
                menuRoot.children.push(m);
            }
        });
    
        listaNodeMenu.push(menuRoot);
    
        expandAll();
    }
    
    const isSubMenu = (menu: AdmMenu): boolean => {
        return menu.idPage === null;
    }
    
    const getAdmSubMenus = (menuPai: AdmMenu): AdmMenu[] => {
        return listaAdmMenu.filter(menu => menu.idMenuParent === menuPai.id);
    }
    
    const mountSubMenu = (menu: AdmMenu): TreeNode[] => {
        const lstSubMenu: TreeNode[] = [];
    
        getAdmSubMenus(menu).forEach((subMenu: AdmMenu) => {    
            if (isSubMenu(subMenu)) {
                const m: TreeNode = {};
                m.data = subMenu;
                m.label = subMenu.description;
                m.children = mountSubMenu(subMenu);
            } else {
                const m: TreeNode = {};
                m.data = subMenu;
                m.label = subMenu.description;
                lstSubMenu.push(m);
            }
        });
    
        return lstSubMenu;
    }
    
    const nodeSelect = (event: NodeOnSelectEventType) => {
        setSelectedAdmMenu(event.node.data as AdmMenu);
        setSelectedNodeMenu(event.node);
    }

    const onInsert = () => {
        setAdmMenu(emptyAdmMenu);
        setSubmitted(false);
        setAdmMenuDialog(true);
    }
    
    const onEdit = () => {
        let admMenu: AdmMenu = selectedAdmMenu;

        setAdmMenu({ ...admMenu });
        setAdmMenuDialog(true);
    }
    
    const onDelete = () => {
        let admMenu: AdmMenu = selectedAdmMenu;

        setDeleteAdmMenuDialog(true);
        setAdmMenu({ ...admMenu });
    } 
  
    const confirmDelete = () => {
        let admMenu: AdmMenu = selectedAdmMenu;

        setDeleteAdmMenuDialog(false);
        admMenuService.delete(admMenu.id).then(obj => {
            setListaAdmMenu(listaAdmMenu.filter(val => val.id !== admMenu.id));
            setAdmMenu(emptyAdmMenu); 
            updateMenusTree(listaAdmMenu);
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Menu excluído', life: 3000 });
        });
    }

    const hideDialog = () => {
        setAdmMenuDialog(false);
        setSubmitted(false);
    }

    const onSave = () => {
        setSubmitted(true);
        if (admMenu.admPage!=null){
            admMenu.idPage = admMenu.admPage.id;
        }
        if (admMenu.admMenuParent!=null){
            admMenu.idMenuParent = admMenu.admMenuParent.id;
        }      
    
        if (admMenu.description.trim()) {
            let _listaAdmMenu = [...listaAdmMenu];
            let _admMenu = {...admMenu};

            if (admMenu.id) {
                admMenuService.update(admMenu).then((obj: AdmMenu) => {
                    _admMenu = obj;

                    selectedNodeMenu.label = admMenu.description;
                    selectedNodeMenu.data = admMenu;
                    
                    const index = admMenuService.findIndexById(listaAdmMenu, admMenu.id);
                    _listaAdmMenu[index] = _admMenu;
                    setListaAdmMenu(_listaAdmMenu);

                    setAdmMenuDialog(false);
                    setAdmMenu(emptyAdmMenu);        
                    updateMenusTree(listaAdmMenu);
        
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Menu Atualizado', life: 3000 });                    
                });
            } else {
                admMenuService.insert(admMenu).then((obj: AdmMenu) => {
                    _admMenu = obj;
                    _listaAdmMenu.push(_admMenu);
                    setListaAdmMenu(_listaAdmMenu);

                    setListaAdmMenuParent(listaAdmMenu.filter(menu => menu.idMenuParent == null));

                    setAdmMenuDialog(false);
                    setAdmMenu(emptyAdmMenu);        
                    updateMenusTree(listaAdmMenu);

                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Menu Criado', life: 3000 });
                });
            }
            
        }
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
        admMenuService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Menu exportado', 
            detail: 'Menu exportada', life: 3000 });
        });
    }

    const expandAll = () => {
        listaNodeMenu.forEach((node) => {
            expandRecursive(node, true);
        });
    }

    const collapseAll = () => {
        listaNodeMenu.forEach((node) => {
            expandRecursive(node, false);
        });
    } 

    const expandRecursive = (node: TreeNode, isExpand: boolean) => {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode) => {
                expandRecursive(childNode, isExpand);
            });
        }
    }

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admMenu = { ...admMenu };
        _admMenu.description = val;

        setAdmMenu(_admMenu);
    };

    const onOrderInputNumberChange = (e: InputNumberValueChangeEvent) => {
        const val = e.value || 0;
        let _admMenu = { ...admMenu };
        _admMenu.order = val;

        setAdmMenu(_admMenu);
    };

    const hideDeleteAdmMenuDialog = () => {
        setDeleteAdmMenuDialog(false);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className="mr-2" onClick={onInsert} />
                    <Button label="Editar" icon="pi pi-pencil" severity="warning" className="mr-2" onClick={onEdit} 
                        disabled={!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={onDelete} 
                        disabled={!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Expandir todos"  className="mr-2" onClick={expandAll} />
                <Button label="Recolher todos" className="mr-2" onClick={collapseAll} />

                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={onExport} />
            </React.Fragment>
        );
    };

    const admMenuDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={onSave} />
        </>
    );

    const deleteAdmMenuDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAdmMenuDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={confirmDelete} />
        </>
    );
    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Panel header="Menu de configuração" className="p-mb-2">
                        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
                            forceDownloadChange={e => onChangedForceDownload(e.checked)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <Tree value={listaNodeMenu} selectionMode="single" selectionKeys={selectedNodeMenu} emptyMessage="Nenhum resultado encontrado" 
                        onSelectionChange={e => setSelectedNodeMenu(e.value)} onSelect={node => nodeSelect(node)} />

                    <Dialog visible={admMenuDialog} style={{ width: '450px' }} header="Detalhes do menu" modal className="p-fluid" 
                        footer={admMenuDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={admMenu.description} onChange={(e) => onDescriptionInputChange(e)} 
                                required rows={3} cols={20} 
                                className={classNames({'p-invalid': submitted && !admMenu.description})}
                            />
                            {submitted && !admMenu.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="order">Ordem</label>
                            <InputNumber id="order" value={admMenu.order} locale="pt-BR" onValueChange={(e) => onOrderInputNumberChange(e)} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAdmMenuDialog} style={{ width: '450px' }} header="Confirm" modal 
                        footer={deleteAdmMenuDialogFooter} onHide={hideDeleteAdmMenuDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {admMenu && (
                                <span>
                                    Tem certeza de que deseja excluir <b>{admMenu.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AdmMenuPage;
