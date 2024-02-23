<script lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdmPageService from '../../admin/service/AdmPageService';
import { ExportService } from '../../base/services/ExportService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '../api/AdmPage';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { MenuItem } from '../../base/models/MenuItem';
import { AdmProfile, emptyAdmProfile } from '../api/AdmProfile';
import AdmProfileService from '../service/AdmProfileService';

export default {
    setup() {
        const toast = useToast();

        const listaAdmPage = ref<AdmPage[]>([]);
        const admPageDialog = ref(false);
        const deleteAdmPageDialog = ref(false);
        const deleteAdmPagesDialog = ref(false);
        const admPage = ref(emptyAdmPage);
        const selectedAdmPages = ref();
        const dt = ref(null);
        const filters = ref({});
        const cols = ref();
        const exportColumns = ref([]);
        const submitted = ref(false);

        const admPageService = new AdmPageService();
        const admProfileService = new AdmProfileService();
        const exportService = new ExportService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const popupMenu = ref();
        const itemsMenuLinha = ref<MenuItem[]>([]);

        const pageProfiles = ref<AdmProfile[][]>();

        onBeforeMount(() => {
            initFilters();
        });

        onMounted(() => {
            admPageService.findAll().then((data) => (listaAdmPage.value = data));

            selectedTypeReport.value = PDFReport.value;

            itemsMenuLinha.value = [{ label: "Editar" }, { label: "Excluir" }];

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'url', header: 'Página' },
                { field: 'description', header: 'Descrição' },
                { field: 'pageProfiles', header: 'Perfil(s) da página' }
            ];

            exportColumns.value = cols.value.map((col: { header: any; field: any; }) => ({title: col.header, dataKey: col.field}));

        });

        const toggleMenu = (event: any, rowData: AdmPage) => {
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

        const loadAdmProfiles = (admPage: AdmPage | null): void => {
            let sourceProfiles: AdmProfile[] = [];
            let targetProfiles: AdmProfile[] = [];

            if (admPage.id == null) {

                admProfileService.findAll().then(profiles => pageProfiles.value = [profiles, []]);

            } else {
                admProfileService.findProfilesByPage(admPage).then(item => {
                    targetProfiles = item;

                    admProfileService.findAll().then(profiles => {
                        sourceProfiles = profiles.filter(profile => !item.find(target => target.id === profile.id));

                        pageProfiles.value = [sourceProfiles, targetProfiles];
                    });
                });                            
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
            pageProfiles.value?.forEach((value: AdmProfile[]) => {
                let sourceProfiles: AdmProfile[] = value;

                sourceProfiles.forEach((value: AdmProfile) => {
                    let targetProfile: AdmProfile = value;
                    admPage.value.admIdProfiles.push(targetProfile.id);
                });
            });

            if (admPage.value.description && admPage.value.description.trim()) {
                if (admPage.value.id) {
                    admPageService.update(admPage.value).then((obj: AdmPage) => {
                        admPage.value = obj;

                        const index = admPageService.findIndexById(listaAdmPage.value, admPage.value.id);
                        listaAdmPage.value[index] = admPage.value;

                        toast.add({severity:'success', summary: 'Successful', detail: 'Página Atualizada', life: 3000});
                    });            
                } else {
                    admPageService.insert(admPage.value).then((obj: AdmPage) => {
                        admPage.value = obj;

                        listaAdmPage.value.push(admPage.value);
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Página Criada', life: 3000 });
                    });            
                }

                admPageDialog.value = false;
                admPage.value = emptyAdmPage;
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
            listaAdmPage.value = listaAdmPage.value.filter((val: AdmPage) => !selectedAdmPages.value.includes(val));

            let excluiu = false;
            selectedAdmPages.value.forEach((item: AdmPage) => {
                admPageService.delete(item.id).then(obj => {
                    excluiu = true;
                });
            });

            if (excluiu) {
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Páginas excluídas', life: 3000 });
                selectedAdmPages.value = [];
            }
        }

        const confirmDelete = () => {
            deleteAdmPageDialog.value = false;
            admPageService.delete(admPage.value.id).then(obj => {
                listaAdmPage.value = listaAdmPage.value.filter((val: AdmPage) => val.id !== admPage.value.id);
                admPage.value = emptyAdmPage;        
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Página excluída', life: 3000 });
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
            admPageService.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Página exportada', 
                    detail: 'Página exportada', life: 3000 });
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
            listaAdmPage.value.forEach((item: AdmPage) => data.push(
                [item.id, item.url, item.description, item.pageProfiles]
            ));

            exportService.exportPdf(head, data, 'paginas.pdf');
        }

        const exportExcel = () => {
            exportService.exportExcel(listaAdmPage.value, 'paginas');
        }


        return { listaAdmPage, admPage, filters, submitted, itemsMenuLinha, toggleMenu, popupMenu,
            selectedAdmPages, deleteSelected, admPageDialog, hideDialog, mostrarListar, mostrarEditar, onClean,
            deleteAdmPageDialog, confirmDelete, deleteAdmPagesDialog, pageProfiles,
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
                <Panel header="Página" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="deleteSelected" 
                                :disabled="!selectedAdmPages || !selectedAdmPages.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <Menu ref="popupMenu" id="popup_menu" :model="itemsMenuLinha" :popup="true" />

                <DataTable
                    ref="dt" paginatorPosition="both"
                    :value="listaAdmPage"
                    v-model:selection="selectedAdmPages"
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
                    <Column field="url" header="Página" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Página</span>
                            {{ slotProps.data.url }}
                        </template>
                    </Column>
                    <Column field="description" header="Descrição" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descrição</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="pageProfiles" header="Perfil(s) da página" :sortable="true" headerStyle="min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Perfil(s) da página</span>
                            {{ slotProps.data.pageProfiles }}
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
                            No total existem {{listaAdmPage ? listaAdmPage.length : 0 }} páginas.
                        </div>
                    </template>

                </DataTable>
            </div>

            <div :style="mostrarEditar()">
                <!-- <Toast /> -->
                <Panel header="Detalhes da página" class="p-mb-2">
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
                            <label for="url">Página:</label>
                            <InputText id="url" v-model="admPage.url" required="true" :class="{'p-invalid': submitted && !admPage.url}" />
                            <small class="p-invalid" v-if="submitted && !admPage.url">A página é obrigatória.</small>
                        </div>
                        <div class="field">
                            <label for="description">Descrição</label>
                            <InputText id="description" v-model="admPage.description" required="true"
                                :class="{ 'p-invalid': submitted && !admPage.description }" />
                            <small class="p-invalid" v-if="submitted && !admPage.description">A descrição é obrigatória.</small>
                        </div>
                        <div class="field">
                            <label for="pageProfiles">Perfil(s) da página:</label>
                            <PickList v-model="pageProfiles" dataKey="id">
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

            <Dialog v-model:visible="deleteAdmPageDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="admPage">Tem certeza de que deseja excluir <b>{{ admPage.description }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmPageDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteAdmPagesDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="admPage">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmPagesDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDeleteSelected" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
