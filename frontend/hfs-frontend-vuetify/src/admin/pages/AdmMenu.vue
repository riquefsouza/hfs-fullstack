<script lang="ts">
import { ref, onMounted, shallowRef } from 'vue';
import AdmMenuService from '../../admin/service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../api/AdmMenu';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { SnackbarMessage, emptySnackbarMessage } from '../../base/models/SnackbarMessage';
import AdmPageService from '../service/AdmPageService';
import { TreeNode, emptyTreeNode } from '../../base/models/TreeNode';
import { AdmPage } from '../api/AdmPage';
import TreeView from '../../base/components/TreeView.vue';

export default {
    setup() {
        const snackbar = ref<SnackbarMessage>(emptySnackbarMessage);

        const listaAdmMenu = ref<AdmMenu[]>([]);
        const admMenuDialog = shallowRef(false)
        const deleteAdmMenuDialog = ref(false);

        const admMenu = ref(emptyAdmMenu);
        const selectedAdmMenu = ref<AdmMenu>(emptyAdmMenu);
        const submitted = ref(false);

        const admMenuService = new AdmMenuService();
        const admPageService = new AdmPageService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const cols = ref<any[]>([]);
        const exportColumns = ref<any[]>([]);

        const listaNodeMenu = ref<TreeNode[]>([]);
        const selectedNodeMenu = ref<TreeNode>(emptyTreeNode);

        const listaAdmPage = ref<AdmPage[]>([]);
        const listaAdmMenuParent = ref<AdmMenu[]>([]);

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
            /*
            const menuRoot: TreeNode = {
                'key': '0',
                'label': 'Menu do sistema',
                'data': '0',
                'children': []
            };
            */
            _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);    

            _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
                const m: TreeNode = {
                    'key' : itemMenu.id?.toString(),
                    'label': itemMenu.description,
                    'data': itemMenu,
                    'children': mountSubMenu(listaMenu, itemMenu)
                };
                /*
                if (menuRoot.children){
                    menuRoot.children.push(m);
                } 
                */               

                _listaNodeMenu.push(m);
            });
            
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

        const snackBar = (msg: string, duration: number) => {
            snackbar.value.open = true;
            snackbar.value.message = msg;
            snackbar.value.timeout = duration;
        }

        const onNodeSelected = (param: { node: TreeNode }) => {
            const _menu: AdmMenu = param.node.data as AdmMenu;
            selectedAdmMenu.value = _menu;            
            selectedNodeMenu.value = param.node;
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

                            snackBar('Categoria de parâmetro Atualizada', 3000);
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

                        snackBar('Categoria de parâmetro Criada', 3000);
                    });            
                }
            }
        };

        const onDelete = (param: AdmMenu) => {
            deleteAdmMenuDialog.value = true;
            admMenu.value = { ...param };
        } 

        const confirmDelete = () => {
            deleteAdmMenuDialog.value = false;
            if (admMenu.value.id){
                admMenuService.delete(admMenu.value.id).then(() => {
                    listaAdmMenu.value = listaAdmMenu.value.filter((val: AdmMenu) => val.id !== admMenu.value.id);
                    admMenu.value = emptyAdmMenu;      
                    updateMenusTree(listaAdmMenu.value);       
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
            admMenuService.report(reportParamForm.value).then(() => {
                snackBar('Categoria de parâmetro exportada', 3000);
            });            
        }

        const expandAll = () => {
        };

        const collapseAll = () => {
        };

        return { listaAdmMenu, admMenu, submitted, snackbar, admMenuDialog, hideDialog, listaAdmPage, 
            listaAdmMenuParent, listaNodeMenu, onNodeSelected,
            deleteAdmMenuDialog, confirmDelete, selectedAdmMenu, emptyAdmMenu, expandAll, collapseAll,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange }
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
                    <v-card-title>Categoria de parâmetro de configuração</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="onEdit(selectedAdmMenu)" variant="elevated" color="yellow"
                        :disabled="selectedAdmMenu === emptyAdmMenu" :style="{ marginRight: '10px' }">Editar</v-btn>
                    <v-btn prepend-icon="delete" @click="onDelete(selectedAdmMenu)" variant="elevated" color="red"
                        :disabled="selectedAdmMenu === emptyAdmMenu" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>
                </v-toolbar>

                <TreeView :menuRoot="listaNodeMenu" @onNodeSelected="onNodeSelected"></TreeView>

                <v-dialog v-model="admMenuDialog" width="500">
                    <v-card title="Detalhes da categoria de parâmetro">
                        <v-card-text>
                            <v-row>
                                <v-select label="Página" v-model="admMenu.admPage"
                                    :items="listaAdmPage" item-title="description"></v-select>
                            </v-row>
                            <v-row>
                                <v-text-field label="Nome do menu" v-model="admMenu.description" required
                                    :class="{ 'text-red': submitted && !admMenu.description }">
                                </v-text-field>
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admMenu.description">O nome do menu é obrigatório.</small>
                            </v-row>
                            <v-row>
                                <v-select label="Menu pai" v-model="admMenu.admMenuParent"
                                    :items="listaAdmMenuParent" item-title="description"></v-select>
                            </v-row>
                            <v-row>
                                <v-text-field type="number" label="Ordem" v-model="admMenu.order" required
                                    :class="{ 'text-red': submitted && !admMenu.order }">
                                </v-text-field>
                            </v-row>
                            <v-row>
                                <small class="text-red" v-if="submitted && !admMenu.order">A ordem é obrigatória.</small>
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

                <v-dialog v-model="deleteAdmMenuDialog" max-width="450" persistent>
                    <v-card prepend-icon="warning" title="Confirme">
                        <v-card-text>
                            <span v-if="admMenu">Tem certeza de que deseja excluir <b>{{ admMenu.description }}</b>?</span>
                        </v-card-text>                        
                        <template v-slot:actions>
                            <v-spacer></v-spacer>
                            <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                                @click="deleteAdmMenuDialog = false" variant="elevated">Não</v-btn>
                            <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
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
