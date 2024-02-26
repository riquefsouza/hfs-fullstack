<script lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import AdmMenuService from '../../admin/service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../api/AdmMenu';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import AdmPageService from '../service/AdmPageService';
import { TreeExpandedKeys, TreeNode } from 'primevue/tree';
import { emptyTreeNode } from '../../base/models/NodeOnSelectEventType';
import { AdmPage } from '../api/AdmPage';

export default {
    setup() {
        const toast = useToast();

        const listaAdmMenu = ref<AdmMenu[]>([]);
        const admMenuDialog = ref(false);
        const deleteAdmMenuDialog = ref(false);
        const deleteAdmMenusDialog = ref(false);
        const admMenu = ref<AdmMenu>(emptyAdmMenu);
        const selectedAdmMenu = ref<AdmMenu>(emptyAdmMenu);
        //const dt = ref(null);
        const filters = ref({});
        const submitted = ref<boolean>(false);

        const admMenuService = new AdmMenuService();
        const admPageService = new AdmPageService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const cols = ref<any[]>([]);
        const exportColumns = ref<any[]>([]);

        const listaNodeMenu = ref<TreeNode[]>([]);
        const expandedKeys = ref<TreeExpandedKeys>({});
        const selectedNodeMenu = ref<TreeNode>(emptyTreeNode);
        //const menuRoot = ref<TreeNode>(emptyTreeNode);
        const listaAdmPage = ref<AdmPage[]>([]);
        const listaAdmMenuParent = ref<AdmMenu[]>([]);

        onBeforeMount(() => {
            initFilters();
        });

        onMounted(() => {
            atualizarArvore();

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'description', header: 'Description' }
            ];

            exportColumns.value= cols.value.map(col => ({title: col.header, dataKey: col.field}));

            selectedTypeReport.value = PDFReport.value;
        });

        const atualizarArvore = () => {
            listaNodeMenu.value = [];
            listaAdmMenu.value = [];
            listaAdmMenuParent.value = [];
            
            admPageService.findAll().then(data => listaAdmPage.value = data);
        
            admMenuService.findAll().then(data => {
                listaAdmMenu.value = data;
        
                listaAdmMenuParent.value = listaAdmMenu.value.filter(menu => menu.idMenuParent == null);
        
                updateMenusTree(listaAdmMenu.value);
            });
        }
        
        const updateMenusTree = (listaMenu: AdmMenu[]): void => {
            const _listaNodeMenu: TreeNode[] = [];
            let _listaAdmMenuParent: AdmMenu[] = [];
            const menuRoot: TreeNode = {
                'key': '0',
                'label': 'Menu do sistema',
                'data': '0',
                'children': []
            };

            _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);    

            _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
                const m: TreeNode = {
                    'key' : itemMenu.id?.toString(),
                    'label': itemMenu.description,
                    'data': itemMenu,
                    'children': mountSubMenu(listaMenu, itemMenu)
                };
                if (menuRoot.children){
                    menuRoot.children.push(m);
                }                
            });

            _listaNodeMenu.push(menuRoot);

            listaNodeMenu.value = _listaNodeMenu;

            expandAll();
        }
        
        const isSubMenu = (menu: AdmMenu): boolean => {
            return menu.idPage === null;
        }
        
        const getAdmSubMenus = (listaMenu: AdmMenu[], menuPai: AdmMenu): AdmMenu[] => {
            return listaMenu.filter(menu => menu.idMenuParent === menuPai.id);
        }
        
        const mountSubMenu = (listaMenu: AdmMenu[], menu: AdmMenu): TreeNode[] => {
            const lstSubMenu: TreeNode[] = [];

            getAdmSubMenus(listaMenu, menu).forEach((subMenu: AdmMenu) => {
            
                if (isSubMenu(subMenu)) {
                    const m: TreeNode = {
                        'key' : subMenu.id?.toString(),
                        'label': subMenu.description,
                        'data': subMenu,
                        'children': mountSubMenu(listaMenu, subMenu)
                    };
                } else {
                    const m: TreeNode = {
                        'key' : subMenu.id?.toString(),
                        'label': subMenu.description,
                        'data': subMenu,
                        'children': []
                    };
                    lstSubMenu.push(m);
                }

            });

            return lstSubMenu;
        }
        
        const onNodeSelect = (node: TreeNode) => {
            const _menu: AdmMenu = node.data as AdmMenu;
            selectedAdmMenu.value = _menu;            
            selectedNodeMenu.value = node;
        }

        const onInsert = () => {
            admMenu.value = emptyAdmMenu;
            submitted.value = false;
            admMenuDialog.value = true;
        };

        const onEdit = (param: AdmMenu) => {
            admMenu.value = { ...param };
            admMenuDialog.value = true;
        };

        const onDelete = (param: AdmMenu) => {
            deleteAdmMenuDialog.value = true;
            admMenu.value = { ...param };
        } 

        const confirmDelete = (param: AdmMenu) => {
            deleteAdmMenuDialog.value = false;
            if (param.id){
                admMenuService.delete(param.id).then(() => {
                    listaAdmMenu.value = listaAdmMenu.value.filter((val: AdmMenu) => val.id !== param.id);
                    admMenu.value = emptyAdmMenu;
                    updateMenusTree(listaAdmMenu.value);     
                    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Menu excluído', life: 3000 });
                });
            }
        }

        const hideDialog = () => {
            admMenuDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;
            if (admMenu.value.admPage!=null){
                if (admMenu.value.admPage.id){
                    admMenu.value.idPage = admMenu.value.admPage.id;
                }
            }
            if (admMenu.value.admMenuParent!=null){
                if (admMenu.value.admMenuParent.id){
                    admMenu.value.idMenuParent = admMenu.value.admMenuParent.id;
                }
            }

            if (admMenu.value.description && admMenu.value.description.trim()) {
                if (admMenu.value.id) {
                    admMenuService.update(admMenu.value).then((obj: AdmMenu) => {
                        admMenu.value = obj;

                        selectedNodeMenu.value.label = admMenu.value.description;
                        selectedNodeMenu.value.data = admMenu.value;

                        if (admMenu.value.id){
                            const index = admMenuService.findIndexById(listaAdmMenu.value, admMenu.value.id);
                            listaAdmMenu.value[index] = admMenu.value;

                            admMenuDialog.value = false;
                            admMenu.value = emptyAdmMenu;
                            updateMenusTree(listaAdmMenu.value);

                            toast.add({severity:'success', summary: 'Successful', detail: 'Menu Atualizada', life: 3000});
                        }
                    });            
                } else {
                    admMenuService.insert(admMenu.value).then((obj: AdmMenu) => {
                        admMenu.value = obj;

                        listaAdmMenu.value.push(admMenu.value);

                        listaAdmMenuParent.value = listaAdmMenu.value.filter(menu => menu.idMenuParent == null);

                        admMenuDialog.value = false;
                        admMenu.value = emptyAdmMenu;
                        updateMenusTree(listaAdmMenu.value);

                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Menu Criada', life: 3000 });
                    });            
                }

            }
        };

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
            admMenuService.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Menu exportada', 
                    detail: 'Menu exportada', life: 3000 });
            });
        }

        const initFilters = () => {
            filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        };

        const expandAll = () => {
            for (let node of listaNodeMenu.value) {
                expandNode(node);
            }

            expandedKeys.value = { ...expandedKeys.value };
        };

        const collapseAll = () => {
            expandedKeys.value = {};
        };

        const expandNode = (node: TreeNode) => {
            if (node.children && node.children.length) {
                if (node.key){
                    expandedKeys.value[node.key] = true;

                    for (let child of node.children) {
                        expandNode(child);
                    }
                }
            }
        };

        return { listaAdmMenu, admMenu, filters, submitted, expandAll, collapseAll, listaAdmPage,
            selectedAdmMenu, admMenuDialog, hideDialog, listaNodeMenu, selectedNodeMenu, listaAdmMenuParent,
            deleteAdmMenuDialog, confirmDelete, deleteAdmMenusDialog, onNodeSelect, expandedKeys,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <!-- <Toast /> -->
                <Panel header="Menu" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Editar" icon="pi pi-pencil" class="p-button-warning mr-2" @click="onEdit(selectedAdmMenu)" 
                                :disabled="!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="onDelete(selectedAdmMenu)" 
                                :disabled="!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button type="button" label="Expandir todos"  class="mr-2" @click="expandAll" />
                        <Button type="button" label="Recolher todos" class="mr-2" @click="collapseAll" />

                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <Tree v-model:expandedKeys="expandedKeys" :value="listaNodeMenu" selectionMode="single" 
                    v-model:selectionKeys="selectedNodeMenu" :metaKeySelection="false" @nodeSelect="onNodeSelect" />

                <Dialog v-model:visible="admMenuDialog" :style="{ width: '450px' }" header="Detalhes do menu" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="admPage">Página:</label>
                        <Dropdown id="admPage" v-model="admMenu.admPage" :options="listaAdmPage" optionLabel="description"></Dropdown>
                    </div>
                    <div class="field">
                        <label for="description">Nome do menu:</label>
                        <InputText id="description" v-model="admMenu.description" required="true"
                            :class="{ 'p-invalid': submitted && !admMenu.description }" />
                        <small class="p-invalid" v-if="submitted && !admMenu.description">O nome do menu é obrigatório.</small>
                    </div>
                    <div class="field">
                        <label for="admMenuParent">Página:</label>
                        <Dropdown id="admMenuParent" v-model="admMenu.admMenuParent" :options="listaAdmMenuParent" optionLabel="description"></Dropdown>
                    </div>
                    <div class="field">
                        <label for="quantity">Ordem</label>
                        <InputNumber id="quantity" v-model="admMenu.order" integeronly locale="pt-BR" required="true"
                            :class="{ 'p-invalid': submitted && !admMenu.order }" />
                        <small class="p-invalid" v-if="submitted && !admMenu.order">A ordem é obrigatória.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="onSave" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAdmMenuDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="admMenu">Tem certeza de que deseja excluir <b>{{ admMenu.description }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteAdmMenuDialog = false" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete(selectedAdmMenu)" />
                    </template>
                </Dialog>

            </div>
        </div>
    </div>
</template>
