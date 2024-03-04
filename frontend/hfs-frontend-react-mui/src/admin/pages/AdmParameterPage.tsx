'use client';
import React, { useEffect, useState } from 'react';
import AdmParameterService from '../service/AdmParameterService';
import { AdmParameter, emptyAdmParameter } from '../api/AdmParameter';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
import { DataGrid, GridColDef, GridFilterModel, GridRenderCellParams, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, MenuItem, InputLabel, Menu } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { AdmParameterCategory } from '../api/AdmParameterCategory';
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
  
const AdmParameterPage = () => {

    const admParameterService = new AdmParameterService();
    const admParameterCategoryService = new AdmParameterCategoryService();

    const [listaAdmParameter, setListaAdmParameter] = useState<AdmParameter[]>([]);
    const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
    const [admParameterDialog, setAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParameterDialog, setDeleteAdmParameterDialog] = useState<boolean>(false);
    const [deleteAdmParametersDialog, setDeleteAdmParametersDialog] = useState<boolean>(false);
    const [admParameter, setAdmParameter] = useState<AdmParameter>(emptyAdmParameter); 
    const [selectedAdmParameters, setSelectedAdmParameters] = useState<AdmParameter[]>([]);

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
  
    useEffect(() => {
        admParameterCategoryService.findAll().then(data => {
            setListaAdmParameterCategory(data)
        });

        loading = true;
        admParameterService.findAll().then(item => {            
            setListaAdmParameter(item);
            loading = false;
        });

        setColumns([
            { field: 'id', headerName: 'Id', sortable: true, width: 50 },
            { field: 'admParameterCategory', headerName: 'Categoria de parâmetro', sortable: true, flex: 1, renderCell: renderAdmParameterCategoryCell },
            { field: 'code', headerName: 'Parâmetro', sortable: true, flex: 1 },
            { field: 'value', headerName: 'Valor', sortable: true, flex: 1 },
            { field: 'description', headerName: 'Descrição', sortable: true, flex: 1 },
            { field: '', headerName: "", type: "string", width: 50, renderCell: renderActionsCell },
        ]);

    }, [loading]);

    const onInsert = () => {
        setAdmParameter(emptyAdmParameter);
        setSubmitted(false);
        setAdmParameterDialog(true);
    }
    
    const onEdit = () => {
        setAdmParameter({ ...admParameter });
        setAdmParameterDialog(true);
        onToggleMenuClose();
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
                    
                    if (admParameter.id){
                        const index = admParameterService.findIndexById(listaAdmParameter, admParameter.id);
                        _listaAdmParameter[index] = _admParameter;
                        _listaAdmParameter[index].admParameterCategory = _admParameter.admParameterCategory;
                        
                        setListaAdmParameter(_listaAdmParameter);
                        enqueueSnackbar('Parâmetro Atualizado', { variant: "success", transitionDuration: 3000 });
                    }
                });
            } else {
                admParameterService.insert(admParameter).then((obj: AdmParameter) => {
                    _admParameter = obj;
                    _listaAdmParameter.push(_admParameter);
                    setListaAdmParameter(_listaAdmParameter);
                    enqueueSnackbar('Parâmetro Criado', { variant: "success", transitionDuration: 3000 });
                });
            }
            
            setAdmParameterDialog(false);
            setAdmParameter(emptyAdmParameter);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteAdmParametersDialog(true);
    }
  
    const onDelete = () => {
        setDeleteAdmParameterDialog(true);
        setAdmParameter({ ...admParameter });
        onToggleMenuClose();
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
            enqueueSnackbar('Parâmetros excluídos', { variant: "success", transitionDuration: 3000 });
            setSelectedAdmParameters([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterDialog(false);
        if (admParameter.id){
            admParameterService.delete(admParameter.id).then(() => {
                setListaAdmParameter(listaAdmParameter.filter(val => val.id !== admParameter.id));
                setAdmParameter(emptyAdmParameter); 
                enqueueSnackbar('Parâmetro excluído', { variant: "success", transitionDuration: 3000 });
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
        admParameterService.report(reportParamForm).then(() => {
            enqueueSnackbar('Parâmetro exportado', { variant: "success", transitionDuration: 3000 });
        });
    }

    const renderAdmParameterCategory = (): React.JSX.Element[] => {
        let elementosAdmParameterCategory: React.JSX.Element[] = [];

        listaAdmParameterCategory.forEach((item: AdmParameterCategory) => {
            elementosAdmParameterCategory.push(<MenuItem key={item.id} value={item.id}>{item.description}</MenuItem>);
        });

        return elementosAdmParameterCategory;
    }
	
    const onAdmParameterCategoryChange = (e: SelectChangeEvent<number | null>) => {
        let val = e.target.value as number;
        let _admParameter = { ...admParameter };

        let indice = admParameterCategoryService.findIndexById(listaAdmParameterCategory, val);
        _admParameter.admParameterCategory = listaAdmParameterCategory[indice];

        setAdmParameter(_admParameter);
    }    

    const onCodeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        if (val.length > 0){
            let _admParameter = { ...admParameter };        
            _admParameter.code = val;
    
            setAdmParameter(_admParameter);    
        }
    };

    const onValueInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.value = val;

        setAdmParameter(_admParameter);
    };

    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameter = { ...admParameter };
        _admParameter.description = val;

        setAdmParameter(_admParameter);
    };

    function handleFilterChange(filterModel: GridFilterModel) {
      if (!filterModel.quickFilterValues?.length) {
        return setOptions({ ...options, search: "" });
      }
  
      const search = filterModel.quickFilterValues.join("");
      setOptions({ ...options, search });
    }

    function renderAdmParameterCategoryCell(params: GridRenderCellParams) {
        return (params.row.admParameterCategory.description);
    }
    
    const onToggleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, admParameter: AdmParameter) => {
        setAnchorEl(event.currentTarget);
        setAdmParameter({ ...admParameter });
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
        let lista: AdmParameter[] = [];

        if (rowSelectionModel.length > 0){            
            lista = listaAdmParameter.filter(val => {
                if (val.id){
                    return rowSelectionModel.includes(val.id);
                }
            });
        }
        
        setSelectedAdmParameters(lista);
    }

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
                            <Button startIcon={<DeleteIcon />} variant="contained" color="error" onClick={deleteSelected}
                                disabled={!selectedAdmParameters || !(selectedAdmParameters as any).length} >Excluir</Button>
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
                        rows={listaAdmParameter}
                        rowCount={listaAdmParameter.length}                        
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

                    <Dialog open={admParameterDialog} onClose={hideDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title">Detalhes do parâmetro</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel htmlFor="admParameterCategory">Categoria do Parâmetro</InputLabel>
                                    <Select value={admParameter.admParameterCategory.id} id="admParameterCategory" label="Categoria do Parâmetro" 
                                        onChange={e => onAdmParameterCategoryChange(e)} >
                                            {renderAdmParameterCategory()}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="code" label="Parâmetro" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={admParameter.code} onChange={(e) => onCodeInputChange(e)} required />
                                    {submitted && !admParameter.code && <small style={{color: "red"}}>O Parâmetro é obrigatório.</small>}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="value" label="Valor" variant="outlined" multiline required 
                                            rows={5} sx={{marginTop: '10px', marginBottom: '10px'}}
                                            value={admParameter.value} onChange={(e) => onValueInputChange(e)} />
                                    {submitted && !admParameter.value && <small style={{color: "red"}}>O Valor é obrigatório.</small>}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="description" label="Descrição" variant="outlined" multiline required 
                                            rows={3} sx={{marginTop: '10px', marginBottom: '10px'}}
                                            value={admParameter.description} onChange={(e) => onDescriptionInputChange(e)} />
                                    {submitted && !admParameter.description && <small style={{color: "red"}}>A descrição é obrigatória.</small>}
                                </FormControl>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDialog}> Cancelar</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={onSave}> Salvar</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={deleteAdmParameterDialog} onClose={hideDeleteAdmParameterDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <div className="flex align-items-center justify-content-center">
                                    <DeleteIcon style={{fontSize: "2rem"}} />
                                    <span>Tem certeza de que deseja excluir <b>{admParameter.description}</b>?</span>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDeleteAdmParameterDialog}>Não</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={deleteAdmParametersDialog} onClose={hideDeleteAdmParametersDialog} 
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
                                onClick={hideDeleteAdmParametersDialog}>Não</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDeleteSelected}>Sim</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AdmParameterPage;
