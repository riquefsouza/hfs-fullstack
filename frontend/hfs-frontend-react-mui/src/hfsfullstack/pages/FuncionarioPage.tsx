'use client';
import React, { useEffect, useState } from 'react';
import FuncionarioService from '../service/FuncionarioService';
import { Funcionario, cleanFuncionario, emptyFuncionario } from '../api/Funcionario';
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridPaginationModel, GridRenderCellParams, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, Grid, Checkbox, FormControlLabel } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { DataTableFilterMeta, DataTableFilterMetaData, LazyTableParam } from '../../base/models/LazyTableParam';
import { ExportService } from '../../base/services/ExportService';
import { BaseUtilService } from '../../base/util/BaseUtilService';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
  
const FuncionarioPage = () => {

    const funcionarioService = new FuncionarioService();
    const exportService = new ExportService();
    const baseUtilService = new BaseUtilService();

    const [listaFuncionario, setListaFuncionario] = useState<Funcionario[]>([]);
    const [funcionarioDialog, setFuncionarioDialog] = useState<boolean>(false);
    const [deleteFuncionarioDialog, setDeleteFuncionarioDialog] = useState<boolean>(false);
    const [deleteFuncionariosDialog, setDeleteFuncionariosDialog] = useState<boolean>(false);
    const [funcionario, setFuncionario] = useState<Funcionario>(emptyFuncionario); 
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<Funcionario[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [exportColumns, setExportColumns] = useState<any[]>([]);

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    const { enqueueSnackbar } = useSnackbar();
    const [options, setOptions] = useState({ page: 0, search: "", perPage: 10, rowsPerPage: [10, 30, 50, 100, 150, 200] });
    
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState<GridColDef[]>([]);   

    let filters: DataTableFilterMeta = {
        global: { value: '', matchMode: 'contains' },
        'nome': {value: '', matchMode: 'startsWith'},
      };        
    
    let lazyParams: LazyTableParam = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
        filters: filters
    };

    useEffect(() => {
        setColumns([
            { field: '', headerName: "Ações", type: "string", width: 100, renderCell: renderActionsCell },
            { field: 'id', headerName: 'Código', sortable: true, width: 100 },
            { field: 'nome', headerName: 'Nome', sortable: true, flex: 1 },
            { field: 'cpfFormatado', headerName: 'Cpf', sortable: true, flex: 1 },
            { field: 'email', headerName: 'Email', sortable: true, flex: 1 },
            { field: 'telefone', headerName: 'Telefone', sortable: true, flex: 1 },
            { field: 'celular', headerName: 'Celular', sortable: true, flex: 1 },
            { field: 'setor', headerName: 'Setor', sortable: true, flex: 1 },
            { field: 'codCargo', headerName: 'CodCargo', type: 'number', sortable: true, width: 120 },
            { field: 'cargo', headerName: 'Cargo', sortable: true, flex: 1 },
            { field: 'dataAdmissaoFormatada', headerName: 'Data Admissão', sortable: true, flex: 1 },
            { field: 'dataSaidaFormatada', headerName: 'Data Saída', sortable: true, flex: 1 },
            { field: 'ativo', headerName: 'Ativo', sortable: true, flex: 1 },            
        ]);

        setExportColumns(columns.map(col => ({title: col.headerName, dataKey: col.field})));

        loadFuncionarios();
    }, []);

    const loadFuncionarios = () => {
        setLoading(true);

        funcionarioService.findAllPaginated(lazyParams).then((data) => {
            setListaFuncionario(data.content);
            setTotalRecords(data.totalElements);
            setLoading(false);
        });
    }

    const handlePaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
        setLoading(true);
        
        lazyParams.first = model.page;
        lazyParams.rows = model.pageSize;

        funcionarioService.findAllPaginated(lazyParams).then((data) => {
            setListaFuncionario(data.content);
            setTotalRecords(data.totalElements);
            setLoading(false);
        });

    }

    const mostrarListar = () => {
        if (funcionarioDialog)
            return { display: 'none' };
        else
            return { display: '' };
    }

    const mostrarEditar = () => {
        if (funcionarioDialog)
            return { display: '' };
        else
            return { display: 'none' };
    }

    const onClean = () => {
        setFuncionario(cleanFuncionario);        
    }

    const onInsert = () => {
        setFuncionario(emptyFuncionario);
        setSubmitted(false);
        setFuncionarioDialog(true);
    }
    
    const onEdit = (funcionario: Funcionario) => {
        setFuncionario({ ...funcionario });
        setFuncionarioDialog(true);
    }
    
    const hideDialog = () => {
        setFuncionarioDialog(false);
        setSubmitted(false);
    }

    const hideDeleteFuncionarioDialog = () => {
        setDeleteFuncionarioDialog(false);
    };

    const hideDeleteFuncionariosDialog = () => {
        setDeleteFuncionariosDialog(false);
    };

    const onSave = () => {
        setSubmitted(true);
        /*
        if (funcionario.cpfFormatado){
            funcionario.cpf = baseUtilService.cpfFormatadoParaCpf(funcionario.cpfFormatado);
        }
        if (funcionario.dataAdmissaoFormatada){
            funcionario.dataAdmissao = baseUtilService.dataStringToDate(funcionario.dataAdmissaoFormatada);
        }
        if (funcionario.dataSaidaFormatada){
            funcionario.dataSaida = baseUtilService.dataStringToDate(funcionario.dataSaidaFormatada);
        } 
        */       

        if (funcionario.nome.trim()) {
            let _listaFuncionario = [...listaFuncionario];
            let _funcionario = {...funcionario};

            if (funcionario.id) {
                funcionarioService.update(funcionario).then((obj: Funcionario) => {
                    _funcionario = obj;
                    
                    if (funcionario.id){
                        const index = funcionarioService.findIndexById(listaFuncionario, funcionario.id);
                        _listaFuncionario[index] = _funcionario;
                        setListaFuncionario(_listaFuncionario);
                        enqueueSnackbar('Categoria de parâmetro Atualizada', { variant: "success", transitionDuration: 3000 });
                    }
                });
            } else {
                funcionarioService.insert(funcionario).then((obj: Funcionario) => {
                    _funcionario = obj;
                    _listaFuncionario.push(_funcionario);
                    setListaFuncionario(_listaFuncionario);
                    enqueueSnackbar('Categoria de parâmetro Criada', { variant: "success", transitionDuration: 3000 });
                });
            }
            
            setFuncionarioDialog(false);
            setFuncionario(emptyFuncionario);            
        }
    }
        
    const deleteSelected = () => {
        setDeleteFuncionariosDialog(true);
    }
  
    const onDelete = (funcionario: Funcionario) => {
        setDeleteFuncionarioDialog(true);
        setFuncionario({ ...funcionario });
    } 
  
    const confirmDeleteSelected = () => {
        setDeleteFuncionariosDialog(false);
        setListaFuncionario(listaFuncionario.filter(val => !selectedFuncionarios.includes(val)));
  
        let excluiu = false;
        selectedFuncionarios.forEach((item) => {
            if (item.id){
                funcionarioService.delete(item.id).then(() => {
                    excluiu = true;
                });
            }
        });
    
        if (excluiu) {
            enqueueSnackbar('Categorias de parâmetro excluídos', { variant: "success", transitionDuration: 3000 });
            setSelectedFuncionarios([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteFuncionarioDialog(false);
        if (funcionario.id){
            funcionarioService.delete(funcionario.id).then(() => {
                setListaFuncionario(listaFuncionario.filter(val => val.id !== funcionario.id));
                setFuncionario(emptyFuncionario); 
                enqueueSnackbar('Categoria de parâmetro excluído', { variant: "success", transitionDuration: 3000 });
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
        funcionarioService.report(reportParamForm).then(() => {
            enqueueSnackbar('Categoria de parâmetro exportada', { variant: "success", transitionDuration: 3000 });
        });
    }
  
    const exportPdf = () => {
        const head: string[] = [];
        const data: any[] = [];

        exportColumns.forEach(item => head.push(item.title));
        listaFuncionario.forEach(item => data.push(
            [item.id, item.nome, item.cpfFormatado, item.email, item.telefone, item.celular, 
            item.setor, item.codCargo, item.cargo, item.dataAdmissaoFormatada, item.dataSaidaFormatada, item.ativo]
        ));

        exportService.exportPdf(head, data, 'funcionarios.pdf');
    }
    
    const exportExcel = () => {
        exportService.exportExcel(listaFuncionario, 'funcionarios');
    }  

    const onNomeInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.nome = val;

        setFuncionario(_funcionario);
    };

    const onEmailInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.email = val;

        setFuncionario(_funcionario);
    };

    const onCpfInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.cpf = baseUtilService.cpfFormatadoParaCpf(val);

        setFuncionario(_funcionario);
    };

    const onTelefoneInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.telefone = val;

        setFuncionario(_funcionario);
    };

    const onCelularInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.celular = val;

        setFuncionario(_funcionario);
    };

    const onSetorInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.setor = val;

        setFuncionario(_funcionario);
    };

    const onCodCargoInputNumberChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.codCargo = parseInt(val);

        setFuncionario(_funcionario);
    };

    const onCargoInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val: string = (e.currentTarget && e.currentTarget.value) || '';
        let _funcionario = { ...funcionario };
        _funcionario.cargo = val;

        setFuncionario(_funcionario);
    };

    const onDataAdmissaoInputChange = (val: Date | null) => {
        if (val){
            let _funcionario = { ...funcionario };
            _funcionario.dataAdmissao = val;
    
            setFuncionario(_funcionario);    
        }
    };

    const onDataSaidaInputChange = (val: Date | null) => {
        if (val){
            let _funcionario = { ...funcionario };
            _funcionario.dataSaida = val;

            setFuncionario(_funcionario);
        }    
    };

    const onAtivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _funcionario = { ...funcionario };
        _funcionario.ativo = event.target.checked;
        setFuncionario(_funcionario);
    };

    function filtrar(search: string){
        setLoading(true);

        let filtro: DataTableFilterMetaData = lazyParams.filters['nome'] as DataTableFilterMetaData;
        filtro.value = search; 
        
        funcionarioService.findAllPaginated(lazyParams).then((data) => {
          setListaFuncionario(data.content);
          setTotalRecords(data.totalElements);
          setLoading(false);
        });  
    }

    function handleFilterChange(filterModel: GridFilterModel) {

      if (!filterModel.quickFilterValues?.length) {
        filtrar("");

        return setOptions({ ...options, search: "" });
      }
  
      const search = filterModel.quickFilterValues.join(" ");
      setOptions({ ...options, search });

      filtrar(search);
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
        let lista: Funcionario[] = [];

        if (rowSelectionModel.length > 0){            
            lista = listaFuncionario.filter(val => {
                if (val.id){
                    return rowSelectionModel.includes(val.id);
                }
            });
        }
        
        setSelectedFuncionarios(lista);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card" style={mostrarListar()}>
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
                                disabled={!selectedFuncionarios || !(selectedFuncionarios as any).length} >Excluir</Button>
                        </div>
                        <span style={{flex: "1 1 auto"}}></span>

                        <Button startIcon={<DescriptionIcon />} variant="contained" sx={{marginRight: '10px'}} onClick={exportExcel}></Button>
                        <Button startIcon={<PictureAsPdfIcon />} variant="contained" sx={{marginRight: '10px'}}  onClick={exportPdf}></Button>
                        
                        <span style={{flex: "1 1 auto"}}></span>

                        <Button startIcon={<UploadIcon />} variant="contained" onClick={onExport}>Exportar</Button>
                    </Toolbar>

                    <DataGrid
                        rows={listaFuncionario}
                        rowCount={totalRecords}                        
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: options.page, pageSize: options.perPage } } }}
                        pageSizeOptions={options.rowsPerPage}
                        filterMode="server"                        
                        loading={loading}
                        paginationMode="server"              
                        checkboxSelection={true}
                        disableColumnFilter={false}
                        disableColumnSelector={true}
                        disableDensitySelector={true}
                        disableRowSelectionOnClick={true}
                        onFilterModelChange={handleFilterChange}
                        onRowSelectionModelChange={handleRowSelectionModelChange}
                        onPaginationModelChange={handlePaginationModelChange}
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
                    <Card className="p-mb-2">
                        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Detalhes do funcionário</Typography>
                        <CardContent>                            
                            <Toolbar className="mb-4">
                                <span style={{flex: "1 1 auto"}}></span>
                                <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                        onClick={hideDialog}> Cancelar</Button>
                                <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                                        onClick={onClean}> Limpar</Button>                                        
                                <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={onSave}> Salvar</Button>
                            </Toolbar>

                            <FormControl sx={{ width: '100%' }}>
                                <TextField id="nome" label="Nome" variant="outlined" required
                                        sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={funcionario.nome} onChange={(e) => onNomeInputChange(e)} 
                                        />
                                {submitted && !funcionario.nome && <small style={{color: "red"}}>O nome é obrigatório.</small>}
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <TextField id="email" label="Email" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                        value={funcionario.email} onChange={(e) => onEmailInputChange(e)} />
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField id="cpf" label="Cpf" variant="outlined" required sx={{marginTop: '10px', marginBottom: '10px'}}
                                                value={funcionario.cpf} onChange={(e) => onCpfInputChange(e)} />
                                        {submitted && !funcionario.cpf && <small style={{color: "red"}}>O cpf é obrigatório.</small>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField id="telefone" label="Telefone" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                                value={funcionario.telefone} onChange={(e) => onTelefoneInputChange(e)} />
                                    </FormControl>
                                </Grid>
                            </Grid>    
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField id="celular" label="Celular" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                                value={funcionario.celular} onChange={(e) => onCelularInputChange(e)} />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField id="setor" label="Setor" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                                value={funcionario.setor} onChange={(e) => onSetorInputChange(e)} />
                                    </FormControl>
                                </Grid>
                            </Grid>    
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField type='number' id="codCargo" label="CodCargo" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                            value={funcionario.codCargo && funcionario.codCargo.toString()} 
                                            onChange={(e) => onCodCargoInputNumberChange(e)} />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField id="cargo" label="Cargo" variant="outlined" sx={{marginTop: '10px', marginBottom: '10px'}}
                                                value={funcionario.cargo} onChange={(e) => onCargoInputChange(e)} />
                                    </FormControl>
                                </Grid>
                            </Grid>    
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <DateTimePicker label="Data Admissão" value={funcionario.dataAdmissao} sx={{ width: '100%' }}
                                            onChange={(newValue) => onDataAdmissaoInputChange(newValue)} format="L" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <DateTimePicker label="Data Saída" value={funcionario.dataSaida} sx={{ width: '100%' }} 
                                            onChange={(newValue) => onDataSaidaInputChange(newValue)} format="L" />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>                                                 
                            <FormControlLabel control={<Checkbox checked={funcionario.ativo} onChange={onAtivoChange} />} label="Ativo" />
                        </CardContent>
                    </Card>

                </div>

                <Dialog open={deleteFuncionarioDialog} onClose={hideDeleteFuncionarioDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir <b>{funcionario.nome}</b>?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteFuncionarioDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDelete}>Sim</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteFuncionariosDialog} onClose={hideDeleteFuncionariosDialog} 
                    aria-labelledby="delete-dlg-title" aria-describedby="delete-dlg-description">
                    <DialogTitle id="delete-dlg-title"><h2>Confirme</h2></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dlg-description">
                            <div className="flex align-items-center justify-content-center">
                                <DeleteIcon style={{fontSize: "2rem"}} />
                                <span>Tem certeza de que deseja excluir os funcionários selecionados?</span>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} variant="contained" color="secondary" sx={{marginRight: "10px;"}} 
                            onClick={hideDeleteFuncionariosDialog}>Não</Button>
                        <Button startIcon={<CheckIcon />} variant="contained" color="primary" autoFocus onClick={confirmDeleteSelected}>Sim</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
};

export default FuncionarioPage;
