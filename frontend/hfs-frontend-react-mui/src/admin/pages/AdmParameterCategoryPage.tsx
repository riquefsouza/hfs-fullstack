'use client';
import React, { useEffect, useRef, useState } from 'react';
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../api/AdmParameterCategory';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport } from '../../base/services/ReportService';
import ReportPanelComponent from '../../base/components/ReportPanel';
import Button from '@mui/material/Button';
import snackBar from '../../base/components/AutohideSnackbar';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { SelectChangeEvent } from '@mui/material/Select';

const AdmParameterCategoryPage = () => {

    const admParameterCategoryService = new AdmParameterCategoryService();

    const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
    const [admParameterCategoryDialog, setAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategoryDialog, setDeleteAdmParameterCategoryDialog] = useState<boolean>(false);
    const [deleteAdmParameterCategorysDialog, setDeleteAdmParameterCategorysDialog] = useState<boolean>(false);
    const [admParameterCategory, setAdmParameterCategory] = useState<AdmParameterCategory>(emptyAdmParameterCategory); 
    const [selectedAdmParameterCategorys, setSelectedAdmParameterCategorys] = useState<AdmParameterCategory[]>([]);

    const [submitted, setSubmitted] = useState(false);
    //const [cols, setCols] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
    const [selectedForceDownload, setSelectedForceDownload] = useState(true);
    const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);    

    useEffect(() => {
        admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));
/*
        setCols([
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descrição' },
            { field: 'order', header: 'Ordem' }
        ]);
*/      
    }, []);

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
                        snackBar('Categoria de parâmetro Atualizada', 'Sucesso', 3000);
                    }
                });
            } else {
                admParameterCategoryService.insert(admParameterCategory).then((obj: AdmParameterCategory) => {
                    _admParameterCategory = obj;
                    _listaAdmParameterCategory.push(_admParameterCategory);
                    setListaAdmParameterCategory(_listaAdmParameterCategory);
                    snackBar('Categoria de parâmetro Criada', 'Sucesso', 3000);
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
            snackBar('Categorias de parâmetro excluídos', 'Sucesso', 3000);
            setSelectedAdmParameterCategorys([]);
        }
    }
  
    const confirmDelete = () => {
        setDeleteAdmParameterCategoryDialog(false);
        if (admParameterCategory.id){
            admParameterCategoryService.delete(admParameterCategory.id).then(() => {
                setListaAdmParameterCategory(listaAdmParameterCategory.filter(val => val.id !== admParameterCategory.id));
                setAdmParameterCategory(emptyAdmParameterCategory); 
                snackBar('Categoria de parâmetro excluído', 'Sucesso', 3000);
            });
        }
    }
  
    const onChangedTypeReport = (event: SelectChangeEvent) => {
        let typeReport: ItypeReport = event.target.value;
        setSelectedTypeReport(typeReport);
        setReportParamForm({ reportType: typeReport.type, 
          forceDownload: selectedForceDownload });
    }
        
    const onExport = () => {
        admParameterCategoryService.report(reportParamForm).then(() => {
            snackBar('Categoria de parâmetro exportada', 'Sucesso', 3000);
        });
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Card className="p-mb-2">
                        <CardHeader title="Categoria de parâmetro de configuração"/>
                        <CardContent>
                            <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e)}></ReportPanelComponent>
                        </CardContent>
                    </Card>
                    <Toolbar className="mb-4">
                        <div className="my-2">
                            <Button startIcon={<AddIcon />} color="primary" className="mr-2" onClick={onInsert}>Adicionar</Button>
                            <Button startIcon={<DeleteIcon />} color="secondary" onClick={deleteSelected}
                                disabled={!selectedAdmParameterCategorys || !(selectedAdmParameterCategorys as any).length} >Excluir</Button>
                        </div>
                        <span style={{flex: "1 1 auto"}}></span>
                        <Button startIcon={<UploadIcon />} className="p-button-help" onClick={onExport}>Exportar</Button>
                    </Toolbar>

                </div>
            </div>
        </div>
    );
};

export default AdmParameterCategoryPage;
