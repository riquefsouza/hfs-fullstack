'use client';
import React, { useEffect, useRef, useState } from 'react';
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../api/AdmParameterCategory';
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
import { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
import { DataGrid, GridColDef, GridFilterModel, GridRenderCellParams, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
  
const AdmParameterCategoryPage = () => {

    const admParameterCategoryService = new AdmParameterCategoryService();

    const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
    const [admParameterCategoryDialog, setAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategoryDialog, setDeleteAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategorysDialog, setDeleteAdmParameterCategorysDialog] = useState<boolean>(false);
    const [admParameterCategory, setAdmParameterCategory] = useState<AdmParameterCategory>(emptyAdmParameterCategory); 
    const [selectedAdmParameterCategorys, setSelectedAdmParameterCategorys] = useState<AdmParameterCategory[]>([]);

    const [submitted, setSubmitted] = useState(false);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const { enqueueSnackbar } = useSnackbar();
    const [options, setOptions] = useState({ page: 0, search: "", perPage: 10, rowsPerPage: [10, 30, 50, 100, 150, 200] });
    //const { fetching, setFetching } = useState<boolean>(true);
    let loading = false;
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        loading = true;
        admParameterCategoryService.findAll().then(item => {            
            setListaAdmParameterCategory(item);
            loading = false;
        });

        setColumns([
            { field: 'id', headerName: 'Id', sortable: true, width: 100 },
            { field: 'description', headerName: 'Descrição', sortable: true, flex: 1 },
            { field: 'order', headerName: 'Ordem', type: 'number', sortable: true, width: 120 },
            { field: '', headerName: "Ações", type: "string", width: 100, renderCell: renderActionsCell },
        ]);

    }, [loading]);

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
                    
                    if (admParameterCategory.id){
                        const index = admParameterCategoryService.findIndexById(listaAdmParameterCategory, admParameterCategory.id);
                        _listaAdmParameterCategory[index] = _admParameterCategory;
                        setListaAdmParameterCategory(_listaAdmParameterCategory);
                        enqueueSnackbar('Categoria de parâmetro Atualizada', { variant: "success", transitionDuration: 3000 });
                    }
                });
            } else {
                admParameterCategoryService.insert(admParameterCategory).then((obj: AdmParameterCategory) => {
                    _admParameterCategory = obj;
                    _listaAdmParameterCategory.push(_admParameterCategory);
                    setListaAdmParameterCategory(_listaAdmParameterCategory);
                    enqueueSnackbar('Categoria de parâmetro Criada', { variant: "success", transitionDuration: 3000 });
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
            if (item.id){
                admParameterCategoryService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            enqueueSnackbar('Categorias de parâmetro excluídos', { variant: "success", transitionDuration: 3000 });
            setSelectedAdmParameterCategorys([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterCategoryDialog(false);
        if (admParameterCategory.id){
            admParameterCategoryService.delete(admParameterCategory.id).then(() => {
                setListaAdmParameterCategory(listaAdmParameterCategory.filter(val => val.id !== admParameterCategory.id));
                setAdmParameterCategory(emptyAdmParameterCategory); 
                enqueueSnackbar('Categoria de parâmetro excluído', { variant: "success", transitionDuration: 3000 });
            });
        }
    }
  
    const onChangedTypeReport = (event: SelectChangeEvent) => {
        let typeReport: ItypeReport = event.target.value as unknown as ItypeReport;

        console.log(typeReport);

        setSelectedTypeReport(typeReport);
        setReportParamForm({ reportType: typeReport.type, 
          forceDownload: selectedForceDownload });
    }
        
    const onExport = () => {
        admParameterCategoryService.report(reportParamForm).then(() => {
            enqueueSnackbar('Categoria de parâmetro exportada', { variant: "success", transitionDuration: 3000 });
        });
    }
  
    const onDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _admParameterCategory = { ...admParameterCategory };
        _admParameterCategory.description = val;

        setAdmParameterCategory(_admParameterCategory);
    };

    const onOrderInputNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        if (val.length > 0){
            let _admParameterCategory = { ...admParameterCategory };        
            _admParameterCategory.order = parseInt(val);
    
            setAdmParameterCategory(_admParameterCategory);    
        }
    };

    function handleFilterChange(filterModel: GridFilterModel) {
      if (!filterModel.quickFilterValues?.length) {
        return setOptions({ ...options, search: "" });
      }
  
      const search = filterModel.quickFilterValues.join("");
      setOptions({ ...options, search });
    }

    function renderActionsCell(params: GridRenderCellParams) {
        return (
            <div>
                <IconButton color="primary" onClick={() => onEdit(params.row)} style={{ marginRight: "10px;" }}>
                    <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(params.row)} >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
    
    function handleRowSelectionModelChange(rowSelectionModel: GridRowSelectionModel): void {
        let lista: AdmParameterCategory[] = [];

        if (rowSelectionModel.length > 0){            
            lista = listaAdmParameterCategory.filter(val => {
                if (val.id){
                    return rowSelectionModel.includes(val.id);
                }
            });
        }
        
        setSelectedAdmParameterCategorys(lista);
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
                                disabled={!selectedAdmParameterCategorys || !(selectedAdmParameterCategorys as any).length} >Excluir</Button>
                        </div>
                        <span style={{flex: "1 1 auto"}}></span>
                        <Button startIcon={<UploadIcon />} variant="contained" onClick={onExport}>Exportar</Button>
                    </Toolbar>

                    <DataGrid
                        rows={listaAdmParameterCategory}
                        rowCount={listaAdmParameterCategory.length}                        
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: options.page, pageSize: options.perPage } } }}
                        pageSizeOptions={options.rowsPerPage}
                        //filterMode="server"                        
                        loading={loading}
                        paginationMode="server"
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

                    <Dialog open={admParameterCategoryDialog} onClose={hideDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title">Detalhes da categoria de parâmetro</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="description" label="Descrição" variant="outlined" multiline required 
                                            rows={3} sx={{marginTop: '10px', marginBottom: '10px'}}
                                            value={admParameterCategory.description} onChange={(e) => onDescriptionInputChange(e)} />
                                        {submitted && !admParameterCategory.description && <small className="p-invalid">A descrição é obrigatória.</small>}
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField id="order" label="Ordem" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={admParameterCategory.order && admParameterCategory.order.toString()} 
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

                    <Dialog open={deleteAdmParameterCategoryDialog} onClose={hideDeleteAdmParameterCategoryDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <div className="flex align-items-center justify-content-center">
                                    <DeleteIcon style={{fontSize: "2rem"}} />
                                    <span>Tem certeza de que deseja excluir <b>{admParameterCategory.description}</b>?</span>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDeleteAdmParameterCategoryDialog}>Não</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={deleteAdmParameterCategorysDialog} onClose={hideDeleteAdmParameterCategorysDialog} 
                        aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                        <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-dlg-description">
                                <div className="flex align-items-center justify-content-center">
                                    <DeleteIcon style={{fontSize: "2rem"}} />
                                    <span>Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                onClick={hideDeleteAdmParameterCategorysDialog}>Não</Button>
                            <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDeleteSelected}>Sim</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AdmParameterCategoryPage;
