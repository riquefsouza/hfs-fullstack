/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdmMenuService from '../service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../api/AdmMenu';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import { Panel } from 'primereact/panel';
import ReportPanelComponent from '../../base/components/ReportPanel';
import { TreeNode } from 'primereact/treenode';
import { emptyTreeNode } from '../../base/models/NodeOnSelectEventType';
import AdmPageService from '../service/AdmPageService';
import { AdmPage } from '../api/AdmPage';
import { Tree, TreeEventNodeEvent, TreeExpandedKeysType, TreeSelectionEvent } from 'primereact/tree';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { CheckboxChangeEvent } from 'primereact/checkbox';

const AdmMenuPage = () => {

    const [admMenuService,] = useState<AdmMenuService>(new AdmMenuService());
    const [admPageService,] = useState<AdmPageService>(new AdmPageService());

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
    
    const [selectedNodeMenu, setSelectedNodeMenu] = useState<TreeNode>();
    const [listaNodeMenu, setListaNodeMenu] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({'0': true, '0-0': true});
    const [selectedKey, setSelectedKey] = useState<string>('');
    const [menuRoot, setMenuRoot] = useState<TreeNode>(emptyTreeNode);
    const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
    const [listaAdmMenuParent, setListaAdmMenuParent] = useState<AdmMenu[]>([]);    

    const mountSubMenu = useCallback((listaMenu: AdmMenu[], menu: AdmMenu): TreeNode[] => {
        let lstSubMenu: TreeNode[] = [];

        getAdmSubMenus(listaMenu, menu).forEach((subMenu: AdmMenu) => {

            if (isSubMenu(subMenu)) {
                const m: TreeNode = {
                    'key': subMenu.id?.toString(),
                    'label': subMenu.description,
                    'data': subMenu,
                    'children': mountSubMenu(listaMenu, subMenu)
                };
            } else {
                const m: TreeNode = {
                    'key': subMenu.id?.toString(),
                    'label': subMenu.description,
                    'data': subMenu,
                    'children': []
                };
                lstSubMenu.push(m);
            }

        });

        return lstSubMenu;
    }, []);

    const expandNode = useCallback((node: TreeNode, _expandedKeys: TreeExpandedKeysType) => {
        if (node.children && node.children.length) {
            if (node.key){
                _expandedKeys[node.key] = true;

                for (let child of node.children) {
                    expandNode(child, _expandedKeys);
                }    
            }
        }
    }, []);

    const collapseAll = () => {
        setExpandedKeys({});
    };

    const expandAll = useCallback(() => {
        let _expandedKeys = {};

        for (let node of listaNodeMenu) {
            expandNode(node, _expandedKeys);
        }

        setExpandedKeys(_expandedKeys);
    }, [expandNode, listaNodeMenu]);

    const updateMenusTree = useCallback((listaMenu: AdmMenu[]): void => {
        const _listaNodeMenu: TreeNode[] = [];
        let _listaAdmMenuParent: AdmMenu[] = [];
        const menuRoot: TreeNode = {
            'label': 'Menu do sistema',
            'data': '0',
            'children': []
        };

        _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);

        _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
            const m: TreeNode = {
                'key' : itemMenu.id?.toString(),
                'label': itemMenu.description,
                'data': itemMenu,
                'children': mountSubMenu(listaMenu, itemMenu)
            };
            if (menuRoot.children){
                menuRoot.children.push(m);
            }            
        });

        _listaNodeMenu.push(menuRoot);

        setListaNodeMenu(_listaNodeMenu);

        expandAll();
    }, [expandAll, mountSubMenu]);

    const atualizarArvore = useCallback(() => {
        setListaNodeMenu([]);
        setListaAdmMenu([]);
        setListaAdmMenuParent([]);
        
        admPageService.findAll().then(data => setListaAdmPage(data));
    
        admMenuService.findAll().then(data => {
            setListaAdmMenu(data);
    
            setListaAdmMenuParent(data.filter(menu => menu.idMenuParent == null));
    
            updateMenusTree(data);
        });
    }, [admMenuService, admPageService, updateMenusTree]);

    useEffect(() => {
        atualizarArvore();

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Description' }
          ]);
      
          setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));
      
    }, [atualizarArvore, cols]);

    const isSubMenu = (menu: AdmMenu): boolean => {
        return menu.idPage === null;
    }

    const getAdmSubMenus = (listaMenu: AdmMenu[], menuPai: AdmMenu): AdmMenu[] => {
        return listaMenu.filter(menu => menu.idMenuParent === menuPai.id);
    }

    const onSelect = (event: TreeEventNodeEvent) => {
        const _menu: AdmMenu = event.node.data as AdmMenu;
        setSelectedAdmMenu(_menu);
        setSelectedNodeMenu(event.node);
    };

    const onInsert = () => {
        setAdmMenu(emptyAdmMenu);
        setSubmitted(false);
        setAdmMenuDialog(true);
    }
    
    const onEdit = (admMenu: AdmMenu) => {
        setAdmMenu({ ...admMenu });
        setAdmMenuDialog(true);
    }
    
    const onDelete = (admMenu: AdmMenu) => {
        setDeleteAdmMenuDialog(true);
        setAdmMenu({ ...admMenu });
    } 
  
    const confirmDelete = () => {
        let admMenu: AdmMenu = selectedAdmMenu;

        setDeleteAdmMenuDialog(false);
        if (admMenu.id){
            admMenuService.delete(admMenu.id).then(obj => {
                setListaAdmMenu(listaAdmMenu.filter(val => val.id !== admMenu.id));
                setAdmMenu(emptyAdmMenu); 
                updateMenusTree(listaAdmMenu);
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Menu excluído', life: 3000 });
            });    
        }
    }

    const hideDialog = () => {
        setAdmMenuDialog(false);
        setSubmitted(false);
    }

    const onSave = () => {
        setSubmitted(true);
        if (admMenu.admPage!=null){
            if (admMenu.admPage.id){
                admMenu.idPage = admMenu.admPage.id;
            }            
        }
        if (admMenu.admMenuParent!=null){
            if (admMenu.admMenuParent.id){
                admMenu.idMenuParent = admMenu.admMenuParent.id;
            }
        }      
    
        if (admMenu.description.trim()) {
            let _listaAdmMenu = [...listaAdmMenu];
            let _admMenu = {...admMenu};

            if (admMenu.id) {
                admMenuService.update(admMenu).then((obj: AdmMenu) => {
                    _admMenu = obj;

                    //selectedNodeMenu.label = admMenu.description;
                    //selectedNodeMenu.data = admMenu;
                    if (admMenu.id){
                        const index = admMenuService.findIndexById(listaAdmMenu, admMenu.id);
                        _listaAdmMenu[index] = _admMenu;
                        setListaAdmMenu(_listaAdmMenu);
    
                        setAdmMenuDialog(false);
                        setAdmMenu(emptyAdmMenu);        
                        updateMenusTree(listaAdmMenu);
            
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Menu Atualizado', life: 3000 });    
                    }
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
    
    const onChangedForceDownload = (event: CheckboxChangeEvent) => {
        const forceDownload = event.checked;
        if (forceDownload){
            setSelectedForceDownload(forceDownload);
            setReportParamForm({ reportType: selectedTypeReport.type, 
              forceDownload: forceDownload });    
        }
    }
    
    const onExport = () => {
        admMenuService.report(reportParamForm).then(() => {
          toast.current?.show({ severity: 'info', summary: 'Menu exportado', 
            detail: 'Menu exportada', life: 3000 });
        });
    }

    const onAdmPageChange = (e: DropdownChangeEvent) => {
        const val: any = e.value;
        let _admMenu = { ...admMenu };
        _admMenu.admPage = val;

        setAdmMenu(_admMenu);
    }

    const onAdmMenuParentChange = (e: DropdownChangeEvent) => {
        const val: any = e.value;
        let _admMenu = { ...admMenu };
        _admMenu.admMenuParent = val;

        setAdmMenu(_admMenu);
    }

    const onDescriptionInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _admMenu = { ...admMenu };
        _admMenu.description = val;

        setAdmMenu(_admMenu);
    }

    const onOrderInputNumberChange = (e: InputNumberValueChangeEvent) => {
        const val = e.value || 0;
        let _admMenu = { ...admMenu };
        _admMenu.order = val;

        setAdmMenu(_admMenu);
    };

    const hideDeleteAdmMenuDialog = () => {
        setDeleteAdmMenuDialog(false);
    };

    const onSelectionChange = (event: TreeSelectionEvent) => {
        setSelectedKey(event.value as string);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" severity="success" className="mr-2" onClick={onInsert} />
                    <Button label="Editar" icon="pi pi-pencil" severity="warning" className="mr-2" onClick={() => onEdit(selectedAdmMenu)}
                        disabled={!selectedNodeMenu}></Button>
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={() => onDelete(selectedAdmMenu)} 
                        disabled={!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length}></Button>
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
                            forceDownloadChange={e => onChangedForceDownload(e)}
                        ></ReportPanelComponent>
                    </Panel>

                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <Tree value={listaNodeMenu} selectionMode="single" selectionKeys={selectedKey} onSelectionChange={(e) => onSelectionChange(e)} 
                        onSelect={onSelect} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} />

                    <Dialog visible={admMenuDialog} style={{ width: '450px' }} header="Detalhes do menu" modal className="p-fluid" 
                        footer={admMenuDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="admPage">Página:</label>
                            <Dropdown id="admPage" value={admMenu.admPage} options={listaAdmPage} 
                                onChange={(e) => onAdmPageChange(e)} optionLabel="description">
                            </Dropdown>
                        </div>
                        <div className="field">
                            <label htmlFor="description">Nome do menu:</label>
                            <InputText id="description" value={admMenu.description} onChange={(e) => onDescriptionInputChange(e)}
                                required className={classNames({'p-invalid': submitted && !admMenu.description})}
                            />
                            {submitted && !admMenu.description && <small className="p-invalid">O nome do menu é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="admMenuParent">Menu pai:</label>
                            <Dropdown id="admMenuParent" value={admMenu.admMenuParent} options={listaAdmMenuParent} 
                                onChange={(e) => onAdmMenuParentChange(e)} optionLabel="description">
                            </Dropdown>
                        </div>
                        <div className="field">
                            <label htmlFor="order">Ordem</label>
                            <InputNumber id="order" value={admMenu.order} locale="pt-BR" onValueChange={(e) => onOrderInputNumberChange(e)} 
                                required className={classNames({'p-invalid': submitted && !admMenu.order})}
                            />
                            {submitted && !admMenu.order && <small className="p-invalid">A ordem é obrigatória.</small>}
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
