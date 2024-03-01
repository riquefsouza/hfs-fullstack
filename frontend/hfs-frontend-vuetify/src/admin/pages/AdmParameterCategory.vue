<script lang="ts">
import { ref, onMounted, onBeforeMount, shallowRef } from 'vue';
import AdmParameterCategoryService from '../../admin/service/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '../api/AdmParameterCategory';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import snackBar from '../../base/components/EnqueueSnackbar.vue';

export default {
    setup() {
        const listaAdmParameterCategory = ref<AdmParameterCategory[]>([]);
        const admParameterCategoryDialog = shallowRef(false)
        const deleteAdmParameterCategoryDialog = ref(false);
        const deleteAdmParameterCategorysDialog = ref(false);
        const admParameterCategory = ref(emptyAdmParameterCategory);
        const selectedAdmParameterCategorys = ref<number[]>([]);
        const submitted = ref(false);

        const admParameterCategoryService = new AdmParameterCategoryService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const itemsPerPage = ref(10);
        const columns = ref();        
        const loading = ref(true);
        const totalItems = ref(0);
        const search = ref('');

        onBeforeMount(() => {
            columns.value = [
                { key: 'id', title: 'Id', sortable: true, align: 'start' },
                { key: 'description', title: 'Descrição', sortable: true, align: 'start' },
                { key: 'order', title: 'Ordem', type: 'number', sortable: true, align: 'start' },
                { key: 'actions', title: "Ações", sortable: false }
            ];
        });

        onMounted(() => {
            loadItems();

            selectedTypeReport.value = PDFReport.value;
        });

        const loadItems = () => {
            loading.value = true;
            admParameterCategoryService.findAll().then(data => {
                listaAdmParameterCategory.value = data;
                totalItems.value = listaAdmParameterCategory.value.length;
                loading.value = false;
            });
        }

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

                        if (admParameterCategory.value.id){
                            const index = admParameterCategoryService.findIndexById(listaAdmParameterCategory.value, admParameterCategory.value.id);
                            listaAdmParameterCategory.value[index] = admParameterCategory.value;
                            snackBar('Categoria de parâmetro Atualizada', 3000);
                        }
                    });            
                } else {
                    admParameterCategoryService.insert(admParameterCategory.value).then((obj: AdmParameterCategory) => {
                        admParameterCategory.value = obj;

                        listaAdmParameterCategory.value.push(admParameterCategory.value);
                        snackBar('Categoria de parâmetro Criada', 3000);
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
            
            let selecionados: AdmParameterCategory[] = [];
            listaAdmParameterCategory.value.forEach((item: AdmParameterCategory) => {
                selectedAdmParameterCategorys.value.forEach((id: number) => {
                    if (item.id === id){
                        selecionados.push(item);
                    }
                });        
            });

            if (selecionados.length > 0){
                listaAdmParameterCategory.value = listaAdmParameterCategory.value.filter(
                    (val: AdmParameterCategory) => !selecionados.includes(val));

                    selecionados.forEach((item: AdmParameterCategory, index: number) => {
                    if (item.id){
                        admParameterCategoryService.delete(item.id).then(() => {

                            if (selecionados.length == (index+1)){
                                snackBar('Categorias de parâmetro excluídos', 3000);
                                selectedAdmParameterCategorys.value = [];
                            }

                        });
                    }
                });

            }
        }

        const confirmDelete = () => {
            deleteAdmParameterCategoryDialog.value = false;
            if (admParameterCategory.value.id){
                admParameterCategoryService.delete(admParameterCategory.value.id).then(() => {
                    listaAdmParameterCategory.value = listaAdmParameterCategory.value.filter((val: AdmParameterCategory) => val.id !== admParameterCategory.value.id);
                    admParameterCategory.value = emptyAdmParameterCategory;        
                    snackBar('Categoria de parâmetro excluído', 3000);
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
            admParameterCategoryService.report(reportParamForm.value).then(() => {
                snackBar('Categoria de parâmetro exportada', 3000);
            });
        }

        return { listaAdmParameterCategory, admParameterCategory, submitted,
            selectedAdmParameterCategorys, deleteSelected, admParameterCategoryDialog, hideDialog,
            deleteAdmParameterCategoryDialog, confirmDelete, deleteAdmParameterCategorysDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected, itemsPerPage, columns, loading, totalItems, search }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <v-card-item>
                    <v-card-title>Categoria de parâmetro de configuração</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="deleteSelected" variant="elevated" color="red"
                        :disabled="!selectedAdmParameterCategorys || !selectedAdmParameterCategorys.length" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>    
                </v-toolbar>

                <v-data-table
                    v-model="selectedAdmParameterCategorys"
                    v-model:items-per-page="itemsPerPage"
                    :headers="columns"
                    :items="listaAdmParameterCategory"
                    :items-length="totalItems"
                    :loading="loading"
                    :search="search"
                    item-value="id"
                    show-select
                    :sort-by="[{ key: 'id', order: 'asc' }]">

                    <template v-slot:item.actions="{ item }">
                        <v-icon class="me-2" size="small" @click="onEdit(item)">edit</v-icon>
                        <v-icon size="small" @click="onDelete(item)">delete</v-icon>
                    </template>
                    
                </v-data-table>

                <v-dialog v-model="admParameterCategoryDialog" width="500">
                    <v-card title="Detalhes da categoria de parâmetro">
                        <v-card-text>
                            <v-row>
                                <v-textarea label="Descrição" v-model="admParameterCategory.description"
                                    required autofocus counter rows="3" cols="20"
                                    :class="{ 'text-red': submitted && !admParameterCategory.description }">
                                </v-textarea>                                
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admParameterCategory.description">A descrição é obrigatória.</small>
                            </v-row>
                            <v-row>
                                <v-text-field type="number" label="Ordem" v-model="admParameterCategory.order"></v-text-field>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" @click="hideDialog" variant="elevated">Cancelar</v-btn>
                            <v-btn prepend-icon="check" color="primary" @click="onSave" variant="elevated">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="deleteAdmParameterCategoryDialog" max-width="450" persistent>
                    <v-card prepend-icon="warning" title="Confirme">
                        <v-card-text>
                            <span v-if="admParameterCategory">Tem certeza de que deseja excluir <b>{{ admParameterCategory.description }}</b>?</span>
                        </v-card-text>                        
                        <template v-slot:actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                                @click="deleteAdmParameterCategoryDialog = false" variant="elevated">Não</v-btn>
                            <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
                        </template>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="deleteAdmParameterCategorysDialog" max-width="450" persistent>
                    <v-card prepend-icon="warning" title="Confirme">
                        <v-card-text>
                            <span v-if="admParameterCategory">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                        </v-card-text>                        
                        <template v-slot:actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                                @click="deleteAdmParameterCategorysDialog = false" variant="elevated">Não</v-btn>
                            <v-btn prepend-icon="check" color="primary" @click="confirmDeleteSelected" variant="elevated">Sim</v-btn>
                        </template>
                    </v-card>
                </v-dialog>

            </div>
        </div>
    </div>
</template>

<style>
.spacer {
    flex: 1 1 auto;
}
</style>