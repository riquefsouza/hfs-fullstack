<script lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdmProfileService from '../../admin/service/AdmProfileService';
import { ExportService } from '../../base/services/ExportService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '../api/AdmProfile';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { MenuItem } from '../../base/models/MenuItem';
import { AdmPage } from '../api/AdmPage';
import AdmPageService from '../service/AdmPageService';

export default {
    setup() {
        const toast = useToast();

        const listaAdmProfile = ref<AdmProfile[]>([]);
        const admProfileDialog = ref(false);
        const deleteAdmProfileDialog = ref(false);
        const deleteAdmProfilesDialog = ref(false);
        const admProfile = ref(emptyAdmProfile);
        const selectedAdmProfiles = ref();
        const dt = ref(null);
        const filters = ref({});
        const cols = ref();
        const exportColumns = ref([]);
        const submitted = ref(false);

        const admProfileService = new AdmProfileService();
        const admPageService = new AdmPageService();
        const exportService = new ExportService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const popupMenu = ref();
        const itemsMenuLinha = ref<MenuItem[]>([]);

        const profilePages = ref<AdmPage[][]>();

        onBeforeMount(() => {
            initFilters();
        });

        onMounted(() => {
            admProfileService.findAll().then((data) => (listaAdmProfile.value = data));

            selectedTypeReport.value = PDFReport.value;

            itemsMenuLinha.value = [{ label: "Editar" }, { label: "Excluir" }];

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'description', header: 'Descrição' },
                { field: 'profilePages', header: 'Páginas(s) do perfil' }
            ];

            exportColumns.value = cols.value.map((col: { header: any; field: any; }) => ({title: col.header, dataKey: col.field}));

        });

        const toggleMenu = (event: any, rowData: AdmProfile) => {
            itemsMenuLinha.value = [];

            itemsMenuLinha.value.push({
                label: 'Editar',
                command: (event: any) => {
                    onEdit(rowData);
                }
            });

            itemsMenuLinha.value.push({
                label: 'Excluir',
                command: (event: any) => {
                    onDelete(rowData);
                }
            });
            
            popupMenu.value.toggle(event);
        }

        const loadAdmPages = () => {
            let sourcePages: AdmPage[] = [];
            let targetPages: AdmPage[] = [];
            
            if (admProfile.value.id != null) {
                targetPages = [...admProfile.value.admPages];
            }

            admPageService.findAll().then(pages => {
                sourcePages = pages.filter(page => !targetPages.find(target => target.id === page.id));

                profilePages.value = [sourcePages, targetPages];
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
            profilePages.value?.forEach((value: AdmPage[]) => {
                let sourcePages: AdmPage[] = value;

                sourcePages.forEach((value: AdmPage) => {
                    let targetPages: AdmPage = value;
                    admProfile.value.admPages.push(targetPages);
                });
            });

            if (admProfile.value.description && admProfile.value.description.trim()) {
                if (admProfile.value.id) {
                    admProfileService.update(admProfile.value).then((obj: AdmProfile) => {
                        admProfile.value = obj;

                        const index = admProfileService.findIndexById(listaAdmProfile.value, admProfile.value.id);
                        listaAdmProfile.value[index] = admProfile.value;

                        toast.add({severity:'success', summary: 'Successful', detail: 'Perfil Atualizada', life: 3000});
                    });            
                } else {
                    admProfileService.insert(admProfile.value).then((obj: AdmProfile) => {
                        admProfile.value = obj;

                        listaAdmProfile.value.push(admProfile.value);
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Perfil Criada', life: 3000 });
                    });            
                }

                admProfileDialog.value = false;
                admProfile.value = emptyAdmProfile;
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
            listaAdmProfile.value = listaAdmProfile.value.filter((val: AdmProfile) => !selectedAdmProfiles.value.includes(val));

            let excluiu = false;
            selectedAdmProfiles.value.forEach((item: AdmProfile) => {
                admProfileService.delete(item.id).then(obj => {
                    excluiu = true;
                });
            });

            if (excluiu) {
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfis excluídos', life: 3000 });
                selectedAdmProfiles.value = [];
            }
        }

        const confirmDelete = () => {
            deleteAdmProfileDialog.value = false;
            admProfileService.delete(admProfile.value.id).then(obj => {
                listaAdmProfile.value = listaAdmProfile.value.filter((val: AdmProfile) => val.id !== admProfile.value.id);
                admProfile.value = emptyAdmProfile;        
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil excluído', life: 3000 });
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
            admProfileService.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Perfil exportada', 
                    detail: 'Perfil exportada', life: 3000 });
            });
        }

        const initFilters = () => {
            filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        };

        const exportPdf = () => {
            const head: string[] = [];
            const data: any[] = [];

            exportColumns.value.forEach((item: { title: string; }) => head.push(item.title));
            listaAdmProfile.value.forEach((item: AdmProfile) => data.push(
                [item.id, item.description, item.profilePages]
            ));

            exportService.exportPdf(head, data, 'perfis.pdf');
        }

        const exportExcel = () => {
            exportService.exportExcel(listaAdmProfile.value, 'perfis');
        }


        return { listaAdmProfile, admProfile, filters, submitted, itemsMenuLinha, toggleMenu, popupMenu,
            selectedAdmProfiles, deleteSelected, admProfileDialog, hideDialog, mostrarListar, mostrarEditar, onClean,
            deleteAdmProfileDialog, confirmDelete, deleteAdmProfilesDialog, profilePages,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6" :style="mostrarListar()">
                <!-- <Toast /> -->
                <Panel header="Perfil" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="deleteSelected" 
                                :disabled="!selectedAdmProfiles || !selectedAdmProfiles.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <Menu ref="popupMenu" id="popup_menu" :model="itemsMenuLinha" :popup="true" />

                <DataTable
                    ref="dt" paginatorPosition="both"
                    :value="listaAdmProfile"
                    v-model:selection="selectedAdmProfiles"
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
                            <h5 class="m-0">Gerenciar páginas</h5>
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
                    <Column field="description" header="Descrição" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descrição</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="profilePages" header="Páginas(s) do perfil" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Páginas(s) do perfil</span>
                            {{ slotProps.data.profilePages }}
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
                            No total existem {{listaAdmProfile ? listaAdmProfile.length : 0 }} perfis.
                        </div>
                    </template>

                </DataTable>
            </div>

            <div :style="mostrarEditar()">
                <!-- <Toast /> -->
                <Panel header="Detalhes do perfil" class="p-mb-2">
                    <Toolbar class="mb-4">
                        <template v-slot:start>
                        </template>
                        <template v-slot:end>
                            <div class="my-2">
                                <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary mr-2" @click="hideDialog"></button>
                                <Button label="Limpar" icon="pi pi-star-o" class="p-button-primary mr-2" @click="onClean"></button>
                                <Button label="Salvar" icon="pi pi-check" class="p-button-success" @click="onSave"></button>        
                            </div>
                        </template>
                    </Toolbar>         
                    <div class="card p-fluid">
                        <div class="field">
                            <label for="description">Descrição</label>
                            <InputText id="description" v-model="admProfile.description" required="true"
                                :class="{ 'p-invalid': submitted && !admProfile.description }" />
                            <small class="p-invalid" v-if="submitted && !admProfile.description">A descrição é obrigatória.</small>
                        </div>
                        <div class="field">
                            <label for="profilePages">Página(s):</label>
                            <PickList v-model="profilePages" dataKey="id">
                                <template #sourceheader>Disponível</template>
                                <template #targetheader>Selecionada</template>
                                <template #item="slotProps">
                                    <div>
                                        {{slotProps.item.description}}
                                    </div>
                                </template>
                            </PickList>                                
                        </div>
                    </div>               
                </Panel>                
            </div>

            <Dialog v-model:visible="deleteAdmProfileDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="admProfile">Tem certeza de que deseja excluir <b>{{ admProfile.description }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmProfileDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteAdmProfilesDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="admProfile">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmProfilesDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDeleteSelected" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
