'use client';
import React, { useEffect, useState } from 'react';
import AdmPageService from '../service/AdmPageService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '../api/AdmPage';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import ReportPanelComponent from '../../base/components/ReportPanel';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
import { DataGrid, GridColDef, GridFilterModel, GridRenderCellParams, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, MenuItem, Menu, SelectChangeEvent } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import { AdmProfile } from '../api/AdmProfile';
import AdmProfileService from '../service/AdmProfileService';
import PickListComponent from '../../base/components/PickList';
  
const AdmPagePage = () => {

    const admPageService = new AdmPageService();
    const admProfileService = new AdmProfileService();

    const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
    const [admPageDialog, setAdmPageDialog] = useState<boolean>(false);
    const [deleteAdmPageDialog, setDeleteAdmPageDialog] = useState<boolean>(false);
    const [deleteAdmPagesDialog, setDeleteAdmPagesDialog] = useState<boolean>(false);
    const [admPage, setAdmPage] = useState<AdmPage>(emptyAdmPage); 
    const [selectedAdmPages, setSelectedAdmPages] = useState<AdmPage[]>([]);

    const [submitted, setSubmitted] = useState(false);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const { enqueueSnackbar } = useSnackbar();
    const [options, setOptions] = useState({ page: 0, search: "", perPage: 10, rowsPerPage: [10, 30, 50, 100, 150, 200] });

    let loading = false;
    const [columns, setColumns] = useState<GridColDef[]>([]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openToggle = Boolean(anchorEl);
  
    const [sourceProfiles, setSourceProfiles] = useState<AdmProfile[]>([]);
    const [targetProfiles, setTargetProfiles] = useState<AdmProfile[]>([]);

    useEffect(() => {
        loading = true;
        admPageService.findAll().then(item => {            
            setListaAdmPage(item);
            loading = false;
        });

        setColumns([
            { field: 'id', headerName: 'Id', sortable: true, width: 50 },
            { field: 'url', headerName: 'Página', sortable: true, flex: 1 },
            { field: 'description', headerName: 'Descrição', sortable: true, flex: 1 },
            { field: 'pageProfiles', headerName: 'Perfil(s) da página', sortable: true, flex: 1 },
            { field: '', headerName: "", type: "string", width: 50, renderCell: renderActionsCell },
        ]);

    }, [loading]);

    const loadAdmProfiles = (page: AdmPage) => {
        setTargetProfiles([]);
        if (page.id != null) {
            admProfileService.findProfilesByPage(page).then(item => {
                setTargetProfiles(item);

                admProfileService.findAll().then(profiles => {
                    setSourceProfiles(profiles.filter(profile => !item.find(target => target.id === profile.id)));
                });

            });
        } else {
            admProfileService.findAll().then(profiles => setSourceProfiles(profiles));
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
        loadAdmProfiles(cleanAdmPage);
    }

    const onInsert = () => {
        setAdmPage(emptyAdmPage);
        setSubmitted(false);
        setAdmPageDialog(true);
        loadAdmProfiles(emptyAdmPage);
    }
    
    const onEdit = () => {
        setAdmPage({ ...admPage });
        setAdmPageDialog(true);
        loadAdmProfiles(admPage);
        onToggleMenuClose();
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
            if (item.id){
                admPage.admIdProfiles.push(item.id);
            }
        });

        if (admPage.description.trim()) {
            let _listaAdmPage = [...listaAdmPage];
            let _admPage = {...admPage};

            if (admPage.id) {
                admPageService.update(admPage).then((obj: AdmPage) => {
                    _admPage = obj;
                    
                    if (admPage.id){
                        const index = admPageService.findIndexById(listaAdmPage, admPage.id);
                        _listaAdmPage[index] = _admPage;
                        
                        setListaAdmPage(_listaAdmPage);
                        enqueueSnackbar('Página Atualizada', { variant: "success", transitionDuration: 3000 });
                    }
                });
            } else {
                admPageService.insert(admPage).then((obj: AdmPage) => {
                    _admPage = obj;
                    _listaAdmPage.push(_admPage);
                    setListaAdmPage(_listaAdmPage);
                    enqueueSnackbar('Página Criada', { variant: "success", transitionDuration: 3000 });
                });
            }
            
            setAdmPageDialog(false);
            setAdmPage(emptyAdmPage);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmPagesDialog(true);
    }
  
    const onDelete = () => {
        setDeleteAdmPageDialog(true);
        setAdmPage({ ...admPage });
        onToggleMenuClose();
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmPagesDialog(false);
        setListaAdmPage(listaAdmPage.filter(val => !selectedAdmPages.includes(val)));
  
        let excluiu = false;
        selectedAdmPages.forEach((item) => {
            if (item.id){
                admPageService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            enqueueSnackbar('Páginas excluídas', { variant: "success", transitionDuration: 3000 });
            setSelectedAdmPages([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmPageDialog(false);
        if (admPage.id){
            admPageService.delete(admPage.id).then(() => {
                setListaAdmPage(listaAdmPage.filter(val => val.id !== admPage.id));
                setAdmPage(emptyAdmPage); 
                enqueueSnackbar('Página excluída', { variant: "success", transitionDuration: 3000 });
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
        admPageService.report(reportParamForm).then(() => {
            enqueueSnackbar('Página exportada', { variant: "success", transitionDuration: 3000 });
        });
    }

    const onUrlInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _admPage = { ...admPage };
        _admPage.url = val;

        setAdmPage(_admPage);
    }

    const onDescriptionInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.currentTarget.value) || '';
        let _admPage = { ...admPage };
        _admPage.description = val;

        setAdmPage(_admPage);
    };

    function handleFilterChange(filterModel: GridFilterModel) {
      if (!filterModel.quickFilterValues?.length) {
        return setOptions({ ...options, search: "" });
      }
  
      const search = filterModel.quickFilterValues.join("");
      setOptions({ ...options, search });
    }
    
    const onToggleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, admPage: AdmPage) => {
        setAnchorEl(event.currentTarget);
        setAdmPage({ ...admPage });
    }

    const onToggleMenuClose = () => {
        setAnchorEl(null);
    };
    
    function renderActionsCell(params: GridRenderCellParams) {
        return (
            <div>
                <IconButton                
                id="popup-button"
                aria-controls={openToggle ? 'popup-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openToggle ? 'true' : undefined}
                onClick={(e) => onToggleMenuClick(e, params.row)}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>
        );
    }
    
    function handleRowSelectionModelChange(rowSelectionModel: GridRowSelectionModel): void {
        let lista: AdmPage[] = [];

        if (rowSelectionModel.length > 0){            
            lista = listaAdmPage.filter(val => {
                if (val.id){
                    return rowSelectionModel.includes(val.id);
                }
            });
        }
        
        setSelectedAdmPages(lista);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card" style={mostrarListar()}>
                    <Card className="p-mb-2">
                        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Página</Typography>
                        <CardContent>
                            <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e)}></ReportPanelComponent>
                        </CardContent>
                    </Card>
                    <Toolbar className="mb-4">
                        <div className="my-2">
                            <Button startIcon={<AddIcon />} variant="contained" color="success" sx={{marginRight: '10px'}} onClick={onInsert}>Adicionar</Button>
                            <Button startIcon={<DeleteIcon />} variant="contained" color="error" onClick={deleteSelected}
                                disabled={!selectedAdmPages || !(selectedAdmPages as any).length} >Excluir</Button>
                        </div>
                        <span style={{flex: "1 1 auto"}}></span>
                        <Button startIcon={<UploadIcon />} variant="contained" onClick={onExport}>Exportar</Button>
                    </Toolbar>

                    <Menu id="popup-menu" anchorEl={anchorEl} open={openToggle} onClose={onToggleMenuClose}
                        MenuListProps={{
                        'aria-labelledby': 'popup-button',
                        }}
                    >
                        <MenuItem onClick={onEdit}>Editar</MenuItem>
                        <MenuItem onClick={onDelete}>Excluir</MenuItem>
                    </Menu>

                    <DataGrid
                        rows={listaAdmPage}
                        rowCount={listaAdmPage.length}                        
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: options.page, pageSize: options.perPage } } }}
                        pageSizeOptions={options.rowsPerPage}                  
                        loading={loading}
                        checkboxSelection={true}
                        disableColumnFilter={false}
                        disableColumnSelector={true}
                        disableDensitySelector={true}
                        disableRowSelectionOnClick={true}
                        onFilterModelChange={handleFilterChange}
                        onRowSelectionModelChange={handleRowSelectionModelChange}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                              },                                              
                        }}
                    />
                </div>
                
                <div className="card" style={mostrarEditar()}>

                    <Toolbar className="mb-4">
                        <span style={{flex: "1 1 auto"}}></span>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDialog}> Cancelar</Button>
                        <Button startIcon={<StarIcon />} variant="contained" sx={{marginRight: "10px;"}}
                            onClick={onClean}> Limpar</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={onSave}> Salvar</Button>
                    </Toolbar>        
    
                    <div className="card p-fluid">
    
                        <FormControl sx={{ width: '100%' }}>
                            <TextField id="code" label="Página" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                value={admPage.url} onChange={(e) => onUrlInputChange(e)} required />
                            {submitted && !admPage.url && <small style={{color: "red"}}>A página é obrigatória.</small>}
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField id="description" label="Descrição" variant="outlined" required 
                                    sx={{marginTop: '10px', marginBottom: '10px'}}
                                    value={admPage.description} onChange={(e) => onDescriptionInputChange(e)} />
                            {submitted && !admPage.description && <small style={{color: "red"}}>A descrição é obrigatória.</small>}
                        </FormControl>

                        <label htmlFor="pageProfiles">Perfil(s) da página:</label>
                        <PickListComponent source={sourceProfiles} target={targetProfiles} ></PickListComponent>

                    </div>
                </div>

                <Dialog open={deleteAdmPageDialog} onClose={hideDeleteAdmPageDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir <b>{admPage.description}</b>?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteAdmPageDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteAdmPagesDialog} onClose={hideDeleteAdmPagesDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir os parâmetros selecionados?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteAdmPagesDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDeleteSelected}>Sim</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
};

export default AdmPagePage;
