<script lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdmParameterCategoryService from '../../admin/service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../api/AdmParameterCategory';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';

export default {
    setup() {
        const toast = useToast();

        const listaAdmParameterCategory = ref();
        const admParameterCategoryDialog = ref(false);
        const deleteAdmParameterCategoryDialog = ref(false);
        const deleteAdmParameterCategorysDialog = ref(false);
        const admParameterCategory = ref(emptyAdmParameterCategory);
        const selectedAdmParameterCategorys = ref();
        const dt = ref(null);
        const filters = ref({});
        const submitted = ref(false);

        const admParameterCategoryService = new AdmParameterCategoryService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        onBeforeMount(() => {
            initFilters();
        });

        onMounted(() => {
            admParameterCategoryService.findAll().then((data) => (listaAdmParameterCategory.value = data));

            selectedTypeReport.value = PDFReport.value;
        });

        const onInsert = () => {
            admParameterCategory.value = emptyAdmParameterCategory;
            submitted.value = false;
            admParameterCategoryDialog.value = true;
        };

        const onEdit = (param: AdmParameterCategory) => {
            admParameterCategory.value = { ...param };
            admParameterCategoryDialog.value = true;
        };

        const hideDialog = () => {
            admParameterCategoryDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;
            if (admParameterCategory.value.description && admParameterCategory.value.description.trim()) {
                if (admParameterCategory.value.id) {
                    admParameterCategoryService.update(admParameterCategory.value).then((obj: AdmParameterCategory) => {
                        admParameterCategory.value = obj;

                        const index = admParameterCategoryService.findIndexById(listaAdmParameterCategory.value, admParameterCategory.value.id);
                        listaAdmParameterCategory.value[index] = admParameterCategory.value;
                        toast.add({severity:'success', summary: 'Successful', detail: 'Categoria de parâmetro Atualizada', life: 3000});
                    });            
                } else {
                    admParameterCategoryService.insert(admParameterCategory.value).then((obj: AdmParameterCategory) => {
                        admParameterCategory.value = obj;

                        listaAdmParameterCategory.value.push(admParameterCategory.value);
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria de parâmetro Criada', life: 3000 });
                    });            
                }

                admParameterCategoryDialog.value = false;
                admParameterCategory.value = emptyAdmParameterCategory;
            }
        };

        const deleteSelected = () => {
            deleteAdmParameterCategorysDialog.value = true;
        }

        const onDelete = (param: AdmParameterCategory) => {
            deleteAdmParameterCategoryDialog.value = true;
            admParameterCategory.value = { ...param };
        } 

        const confirmDeleteSelected = () => {
            deleteAdmParameterCategorysDialog.value = false;
            listaAdmParameterCategory.value = listaAdmParameterCategory.value.filter((val: AdmParameterCategory) => !selectedAdmParameterCategorys.value.includes(val));

            let excluiu = false;
            selectedAdmParameterCategorys.value.forEach((item: AdmParameterCategory) => {
                admParameterCategoryService.delete(item.id).then(obj => {
                    excluiu = true;
                });
            });

            if (excluiu) {
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Categorias de parâmetro excluídos', life: 3000 });
                selectedAdmParameterCategorys.value = [];
            }
        }

        const confirmDelete = () => {
            deleteAdmParameterCategoryDialog.value = false;
            admParameterCategoryService.delete(admParameterCategory.value.id).then(obj => {
                listaAdmParameterCategory.value = listaAdmParameterCategory.value.filter((val: AdmParameterCategory) => val.id !== admParameterCategory.value.id);
                admParameterCategory.value = emptyAdmParameterCategory;        
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de parâmetro excluído', life: 3000 });
            });
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
            admParameterCategoryService.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Categoria de parâmetro exportada', 
                    detail: 'Categoria de parâmetro exportada', life: 3000 });
            });
        }

        const initFilters = () => {
            filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        };

        return { listaAdmParameterCategory, admParameterCategory, filters, submitted,
            selectedAdmParameterCategorys, deleteSelected, admParameterCategoryDialog, hideDialog,
            deleteAdmParameterCategoryDialog, confirmDelete, deleteAdmParameterCategorysDialog,
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
                <Panel header="Categoria de parâmetro de configuração" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="deleteSelected" 
                                :disabled="!selectedAdmParameterCategorys || !selectedAdmParameterCategorys.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt" paginatorPosition="both"
                    :value="listaAdmParameterCategory"
                    v-model:selection="selectedAdmParameterCategorys"
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
                    <Column field="id" header="Id" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="description" header="Descrição" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descrição</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="order" header="Ordem" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ordem</span>
                            {{ slotProps.data.order }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="onEdit(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="onDelete(slotProps.data)" />
                        </template>
                    </Column>

                    <template #footer>
                        <div class="p-d-flex p-ai-center p-jc-between">
                            No total existem {{listaAdmParameterCategory ? listaAdmParameterCategory.length : 0 }} categorias de parâmetro.
                        </div>
                    </template>

                </DataTable>

                <Dialog v-model:visible="admParameterCategoryDialog" :style="{ width: '450px' }" header="Detalhes da categoria de parâmetro" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="description">Descrição</label>
                        <Textarea id="description" v-model="admParameterCategory.description" autofocus required="true" rows="3" cols="20"
                            :class="{ 'p-invalid': submitted && !admParameterCategory.description }" />
                        <small class="p-invalid" v-if="submitted && !admParameterCategory.description">A descrição é obrigatória.</small>
                    </div>
                    <div class="field">
                        <label for="quantity">Ordem</label>
                        <InputNumber id="quantity" v-model="admParameterCategory.order" integeronly locale="pt-BR" />
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="onSave" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAdmParameterCategoryDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="admParameterCategory">Tem certeza de que deseja excluir <b>{{ admParameterCategory.description }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmParameterCategoryDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAdmParameterCategorysDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="admParameterCategory">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmParameterCategorysDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDeleteSelected" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
