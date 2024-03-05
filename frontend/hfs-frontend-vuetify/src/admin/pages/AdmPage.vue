<script lang="ts">
import { ref, onMounted, onBeforeMount, shallowRef } from 'vue';
import AdmPageService from '../../admin/service/AdmPageService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '../api/AdmPage';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { SnackbarMessage, emptySnackbarMessage } from '../../base/models/SnackbarMessage';
import { AdmProfile } from '../api/AdmProfile';
import AdmProfileService from '../service/AdmProfileService';

export default {
    setup() {
        const snackbar = ref<SnackbarMessage>(emptySnackbarMessage);

        const listaAdmPage = ref<AdmPage[]>([]);
        const admPageDialog = shallowRef(false)
        const deleteAdmPageDialog = ref(false);
        const deleteAdmPagesDialog = ref(false);
        const admPage = ref(emptyAdmPage);
        const selectedAdmPages = ref<number[]>([]);
        const submitted = ref(false);

        const admPageService = new AdmPageService();
        const admProfileService = new AdmProfileService();
        
        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        //const exportColumns = ref([]);

        const itemsPerPage = ref(10);
        const columns = ref();        
        const loading = ref(true);
        const totalItems = ref(0);
        const search = ref('');

        const sourceProfiles = ref<AdmProfile[]>([]);
        const targetProfiles = ref<AdmProfile[]>([]);

        onBeforeMount(() => {
            columns.value = [
                { key: 'id', title: 'Id', sortable: true, align: 'start' },
                { key: 'url', title: 'Página', sortable: true, align: 'start' },
                { key: 'description', title: 'Descrição', sortable: true, align: 'start' },
                { key: 'pageProfiles', title: 'Perfil(s) da página', sortable: true, align: 'start' },
                { key: 'actions', title: "Ações", sortable: false }
            ];            
        });

        onMounted(() => {
            loadItems();

            selectedTypeReport.value = PDFReport.value;
        });

        const loadItems = () => {
            loading.value = true;
            admPageService.findAll().then(data => {
                listaAdmPage.value = data;
                totalItems.value = listaAdmPage.value.length;
                loading.value = false;
            });
        }

        const snackBar = (msg: string, duration: number) => {
            snackbar.value.open = true;
            snackbar.value.message = msg;
            snackbar.value.timeout = duration;
        }

        const loadAdmProfiles = (admPage: AdmPage | null): void => {
            targetProfiles.value = [];

            if (admPage == null) {

                admProfileService.findAll().then(profiles => {
                    sourceProfiles.value = profiles;
                });

            } else {      
            
                if (admPage.id != null) {
                    admProfileService.findProfilesByPage(admPage).then(data => {
                    targetProfiles.value = data;

                        admProfileService.findAll().then(profiles => {
                            sourceProfiles.value = profiles.filter(profile => 
                                !targetProfiles.value.find(target => target.id === profile.id)
                            );
                        });

                    });
                }

            }            
        }

        const mostrarListar = () => {
            if (admPageDialog.value)
                return { display: 'none' };
            else
                return { display: '' };
        }

        const mostrarEditar = () => {
            if (admPageDialog.value)
                return { display: '' };
            else
                return { display: 'none' };
        }

        const onClean = () => {
            admPage.value = cleanAdmPage;
            loadAdmProfiles(null);
        }
                
        const onInsert = () => {
            admPage.value = emptyAdmPage;
            submitted.value = false;
            admPageDialog.value = true;
            loadAdmProfiles(null);
        };

        const onEdit = (param: AdmPage) => {
            admPage.value = { ...param };
            admPageDialog.value = true;
            loadAdmProfiles(admPage.value);
        };

        const hideDialog = () => {
            admPageDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;
            admPage.value.admIdProfiles = [];
            targetProfiles.value.forEach(item => {
                admPage.value.admIdProfiles.push(item.id)
            });

            if (admPage.value.description && admPage.value.description.trim()) {
                if (admPage.value.id) {
                    admPageService.update(admPage.value).then((obj: AdmPage) => {
                        admPage.value = obj;

                        if (admPage.value.id){
                            const index = admPageService.findIndexById(listaAdmPage.value, admPage.value.id);
                            listaAdmPage.value[index] = admPage.value;

                            admPageDialog.value = false;
                            admPage.value = emptyAdmPage;

                            snackBar('Página Atualizada', 3000);
                        }
                    });            
                } else {
                    admPageService.insert(admPage.value).then((obj: AdmPage) => {
                        admPage.value = obj;

                        listaAdmPage.value.push(admPage.value);
                        admPageDialog.value = false;
                        admPage.value = emptyAdmPage;

                        snackBar('Página Criada', 3000);
                    });            
                }

            }
        };

        const deleteSelected = () => {
            deleteAdmPagesDialog.value = true;
        }

        const onDelete = (param: AdmPage) => {
            deleteAdmPageDialog.value = true;
            admPage.value = { ...param };
        } 

        const confirmDeleteSelected = () => {            
            deleteAdmPagesDialog.value = false;
            
            let selecionados: AdmPage[] = [];
            listaAdmPage.value.forEach((item: AdmPage) => {
                selectedAdmPages.value.forEach((id: number) => {
                    if (item.id === id){
                        selecionados.push(item);
                    }
                });        
            });

            if (selecionados.length > 0){
                listaAdmPage.value = listaAdmPage.value.filter(
                    (val: AdmPage) => !selecionados.includes(val));

                    selecionados.forEach((item: AdmPage, index: number) => {
                    if (item.id){
                        admPageService.delete(item.id).then(() => {

                            if (selecionados.length == (index+1)){
                                snackBar('Parâmetros excluídos', 3000);
                                selectedAdmPages.value = [];
                            }

                        });
                    }
                });

            }
        }

        const confirmDelete = () => {
            deleteAdmPageDialog.value = false;
            if (admPage.value.id){
                admPageService.delete(admPage.value.id).then(() => {
                    listaAdmPage.value = listaAdmPage.value.filter((val: AdmPage) => val.id !== admPage.value.id);
                    admPage.value = emptyAdmPage;        
                    snackBar('Página excluída', 3000);
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
            admPageService.report(reportParamForm.value).then(() => {
                snackBar('Página exportada', 3000);
            });            
        }

        return { listaAdmPage, admPage, submitted, onClean, mostrarListar, mostrarEditar,
            selectedAdmPages, deleteSelected, admPageDialog, hideDialog,
            deleteAdmPageDialog, confirmDelete, deleteAdmPagesDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected, itemsPerPage, columns, loading, totalItems, search,
            snackbar, sourceProfiles, targetProfiles }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">

            <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout" location="top">
                {{ snackbar.message }}
                <template v-slot:actions>
                    <v-btn color="red" density="compact" icon="close" @click="snackbar.open = false"></v-btn>
                </template>
            </v-snackbar>

            <div class="card px-6 py-6" :style="mostrarListar()">
                <v-card-item>
                    <v-card-title>Página</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="deleteSelected" variant="elevated" color="red"
                        :disabled="!selectedAdmPages || !selectedAdmPages.length" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>    
                </v-toolbar>
                
                <v-data-table
                    v-model="selectedAdmPages"
                    v-model:items-per-page="itemsPerPage"
                    :headers="columns"
                    :items="listaAdmPage"
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
            </div>    

            <div :style="mostrarEditar()">
                <v-card title="Detalhes da página">
                    <v-toolbar>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" @click="hideDialog" variant="elevated">Cancelar</v-btn>
                        <v-btn prepend-icon="star" color="primary" :style="{ marginRight: '10px' }" @click="onClean" variant="elevated">Limpar</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="onSave" variant="elevated">Salvar</v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <v-row>
                            <v-text-field label="Página" v-model="admPage.url" required
                                :class="{ 'text-red': submitted && !admPage.url }">
                            </v-text-field>
                        </v-row>
                        <v-row>
                            <small class="text-red" v-if="submitted && !admPage.url">A página é obrigatória.</small>
                        </v-row>
                        <v-row>
                            <v-text-field label="Descrição" v-model="admPage.description" required
                                :class="{ 'text-red': submitted && !admPage.description }">
                            </v-text-field>                                
                        </v-row>
                        <v-row>
                            <small class="text-red" v-if="submitted && !admPage.description">A descrição é obrigatória.</small>
                        </v-row>
                        <v-row>
                            <label>Perfil(s) da página:</label>
                            <PickList :source="sourceProfiles" :target="targetProfiles"></PickList>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>

            <v-dialog v-model="deleteAdmPageDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="admPage">Tem certeza de que deseja excluir <b>{{ admPage.description }}</b>?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteAdmPageDialog = false" variant="elevated">Não</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
                    </template>
                </v-card>
            </v-dialog>

            <v-dialog v-model="deleteAdmPagesDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="admPage">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteAdmPagesDialog = false" variant="elevated">Não</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="confirmDeleteSelected" variant="elevated">Sim</v-btn>
                    </template>
                </v-card>
            </v-dialog>

        </div>
    </div>
</template>

<style>
.spacer {
    flex: 1 1 auto;
}
</style>