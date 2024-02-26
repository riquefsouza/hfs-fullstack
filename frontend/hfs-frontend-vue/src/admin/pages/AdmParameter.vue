<script lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdmParameterService from '../../admin/service/AdmParameterService';
import AdmParameterCategoryService from '../../admin/service/AdmParameterCategoryService';
//import { ExportService } from '../../base/services/ExportService';
import { AdmParameter, emptyAdmParameter } from '../api/AdmParameter';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { MenuItem } from '../../base/models/MenuItem';
import { AdmParameterCategory } from '../api/AdmParameterCategory';

export default {
    setup() {
        const toast = useToast();

        const listaAdmParameterCategory = ref<AdmParameterCategory[]>([]);
        const listaAdmParameter = ref<AdmParameter[]>([]);
        const admParameterDialog = ref(false);
        const deleteAdmParameterDialog = ref(false);
        const deleteAdmParametersDialog = ref(false);
        const admParameter = ref(emptyAdmParameter);
        const selectedAdmParameters = ref();
        const dt = ref(null);
        const filters = ref({});
        const cols = ref();
        const exportColumns = ref([]);
        const submitted = ref(false);

        const admParameterCategoryService = new AdmParameterCategoryService();
        const admParameterService = new AdmParameterService();
        //const exportService = new ExportService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const popupMenu = ref();
        const itemsMenuLinha = ref<MenuItem[]>([]);

        onBeforeMount(() => {
            initFilters();
        });

        onMounted(() => {
            admParameterCategoryService.findAll().then(data => listaAdmParameterCategory.value = data);

            admParameterService.findAll().then((data) => (listaAdmParameter.value = data));

            selectedTypeReport.value = PDFReport.value;

            itemsMenuLinha.value = [{ label: "Editar" }, { label: "Excluir" }];

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'admParameterCategory.description', header: 'Categoria de parâmetro' },
                { field: 'code', header: 'Parâmetro' },
                { field: 'value', header: 'Valor' },
                { field: 'description', header: 'Descrição' }
            ];

            exportColumns.value = cols.value.map((col: { header: any; field: any; }) => ({title: col.header, dataKey: col.field}));

        });

        const toggleMenu = (event: any, rowData: AdmParameter) => {
            itemsMenuLinha.value = [];

            itemsMenuLinha.value.push({
                label: 'Editar',
                command: () => {
                    onEdit(rowData);
                }
            });

            itemsMenuLinha.value.push({
                label: 'Excluir',
                command: () => {
                    onDelete(rowData);
                }
            });
            
            popupMenu.value.toggle(event);
        }

        const onInsert = () => {
            admParameter.value = emptyAdmParameter;
            submitted.value = false;

            if (listaAdmParameterCategory.value.length > 0) {
                admParameter.value.admParameterCategory = listaAdmParameterCategory.value.at(0);
            }

            admParameterDialog.value = true;
        };

        const onEdit = (param: AdmParameter) => {
            admParameter.value = { ...param };
            admParameterDialog.value = true;
        };

        const hideDialog = () => {
            admParameterDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;
            if (admParameter.value.description && admParameter.value.description.trim()) {
                if (admParameter.value.id) {
                    admParameterService.update(admParameter.value).then((obj: AdmParameter) => {
                        admParameter.value = obj;

                        if (admParameter.value.id){    
                            const index = admParameterService.findIndexById(listaAdmParameter.value, admParameter.value.id);
                            listaAdmParameter.value[index] = admParameter.value;
                            listaAdmParameter.value[index].admParameterCategory = admParameter.value.admParameterCategory;

                            toast.add({severity:'success', summary: 'Successful', detail: 'Parâmetro Atualizada', life: 3000});
                        }
                    });            
                } else {
                    admParameterService.insert(admParameter.value).then((obj: AdmParameter) => {
                        admParameter.value = obj;

                        listaAdmParameter.value.push(admParameter.value);
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Parâmetro Criada', life: 3000 });
                    });            
                }

                admParameterDialog.value = false;
                admParameter.value = emptyAdmParameter;
            }
        };

        const deleteSelected = () => {
            deleteAdmParametersDialog.value = true;
        }

        const onDelete = (param: AdmParameter) => {
            deleteAdmParameterDialog.value = true;
            admParameter.value = { ...param };
        } 

        const confirmDeleteSelected = () => {
            deleteAdmParametersDialog.value = false;
            listaAdmParameter.value = listaAdmParameter.value.filter((val: AdmParameter) => !selectedAdmParameters.value.includes(val));

            let excluiu = false;
            selectedAdmParameters.value.forEach((item: AdmParameter) => {
                if (item.id){
                    admParameterService.delete(item.id).then(() => {
                        excluiu = true;
                    });
                }    
            });

            if (excluiu) {
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetros excluídos', life: 3000 });
                selectedAdmParameters.value = [];
            }
        }

        const confirmDelete = () => {
            deleteAdmParameterDialog.value = false;
            if (admParameter.value.id){
                admParameterService.delete(admParameter.value.id).then(() => {
                    listaAdmParameter.value = listaAdmParameter.value.filter((val: AdmParameter) => val.id !== admParameter.value.id);
                    admParameter.value = emptyAdmParameter;        
                    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro excluído', life: 3000 });
                });
            }
        }

        const onTypeReportChange = (param: { pTypeReport: SelectItemGroup }) => {
            if (param.pTypeReport.value){
                selectedTypeReport.value = param.pTypeReport.value;
                reportParamForm.value = { reportType: param.pTypeReport.value.type, forceDownload: selectedForceDownload.value };
            }        
        }

        const onForceDownloadChange = (param: { forceDownload: boolean }) => {
            selectedForceDownload.value = param.forceDownload;
            if (selectedTypeReport.value){
                reportParamForm.value = { reportType: selectedTypeReport.value.type, forceDownload: param.forceDownload };
            }
        }

        const onExport = () => {
            admParameterService.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Parâmetro exportada', 
                    detail: 'Parâmetro exportada', life: 3000 });
            });
        }

        const initFilters = () => {
            filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        };
