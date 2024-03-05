<script lang="ts">
import { ref, onMounted, onBeforeMount, shallowRef } from 'vue';
import AdmParameterService from '../../admin/service/AdmParameterService';
import { AdmParameter, emptyAdmParameter } from '../api/AdmParameter';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { SnackbarMessage, emptySnackbarMessage } from '../../base/models/SnackbarMessage';
import AdmParameterCategoryService from '../service/AdmParameterCategoryService';
import { AdmParameterCategory } from '../api/AdmParameterCategory';

export default {
    setup() {
        const snackbar = ref<SnackbarMessage>(emptySnackbarMessage);

        const listaAdmParameterCategory = ref<AdmParameterCategory[]>([]);
        const listaAdmParameter = ref<AdmParameter[]>([]);
        const admParameterDialog = shallowRef(false)
        const deleteAdmParameterDialog = ref(false);
        const deleteAdmParametersDialog = ref(false);
        const admParameter = ref(emptyAdmParameter);
        const selectedAdmParameters = ref<number[]>([]);
        const submitted = ref(false);

        const admParameterCategoryService = new AdmParameterCategoryService();
        const admParameterService = new AdmParameterService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        //const exportColumns = ref([]);

        const itemsPerPage = ref(10);
        const columns = ref();        
        const loading = ref(true);
        const totalItems = ref(0);
        const search = ref('');

        onBeforeMount(() => {
            columns.value = [
                { key: 'id', title: 'Id', sortable: true, align: 'start' },
                { key: 'admParameterCategory.description', title: 'Categoria de parâmetro', sortable: true, align: 'start' },
                { key: 'code', title: 'Parâmetro', sortable: true, align: 'start' },
                { key: 'value', title: 'Valor', sortable: true, align: 'start' },
                { key: 'description', title: 'Descrição', sortable: true, align: 'start' },
                { key: 'actions', title: "Ações", sortable: false }
            ];            
        });

        onMounted(() => {
            loadItems();

            selectedTypeReport.value = PDFReport.value;
        });

        const loadItems = () => {
            admParameterCategoryService.findAll().then(data => listaAdmParameterCategory.value = data);

            loading.value = true;
            admParameterService.findAll().then(data => {
                listaAdmParameter.value = data;
                totalItems.value = listaAdmParameter.value.length;
                loading.value = false;
            });
        }

        const snackBar = (msg: string, duration: number) => {
            snackbar.value.open = true;
            snackbar.value.message = msg;
            snackbar.value.timeout = duration;
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

                            snackBar('Parâmetro Atualizado', 3000);
                        }
                    });            
                } else {
                    admParameterService.insert(admParameter.value).then((obj: AdmParameter) => {
                        admParameter.value = obj;

                        listaAdmParameter.value.push(admParameter.value);
                        snackBar('Parâmetro Criado', 3000);
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
            
            let selecionados: AdmParameter[] = [];
            listaAdmParameter.value.forEach((item: AdmParameter) => {
                selectedAdmParameters.value.forEach((id: number) => {
                    if (item.id === id){
                        selecionados.push(item);
                    }
                });        
            });

            if (selecionados.length > 0){
                listaAdmParameter.value = listaAdmParameter.value.filter(
                    (val: AdmParameter) => !selecionados.includes(val));

                    selecionados.forEach((item: AdmParameter, index: number) => {
                    if (item.id){
                        admParameterService.delete(item.id).then(() => {

                            if (selecionados.length == (index+1)){
                                snackBar('Parâmetros excluídos', 3000);
                                selectedAdmParameters.value = [];
                            }

                        });
                    }
                });

            }
        }

        const confirmDelete = () => {
            deleteAdmParameterDialog.value = false;
            if (admParameter.value.id){
                admParameterService.delete(admParameter.value.id).then(() => {
                    listaAdmParameter.value = listaAdmParameter.value.filter((val: AdmParameter) => val.id !== admParameter.value.id);
                    admParameter.value = emptyAdmParameter;        
                    snackBar('Parâmetro excluído', 3000);
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
                snackBar('Parâmetro exportado', 3000);
            });            
        }

        return { listaAdmParameter, admParameter, submitted, listaAdmParameterCategory,
            selectedAdmParameters, deleteSelected, admParameterDialog, hideDialog,
            deleteAdmParameterDialog, confirmDelete, deleteAdmParametersDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected, itemsPerPage, columns, loading, totalItems, search,
            snackbar }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout" location="top">
                    {{ snackbar.message }}
                    <template v-slot:actions>
                        <v-btn color="red" density="compact" icon="close" @click="snackbar.open = false"></v-btn>
                    </template>
                </v-snackbar>
                <v-card-item>
                    <v-card-title>Parâmetro</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="deleteSelected" variant="elevated" color="red"
                        :disabled="!selectedAdmParameters || !selectedAdmParameters.length" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>    
                </v-toolbar>
                
                <v-data-table
                    v-model="selectedAdmParameters"
                    v-model:items-per-page="itemsPerPage"
                    :headers="columns"
                    :items="listaAdmParameter"
                    :items-length="totalItems"
                    :loading="loading"
                    :search="search"
                    item-value="id"
                    show-select
                    :sort-by="[{ key: 'id', order: 'asc' }]">

                    <template v-slot:item.actions="{ item }">
                        <v-btn variant="plain">
                            <v-icon icon="more_vert"></v-icon>
                            <v-menu activator="parent">
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title @click="onEdit(item)" style="cursor: pointer;">Editar</v-list-item-title>
                                        <v-list-item-title @click="onDelete(item)" style="cursor: pointer;">Excluir</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        
                        </v-btn>
                    </template>
                    
                </v-data-table>



                <v-dialog v-model="admParameterDialog" width="500">
                    <v-card title="Detalhes do parâmetro">
                        <v-card-text>
                            <v-row>
                                <v-select label="Categoria do parâmetro" v-model="admParameter.admParameterCategory"
                                    :items="listaAdmParameterCategory" item-title="description"></v-select>
                            </v-row>
                            <v-row>
                                <v-text-field label="Parâmetro" v-model="admParameter.code" required
                                    :class="{ 'text-red': submitted && !admParameter.code }">
                                </v-text-field>
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admParameter.code">O Parâmetro é obrigatório.</small>
                            </v-row>
                            <v-row>
                                <v-textarea label="Valor" v-model="admParameter.value" required counter rows="5" cols="20"
                                    :class="{ 'text-red': submitted && !admParameter.value }">
                                </v-textarea>                                
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admParameter.value">O Valor é obrigatório.</small>
                            </v-row>
                            <v-row>
                                <v-textarea label="Descrição" v-model="admParameter.description" required counter rows="3" cols="20"
                                    :class="{ 'text-red': submitted && !admParameter.description }">
                                </v-textarea>                                
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admParameter.description">A descrição é obrigatória.</small>
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

                <v-dialog v-model="deleteAdmParameterDialog" max-width="450" persistent>
                    <v-card prepend-icon="warning" title="Confirme">
                        <v-card-text>
                            <span v-if="admParameter">Tem certeza de que deseja excluir <b>{{ admParameter.description }}</b>?</span>
                        </v-card-text>                        
                        <template v-slot:actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                                @click="deleteAdmParameterDialog = false" variant="elevated">Não</v-btn>
                            <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
                        </template>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="deleteAdmParametersDialog" max-width="450" persistent>
                    <v-card prepend-icon="warning" title="Confirme">
                        <v-card-text>
                            <span v-if="admParameter">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                        </v-card-text>                        
                        <template v-slot:actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                                @click="deleteAdmParametersDialog = false" variant="elevated">Não</v-btn>
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