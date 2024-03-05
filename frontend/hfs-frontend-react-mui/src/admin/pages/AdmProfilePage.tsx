'use client';
import React, { useEffect, useState } from 'react';
import AdmProfileService from '../service/AdmProfileService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '../api/AdmProfile';
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
import { AdmPage } from '../api/AdmPage';
import AdmPageService from '../service/AdmPageService';
import PickListComponent from '../../base/components/PickList';
  
const AdmProfilePage = () => {

    const admProfileService = new AdmProfileService();
    const admPageService = new AdmPageService();

    const [listaAdmProfile, setListaAdmProfile] = useState<AdmProfile[]>([]);
    const [admProfileDialog, setAdmProfileDialog] = useState<boolean>(false);
    const [deleteAdmProfileDialog, setDeleteAdmProfileDialog] = useState<boolean>(false);
    const [deleteAdmProfilesDialog, setDeleteAdmProfilesDialog] = useState<boolean>(false);
    const [admProfile, setAdmProfile] = useState<AdmProfile>(emptyAdmProfile); 
    const [selectedAdmProfiles, setSelectedAdmProfiles] = useState<AdmProfile[]>([]);

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
  
    const [sourcePages, setSourcePages] = useState<AdmPage[]>([]);
    const [targetPages, setTargetPages] = useState<AdmPage[]>([]);

    useEffect(() => {
        loading = true;
        admProfileService.findAll().then(item => {            
            setListaAdmProfile(item);
            loading = false;
        });

        setColumns([
            { field: 'id', headerName: 'Id', sortable: true, width: 50 },
            { field: 'description', headerName: 'Descrição', sortable: true, flex: 1 },
            { field: 'profilePages', headerName: 'Páginas(s) do perfil', sortable: true, flex: 1 },
            { field: '', headerName: "", type: "string", width: 50, renderCell: renderActionsCell },
        ]);

    }, [loading]);

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
    
    const onEdit = () => {
        setAdmProfile({ ...admProfile });
        setAdmProfileDialog(true);
        loadAdmPages(admProfile);
        onToggleMenuClose();
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
                    
                    if (admProfile.id){
                        const index = admProfileService.findIndexById(listaAdmProfile, admProfile.id);
                        _listaAdmProfile[index] = _admProfile;
                        
                        setListaAdmProfile(_listaAdmProfile);
                        enqueueSnackbar('Perfil Atualizado', { variant: "success", transitionDuration: 3000 });
                    }
                });
            } else {
                admProfileService.insert(admProfile).then((obj: AdmProfile) => {
                    _admProfile = obj;
                    _listaAdmProfile.push(_admProfile);
                    setListaAdmProfile(_listaAdmProfile);
                    enqueueSnackbar('Perfil Criado', { variant: "success", transitionDuration: 3000 });
                });
            }
            
            setAdmProfileDialog(false);
            setAdmProfile(emptyAdmProfile);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmProfilesDialog(true);
    }
  
    const onDelete = () => {
        setDeleteAdmProfileDialog(true);
        setAdmProfile({ ...admProfile });
        onToggleMenuClose();
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteAdmProfilesDialog(false);
        setListaAdmProfile(listaAdmProfile.filter(val => !selectedAdmProfiles.includes(val)));
  
        let excluiu = false;
        selectedAdmProfiles.forEach((item) => {
            if (item.id){
                admProfileService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            enqueueSnackbar('Perfis excluídos', { variant: "success", transitionDuration: 3000 });
            setSelectedAdmProfiles([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmProfileDialog(false);
        if (admProfile.id){
            admProfileService.delete(admProfile.id).then(() => {
                setListaAdmProfile(listaAdmProfile.filter(val => val.id !== admProfile.id));
                setAdmProfile(emptyAdmProfile); 
                enqueueSnackbar('Perfil excluído', { variant: "success", transitionDuration: 3000 });
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
        admProfileService.report(reportParamForm).then(() => {
            enqueueSnackbar('Perfil exportada', { variant: "success", transitionDuration: 3000 });
        });
    }

    const onDescriptionInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.currentTarget.value) || '';
        let _admProfile = { ...admProfile };
        _admProfile.description = val;

        setAdmProfile(_admProfile);
    };

    function handleFilterChange(filterModel: GridFilterModel) {
      if (!filterModel.quickFilterValues?.length) {
        return setOptions({ ...options, search: "" });
      }
  
      const search = filterModel.quickFilterValues.join("");
      setOptions({ ...options, search });
    }
    
    const onToggleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, admProfile: AdmProfile) => {
        setAnchorEl(event.currentTarget);
        setAdmProfile({ ...admProfile });
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
        let lista: AdmProfile[] = [];

        if (rowSelectionModel.length > 0){            
            lista = listaAdmProfile.filter(val => {
                if (val.id){
                    return rowSelectionModel.includes(val.id);
                }
            });
        }
        
        setSelectedAdmProfiles(lista);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card" style={mostrarListar()}>
                    <Card className="p-mb-2">
                        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Perfil</Typography>
                        <CardContent>
                            <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e)}></ReportPanelComponent>
                        </CardContent>
                    </Card>
                    <Toolbar className="mb-4">
                        <div className="my-2">
                            <Button startIcon={<AddIcon />} variant="contained" color="success" sx={{marginRight: '10px'}} onClick={onInsert}>Adicionar</Button>
                            <Button startIcon={<DeleteIcon />} variant="contained" color="error" onClick={deleteSelected}
                                disabled={!selectedAdmProfiles || !(selectedAdmProfiles as any).length} >Excluir</Button>
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
                        rows={listaAdmProfile}
                        rowCount={listaAdmProfile.length}                        
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
                            <TextField id="description" label="Descrição" variant="outlined" required 
                                    sx={{marginTop: '10px', marginBottom: '10px'}}
                                    value={admProfile.description} onChange={(e) => onDescriptionInputChange(e)} />
                            {submitted && !admProfile.description && <small style={{color: "red"}}>A descrição é obrigatória.</small>}
                        </FormControl>

                        <label htmlFor="pageProfiles">Página(s):</label>
                        <PickListComponent source={sourcePages} target={targetPages} ></PickListComponent>

                    </div>
                </div>

                <Dialog open={deleteAdmProfileDialog} onClose={hideDeleteAdmProfileDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir <b>{admProfile.description}</b>?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteAdmProfileDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteAdmProfilesDialog} onClose={hideDeleteAdmProfilesDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir os perfis selecionados?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteAdmProfilesDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDeleteSelected}>Sim</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
};

export default AdmProfilePage;