/*
        const exportPdf = () => {
            const head: string[] = [];
            const data: any[] = [];

            exportColumns.value.forEach((item: { title: string; }) => head.push(item.title));
            listaAdmParameter.value.forEach((item: AdmParameter) => data.push(
                [item.id, item.admParameterCategory.description, item.code, item.value, item.description]
            ));

            exportService.exportPdf(head, data, 'parametros.pdf');
        }

        const exportExcel = () => {
            exportService.exportExcel(listaAdmParameter.value, 'parametros');
        }
*/

        return { listaAdmParameter, admParameter, filters, submitted, itemsMenuLinha, toggleMenu, popupMenu,
            selectedAdmParameters, deleteSelected, admParameterDialog, hideDialog, listaAdmParameterCategory,
            deleteAdmParameterDialog, confirmDelete, deleteAdmParametersDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <!-- <Toast /> -->
                <Panel header="Parâmetro de configuração" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="deleteSelected" 
                                :disabled="!selectedAdmParameters || !selectedAdmParameters.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <Menu ref="popupMenu" id="popup_menu" :model="itemsMenuLinha" :popup="true" />

                <DataTable
                    ref="dt" paginatorPosition="both"
                    :value="listaAdmParameter"
                    v-model:selection="selectedAdmParameters"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10,30,50,100,150,200]" emptyMessage="Nenhum registro encontrado."
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gerenciar categorias de parâmetros</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Procurar..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="Id" :sortable="true" headerStyle="width:5%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="admParameterCategory.description" header="Categoria do parâmetro" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Categoria do parâmetro</span>
                            {{ slotProps.data.admParameterCategory.description }}
                        </template>
                    </Column>
                    <Column field="code" header="Parâmetro" :sortable="true" headerStyle="min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Parâmetro</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="value" header="Valor" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Valor</span>
                            {{ slotProps.data.value }}
                        </template>
                    </Column>
                    <Column field="description" header="Descrição" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descrição</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <div class="flex">
                                <Button link icon="pi pi-ellipsis-v" @click="toggleMenu($event, slotProps.data)" 
                                    aria-haspopup="true" aria-controls="popup_menu" />
                            </div>
                        </template>
                    </Column>

                    <template #footer>
                        <div class="p-d-flex p-ai-center p-jc-between">
                            No total existem {{listaAdmParameter ? listaAdmParameter.length : 0 }} parâmetros.
                        </div>
                    </template>

                </DataTable>

                <Dialog v-model:visible="admParameterDialog" :style="{ width: '650px' }" header="Detalhes do parâmetro" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="admParameterCategory">Parameter Category:</label>
                        <Dropdown id="admParameterCategory" v-model="admParameter.admParameterCategory" :options="listaAdmParameterCategory"
                            optionLabel="description" placeholder="Selecione uma categoria de parâmetro"></Dropdown>
                    </div>
                    <div class="field">
                        <label for="code">Parâmetro:</label>
                        <InputText id="code" v-model="admParameter.code" required="true" :class="{'p-invalid': submitted && !admParameter.code}" />
                        <small class="p-invalid" v-if="submitted && !admParameter.code">O Parâmetro é obrigatório.</small>
                    </div>
                    <div class="field">
                        <label for="value">Valor:</label>
                        <Textarea id="value" v-model="admParameter.value" required="true" rows="5" cols="20" 
                            :class="{'p-invalid': submitted && !admParameter.value}" />
                        <small class="p-invalid" v-if="submitted && !admParameter.value">O Valor é obrigatório.</small> 
                    </div>
                    <div class="field">
                        <label for="description">Descrição</label>
                        <Textarea id="description" v-model="admParameter.description" autofocus required="true" rows="3" cols="20"
                            :class="{ 'p-invalid': submitted && !admParameter.description }" />
                        <small class="p-invalid" v-if="submitted && !admParameter.description">A descrição é obrigatória.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="onSave" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAdmParameterDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="admParameter">Tem certeza de que deseja excluir <b>{{ admParameter.description }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmParameterDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAdmParametersDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="admParameter">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmParametersDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDeleteSelected" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
