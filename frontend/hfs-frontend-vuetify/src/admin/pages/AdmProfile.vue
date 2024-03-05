<script lang="ts">
import { ref, onMounted, onBeforeMount, shallowRef } from 'vue';
import AdmProfileService from '../../admin/service/AdmProfileService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '../api/AdmProfile';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { SnackbarMessage, emptySnackbarMessage } from '../../base/models/SnackbarMessage';
import { AdmPage } from '../api/AdmPage';
import AdmPageService from '../service/AdmPageService';

export default {
    setup() {
        const snackbar = ref<SnackbarMessage>(emptySnackbarMessage);

        const listaAdmProfile = ref<AdmProfile[]>([]);
        const admProfileDialog = shallowRef(false)
        const deleteAdmProfileDialog = ref(false);
        const deleteAdmProfilesDialog = ref(false);
        const admProfile = ref(emptyAdmProfile);
        const selectedAdmProfiles = ref<number[]>([]);
        const submitted = ref(false);

        const admProfileService = new AdmProfileService();
        const admPageService = new AdmPageService();        
        
        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        //const exportColumns = ref([]);

        const itemsPerPage = ref(10);
        const columns = ref();        
        const loading = ref(true);
        const totalItems = ref(0);
        const search = ref('');

        const sourcePages = ref<AdmPage[]>([]);
        const targetPages = ref<AdmPage[]>([]);

        onBeforeMount(() => {
            columns.value = [
                { key: 'id', title: 'Id', sortable: true, align: 'start' },
                { key: 'description', title: 'Descrição', sortable: true, align: 'start' },
                { key: 'profilePages', title: 'Páginas(s) do perfil', sortable: true, align: 'start' },
                { key: 'actions', title: "Ações", sortable: false }
            ];            
        });

        onMounted(() => {
            loadItems();

            selectedTypeReport.value = PDFReport.value;
        });

        const loadItems = () => {
            loading.value = true;
            admProfileService.findAll().then(data => {
                listaAdmProfile.value = data;
                totalItems.value = listaAdmProfile.value.length;
                loading.value = false;
            });
        }

        const snackBar = (msg: string, duration: number) => {
            snackbar.value.open = true;
            snackbar.value.message = msg;
            snackbar.value.timeout = duration;
        }

        const loadAdmPages = () =>{
            targetPages.value = [];
            if (admProfile.value.id != null) {
                targetPages.value = [...admProfile.value.admPages];
            }
            admPageService.findAll().then(pages => {
                sourcePages.value = pages.filter(pager => !targetPages.value.find(target => target.id === pager.id));
            });
        }

        const mostrarListar = () => {
            if (admProfileDialog.value)
                return { display: 'none' };
            else
                return { display: '' };
        }

        const mostrarEditar = () => {
            if (admProfileDialog.value)
                return { display: '' };
            else
                return { display: 'none' };
        }

        const onClean = () => {
            admProfile.value = cleanAdmProfile;
            loadAdmPages();
        }
                
        const onInsert = () => {
            admProfile.value = emptyAdmProfile;
            submitted.value = false;
            admProfileDialog.value = true;
            loadAdmPages();
        };

        const onEdit = (param: AdmProfile) => {
            admProfile.value = { ...param };
            admProfileDialog.value = true;
            loadAdmPages();
        };

        const hideDialog = () => {
            admProfileDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;
            admProfile.value.admPages = [];
            targetPages.value.forEach(item => {
                admProfile.value.admPages.push(item)
            });

            if (admProfile.value.description && admProfile.value.description.trim()) {
                if (admProfile.value.id) {
                    admProfileService.update(admProfile.value).then((obj: AdmProfile) => {
                        admProfile.value = obj;

                        if (admProfile.value.id){
                            const index = admProfileService.findIndexById(listaAdmProfile.value, admProfile.value.id);
                            listaAdmProfile.value[index] = admProfile.value;

                            admProfileDialog.value = false;
                            admProfile.value = emptyAdmProfile;

                            snackBar('Perfil Atualizado', 3000);
                        }
                    });            
                } else {
                    admProfileService.insert(admProfile.value).then((obj: AdmProfile) => {
                        admProfile.value = obj;

                        listaAdmProfile.value.push(admProfile.value);
                        admProfileDialog.value = false;
                        admProfile.value = emptyAdmProfile;

                        snackBar('Perfil Criado', 3000);
                    });            
                }

            }
        };

        const deleteSelected = () => {
            deleteAdmProfilesDialog.value = true;
        }

        const onDelete = (param: AdmProfile) => {
            deleteAdmProfileDialog.value = true;
            admProfile.value = { ...param };
        } 

        const confirmDeleteSelected = () => {            
            deleteAdmProfilesDialog.value = false;
            
            let selecionados: AdmProfile[] = [];
            listaAdmProfile.value.forEach((item: AdmProfile) => {
                selectedAdmProfiles.value.forEach((id: number) => {
                    if (item.id === id){
                        selecionados.push(item);
                    }
                });        
            });

            if (selecionados.length > 0){
                listaAdmProfile.value = listaAdmProfile.value.filter(
                    (val: AdmProfile) => !selecionados.includes(val));

                    selecionados.forEach((item: AdmProfile, index: number) => {
                    if (item.id){
                        admProfileService.delete(item.id).then(() => {

                            if (selecionados.length == (index+1)){
                                snackBar('perfis excluídos', 3000);
                                selectedAdmProfiles.value = [];
                            }

                        });
                    }
                });

            }
        }

        const confirmDelete = () => {
            deleteAdmProfileDialog.value = false;
            if (admProfile.value.id){
                admProfileService.delete(admProfile.value.id).then(() => {
                    listaAdmProfile.value = listaAdmProfile.value.filter((val: AdmProfile) => val.id !== admProfile.value.id);
                    admProfile.value = emptyAdmProfile;        
                    snackBar('Perfil excluído', 3000);
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
            admProfileService.report(reportParamForm.value).then(() => {
                snackBar('Perfil exportado', 3000);
            });            
        }

        return { listaAdmProfile, admProfile, submitted, onClean, mostrarListar, mostrarEditar,
            selectedAdmProfiles, deleteSelected, admProfileDialog, hideDialog,
            deleteAdmProfileDialog, confirmDelete, deleteAdmProfilesDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected, itemsPerPage, columns, loading, totalItems, search,
            snackbar, sourcePages, targetPages }
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
                    <v-card-title>Perfil</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="deleteSelected" variant="elevated" color="red"
                        :disabled="!selectedAdmProfiles || !selectedAdmProfiles.length" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>    
                </v-toolbar>
                
                <v-data-table
                    v-model="selectedAdmProfiles"
                    v-model:items-per-page="itemsPerPage"
                    :headers="columns"
                    :items="listaAdmProfile"
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
                <v-card title="Detalhes do perfil">
                    <v-toolbar>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" @click="hideDialog" variant="elevated">Cancelar</v-btn>
                        <v-btn prepend-icon="star" color="primary" :style="{ marginRight: '10px' }" @click="onClean" variant="elevated">Limpar</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="onSave" variant="elevated">Salvar</v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <v-row>
                            <v-text-field label="Descrição" v-model="admProfile.description" required
                                :class="{ 'text-red': submitted && !admProfile.description }">
                            </v-text-field>                                
                        </v-row>
                        <v-row>
                            <small class="text-red" v-if="submitted && !admProfile.description">A descrição é obrigatória.</small>
                        </v-row>
                        <v-row>
                            <label>Página(s):</label>
                            <PickList :source="sourcePages" :target="targetPages"></PickList>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>

            <v-dialog v-model="deleteAdmProfileDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="admProfile">Tem certeza de que deseja excluir <b>{{ admProfile.description }}</b>?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteAdmProfileDialog = false" variant="elevated">Não</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
                    </template>
                </v-card>
            </v-dialog>

            <v-dialog v-model="deleteAdmProfilesDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="admProfile">Tem certeza de que deseja excluir os perfis selecionados?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteAdmProfilesDialog = false" variant="elevated">Não</v-btn>
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