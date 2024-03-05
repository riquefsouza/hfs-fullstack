'use client';
import React, { useEffect, useState } from 'react';
import AdmMenuService from '../service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../api/AdmMenu';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import ReportPanelComponent from '../../base/components/ReportPanel';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { AdmPage } from '../api/AdmPage';
import { TreeNode } from '../../base/models/TreeNode';
import AdmPageService from '../service/AdmPageService';
  
const AdmMenuPage = () => {

    const admMenuService = new AdmMenuService();
    const admPageService = new AdmPageService();

    const [listaAdmMenu, setListaAdmMenu] = useState<AdmMenu[]>([]);
    const [admMenuDialog, setAdmMenuDialog] = useState<boolean>(false);
    const [deleteAdmMenuDialog, setDeleteAdmMenuDialog] = useState<boolean>(false);
    const [admMenu, setAdmMenu] = useState<AdmMenu>(emptyAdmMenu); 

    const [submitted, setSubmitted] = useState(false);
    const [cols, setCols] = useState<any[]>([]);
    const [, setExportColumns] = useState<any[]>([]);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const { enqueueSnackbar } = useSnackbar();

    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState<string>();
    const [selectedAdmMenu, setSelectedAdmMenu] = React.useState<AdmMenu>(emptyAdmMenu);

    //const [selectedNodeMenu, setSelectedNodeMenu] = useState<TreeNode>();
    const [listaNodeMenu, setListaNodeMenu] = useState<TreeNode[]>([]);
    const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
    const [listaAdmMenuParent, setListaAdmMenuParent] = useState<AdmMenu[]>([]);
      
    useEffect(() => {
        atualizarArvore();

        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Description' }
        ]);
      
        setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));

        expandAll();
    }, []);

    const atualizarArvore = () => {
        setListaNodeMenu([]);
        setListaAdmMenu([]);
        setListaAdmMenuParent([]);
        
        admPageService.findAll().then(data => setListaAdmPage(data));
    
        admMenuService.findAll().then(data => {
            setListaAdmMenu(data);
    
            setListaAdmMenuParent(data.filter(menu => menu.idMenuParent == null));
    
            updateMenusTree(data);
        });
    }

    const updateMenusTree = (listaMenu: AdmMenu[]): void => {
        const _listaNodeMenu: TreeNode[] = [];
        let _listaAdmMenuParent: AdmMenu[] = [];
        /*
        const menuRoot: TreeNode = {
            'label': 'Menu do sistema',
            'data': '0',
            'children': []
        };
        */
        _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);

        _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
            const m: TreeNode = {
                'key' : itemMenu.id?.toString(),
                'label': itemMenu.description,
                'data': itemMenu,
                'children': mountSubMenu(listaMenu, itemMenu)
            };
            /*
            if (menuRoot.children){
                menuRoot.children.push(m);
            }
            */

            _listaNodeMenu.push(m);
        });

        //_listaNodeMenu.push(menuRoot);        

        setListaNodeMenu(_listaNodeMenu);
        
        //expandAll();
    }

    const montaAllTreeItem = (): React.JSX.Element[]  => {
        let listaTreeItem: React.JSX.Element[] = [];

        listaNodeMenu.map((node) => (
            listaTreeItem.push(<TreeItem key={node.key} nodeId={node.key} label={node.label}>{montaTreeItem(node)}</TreeItem>)
        ));

        return listaTreeItem;
    };

    const montaTreeItem = (node: TreeNode) => {
        let listaTreeItem: React.JSX.Element[] = [];

        if (node.children && node.children.length) {
            node.children.forEach((child, index) => {    
                listaTreeItem.push(<TreeItem key={index} nodeId={child.key} label={child.label} />)
			});
        }
        return listaTreeItem;
    };

    const isSubMenu = (menu: AdmMenu): boolean => {
        return menu.idPage === null;
    }

    const getAdmSubMenus = (listaMenu: AdmMenu[], menuPai: AdmMenu): AdmMenu[] => {
        return listaMenu.filter(menu => menu.idMenuParent === menuPai.id);
    }

    const mountSubMenu = (listaMenu: AdmMenu[], menu: AdmMenu): TreeNode[] => {
        let lstSubMenu: TreeNode[] = [];

        getAdmSubMenus(listaMenu, menu).forEach((subMenu: AdmMenu) => {

            if (isSubMenu(subMenu)) {
                /*
                const m: TreeNode = {
                    'key': subMenu.id?.toString(),
                    'label': subMenu.description,
                    'data': subMenu,
                    'children': mountSubMenu(listaMenu, subMenu)
                };
                */
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
    }

    const onInsert = () => {
        setAdmMenu(emptyAdmMenu);
        setSubmitted(false);
        setAdmMenuDialog(true);
    }
    
    const onEdit = (admMenu: AdmMenu) => {
        setAdmMenu({ ...admMenu });
        setAdmMenuDialog(true);
    }
    
    const hideDialog = () => {
        setAdmMenuDialog(false);
        setSubmitted(false);
    }

    const hideDeleteAdmMenuDialog = () => {
        setDeleteAdmMenuDialog(false);
    };

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
                    
                    if (admMenu.id){
                        const index = admMenuService.findIndexById(listaAdmMenu, admMenu.id);
                        _listaAdmMenu[index] = _admMenu;
                        setListaAdmMenu(_listaAdmMenu);

                        setAdmMenuDialog(false);
                        setAdmMenu(emptyAdmMenu);        
                        updateMenusTree(listaAdmMenu);

                        enqueueSnackbar('Menu Atualizada', { variant: "success", transitionDuration: 3000 });
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

                    enqueueSnackbar('Menu Criado', { variant: "success", transitionDuration: 3000 });
                });
            }            
        }
    }
          
    const onDelete = (admMenu: AdmMenu) => {
        setDeleteAdmMenuDialog(true);
        setAdmMenu({ ...admMenu });
    } 
    
    const confirmDelete = () => {
        setDeleteAdmMenuDialog(false);
        if (admMenu.id){
            admMenuService.delete(admMenu.id).then(() => {
                setListaAdmMenu(listaAdmMenu.filter(val => val.id !== admMenu.id));
                setAdmMenu(emptyAdmMenu); 
                updateMenusTree(listaAdmMenu);
                enqueueSnackbar('Menu excluído', { variant: "success", transitionDuration: 3000 });
            });
        }
    }
  
    const onChangedTypeReport = (event: SelectChangeEvent) => {
        let typeReport: ItypeReport = event.target.value as unknown as ItypeReport;

        setSelectedTypeReport(typeReport);
        setReportParamForm({ reportType: typeReport.type, 
          forceDownload: selectedForceDownload });
    }
        
    const onExport = () => {
        admMenuService.report(reportParamForm).then(() => {
            enqueueSnackbar('Menu exportado', { variant: "success", transitionDuration: 3000 });
        });
    }
  
    const renderAdmPage = (): React.JSX.Element[] => {
        let elementosAdmPage: React.JSX.Element[] = [];

        listaAdmPage.forEach((item: AdmPage) => {
            elementosAdmPage.push(<MenuItem key={item.id} value={item.id}>{item.description}</MenuItem>);
        });

        return elementosAdmPage;
    }
	
    const onAdmPageChange = (e: SelectChangeEvent<number | null>) => {
        let val = e.target.value as number;
        let _admMenu = { ...admMenu };

        let indice = admPageService.findIndexById(listaAdmPage, val);
        _admMenu.admPage = listaAdmPage[indice];

        setAdmMenu(_admMenu);
    }    

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admMenu = { ...admMenu };
        _admMenu.description = val;

        setAdmMenu(_admMenu);
    };

    const renderAdmMenuParent = (): React.JSX.Element[] => {
        let elementosAdmMenuParent: React.JSX.Element[] = [];

        listaAdmMenuParent.forEach((item: AdmMenu) => {
            elementosAdmMenuParent.push(<MenuItem key={item.id} value={item.id}>{item.description}</MenuItem>);
        });

        return elementosAdmMenuParent;
    }
	
    const onAdmMenuParentChange = (e: SelectChangeEvent<number | null>) => {
        let val = e.target.value as number;
        let _admMenu = { ...admMenu };

        let indice = admMenuService.findIndexById(listaAdmMenuParent, val);
        _admMenu.admMenuParent = listaAdmMenuParent[indice];

        setAdmMenu(_admMenu);
    }    

    const onOrderInputNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        if (val.length > 0){
            let _admMenu = { ...admMenu };        
            _admMenu.order = parseInt(val);
    
            setAdmMenu(_admMenu);    
        }
    };
   
    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        if (nodeId.length > 0){
            let indice: number = admMenuService.findIndexById(listaAdmMenu, parseInt(nodeId));
            const _menu: AdmMenu = listaAdmMenu.at(indice);
            setSelectedAdmMenu(_menu);                        
            //setSelectedNodeMenu(event.node);
        }
    };
    
    const expandAll = () => {
        const ids: string[] = listaAdmMenuParent.map(item => item.id?.toString());

        setExpanded(ids);  
    };

    const collapseAll = () => {
        setExpanded([]);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Card className="p-mb-2">
                        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Categoria de parâmetro de configuração</Typography>
                        <CardContent>
                            <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e)}></ReportPanelComponent>
                        </CardContent>
                    </Card>
                    <Toolbar className="mb-4">
                        <div className="my-2">
                            <Button startIcon={<AddIcon />} variant="contained" color="success" sx={{marginRight: '10px'}} onClick={onInsert}>Adicionar</Button>
                            <Button startIcon={<EditIcon />} variant="contained" color="secondary" sx={{marginRight: '10px'}} onClick={() => onEdit(selectedAdmMenu)}
                                disabled={selectedAdmMenu === emptyAdmMenu} >Editar</Button>                                                        
                            <Button startIcon={<DeleteIcon />} variant="contained" color="error" onClick={() => onDelete(selectedAdmMenu)}
                                disabled={selectedAdmMenu === emptyAdmMenu} >Excluir</Button>
                        </div>
                        <span style={{flex: "1 1 auto"}}></span>
                        <Button variant="contained" sx={{marginRight: '10px'}} onClick={expandAll}>Expandir todos</Button>
                        <Button variant="contained" sx={{marginRight: '10px'}} onClick={collapseAll}>Recolher todos</Button>
                        <Button startIcon={<UploadIcon />} variant="contained" onClick={onExport}>Exportar</Button>
                    </Toolbar>

                    <TreeView
                        aria-label="controlled"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        expanded={expanded}
                        selected={selected}
                        onNodeToggle={handleToggle}
                        onNodeSelect={handleSelect}
                    >
                        {montaAllTreeItem()}
                    </TreeView>


                    <Dialog open={admMenuDialog} onClose={hideDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title">Detalhes do menu</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel htmlFor="admPage">Página</InputLabel>
                                    <Select value={admMenu.admPage && admMenu.admPage.id} id="admPage" label="Página" 
                                        onChange={e => onAdmPageChange(e)} >
                                            {renderAdmPage()}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="description" label="Nome do menu" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={admMenu.description} 
                                        onChange={(e) => onDescriptionInputChange(e)} />
                                </FormControl>
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel htmlFor="admMenuParent">Menu pai</InputLabel>
                                    <Select value={admMenu.admMenuParent && admMenu.admMenuParent.id} id="admMenuParent" label="Menu pai" 
                                        onChange={e => onAdmMenuParentChange(e)} >
                                            {renderAdmMenuParent()}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="order" label="Ordem" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={admMenu.order && admMenu.order.toString()} 
                                        onChange={(e) => onOrderInputNumberChange(e)} />
                                </FormControl>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDialog}> Cancelar</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={onSave}> Salvar</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={deleteAdmMenuDialog} onClose={hideDeleteAdmMenuDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <div className="flex align-items-center justify-content-center">
                                    <DeleteIcon style={{fontSize: "2rem"}} />
                                    <span>Tem certeza de que deseja excluir <b>{admMenu.description}</b>?</span>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDeleteAdmMenuDialog}>Não</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AdmMenuPage;
