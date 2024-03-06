<script lang="ts">
import { ref, onMounted, onBeforeMount, shallowRef, watch } from 'vue';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { SnackbarMessage, emptySnackbarMessage } from '../../base/models/SnackbarMessage';
import { Funcionario, cleanFuncionario, emptyFuncionario } from '../api/funcionario';
import FuncionarioService from '../service/FuncionarioService';
import { ExportService } from '../../base/services/ExportService';
import { DataTableFilterMeta, LazyTableParam, emptyLazyTableParam } from '../../base/models/LazyTableParam';
import { PaginationDTO } from '../../base/models/PaginationDTO';

export default {
    setup() {
        const snackbar = ref<SnackbarMessage>(emptySnackbarMessage);

        const listaFuncionario = ref<Funcionario[]>([]);
        const funcionarioDialog = shallowRef(false)
        const deleteFuncionarioDialog = ref(false);
        const deleteFuncionariosDialog = ref(false);
        const funcionario = ref(emptyFuncionario);
        const selectedFuncionarios = ref<number[]>([]);
        const submitted = ref(false);

        const funcionarioService = new FuncionarioService();
        const exportService = new ExportService();
        //const baseUtilService = new BaseUtilService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const itemsPerPage = ref(10);
        const columns = ref();        
        const exportColumns = ref([]);
        const loading = ref(true);
        const totalItems = ref(0);
        const search = ref('');
        const form = ref();
        const nomePesquisa = ref('')

        const filters = ref<DataTableFilterMeta>({
            global: { value: '', matchMode: 'contains' },
            'nome': {value: '', matchMode: 'startsWith'},
        });        

        const lazyParams = ref<LazyTableParam>(emptyLazyTableParam);

        onBeforeMount(() => {
            columns.value = [
                { key: 'actions', title: "Ações", sortable: false, minWidth: '5rem' },
                { key: 'id', title: 'Código', sortable: true, align: 'start', minWidth: '5rem' },
                { key: 'nome', title: 'Nome', sortable: true, align: 'start', minWidth: '30rem' },
                { key: 'cpfFormatado', title: 'Cpf', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'email', title: 'Email', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'telefone', title: 'Telefone', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'celular', title: 'Celular', sortable: true, align: 'start', minWidth: '20rem' },
                { key: 'setor', title: 'Setor', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'codCargo', title: 'CodCargo', type: 'number', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'cargo', title: 'Cargo', sortable: true, align: 'start', minWidth: '20rem' },
                { key: 'dataAdmissaoFormatada', title: 'Data Admissão', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'dataSaidaFormatada', title: 'Data Saída', sortable: true, align: 'start', minWidth: '10rem' },
                { key: 'ativo', title: 'Ativo', minWidth: '10rem' }
            ];
        });

        onMounted(() => {
            selectedTypeReport.value = PDFReport.value;
            exportColumns.value = columns.value.map((col: { header: any; field: any; }) => ({title: col.header, dataKey: col.field}));
        });

        const loadFuncionarios = ({ page, itemsPerPage, sortBy }) => { 
            loading.value = true;

            let sortField: string | null = null;
            let sortOrder: number | null = null;

            if (sortBy.length > 0) {
                sortField = sortBy[0].key;
                sortOrder = sortBy[0].order === 'asc' ? 1 : 0;
            }

            lazyParams.value = {
                first: page,
                rows: itemsPerPage,
                sortField: sortField,
                sortOrder: sortOrder,
                filters: { 'nome': {value: nomePesquisa, matchMode: 'startsWith'} }
            };

            funcionarioService.findAllPaginated(lazyParams.value).then((data: PaginationDTO) => {
                listaFuncionario.value = data.content;
                totalItems.value = data.totalElements;
                loading.value = false;
            });
        }      
        
        watch(nomePesquisa, () => {
            search.value = String(Date.now())
        })

        const snackBar = (msg: string, duration: number) => {
            snackbar.value.open = true;
            snackbar.value.message = msg;
            snackbar.value.timeout = duration;
        }

        const mostrarListar = () => {
            if (funcionarioDialog.value)
                return { display: 'none' };
            else
                return { display: '' };
        }

        const mostrarEditar = () => {
            if (funcionarioDialog.value)
                return { display: '' };
            else
                return { display: 'none' };
        }

        const onInsert = () => {
            funcionario.value = emptyFuncionario;
            submitted.value = false;
            funcionarioDialog.value = true;
        };

        const onEdit = (param: Funcionario) => {
            funcionario.value = { ...param };
            funcionarioDialog.value = true;
        };

        const hideDialog = () => {
            funcionarioDialog.value = false;
            submitted.value = false;
        };

        const onClean = () => {
            funcionario.value = cleanFuncionario;
        }

        const onSave = () => {
            submitted.value = true;
            /*
            if (funcionario.cpfFormatado){
                funcionario.cpf = baseUtilService.cpfFormatadoParaCpf(funcionario.cpfFormatado);
            }
            if (funcionario.dataAdmissaoFormatada){
                funcionario.dataAdmissao = baseUtilService.dataStringToDate(funcionario.dataAdmissaoFormatada);
            }
            if (funcionario.dataSaidaFormatada){
                funcionario.dataSaida = baseUtilService.dataStringToDate(funcionario.dataSaidaFormatada);
            } 
            */       

            if (funcionario.value.nome && funcionario.value.nome.trim()) {
                if (funcionario.value.id) {
                    funcionarioService.update(funcionario.value).then((obj: Funcionario) => {
                        funcionario.value = obj;

                        if (funcionario.value.id){
                            const index = funcionarioService.findIndexById(listaFuncionario.value, funcionario.value.id);
                            listaFuncionario.value[index] = funcionario.value;
                            snackBar('Funcionário Atualizado', 3000);
                        }
                    });            
                } else {
                    funcionarioService.insert(funcionario.value).then((obj: Funcionario) => {
                        funcionario.value = obj;

                        listaFuncionario.value.push(funcionario.value);
                        snackBar('Funcionário Criado', 3000);
                    });            
                }

                funcionarioDialog.value = false;
                funcionario.value = emptyFuncionario;
            }
        };

        const deleteSelected = () => {
            deleteFuncionariosDialog.value = true;
        }

        const onDelete = (param: Funcionario) => {
            deleteFuncionarioDialog.value = true;
            funcionario.value = { ...param };
        } 

        const confirmDeleteSelected = () => {            
            deleteFuncionariosDialog.value = false;
            
            let selecionados: Funcionario[] = [];
            listaFuncionario.value.forEach((item: Funcionario) => {
                selectedFuncionarios.value.forEach((id: number) => {
                    if (item.id === id){
                        selecionados.push(item);
                    }
                });        
            });

            if (selecionados.length > 0){
                listaFuncionario.value = listaFuncionario.value.filter(
                    (val: Funcionario) => !selecionados.includes(val));

                    selecionados.forEach((item: Funcionario, index: number) => {
                    if (item.id){
                        funcionarioService.delete(item.id).then(() => {

                            if (selecionados.length == (index+1)){
                                snackBar('Funcionários excluídos', 3000);
                                selectedFuncionarios.value = [];
                            }

                        });
                    }
                });

            }
        }

        const confirmDelete = () => {
            deleteFuncionarioDialog.value = false;
            if (funcionario.value.id){
                funcionarioService.delete(funcionario.value.id).then(() => {
                    listaFuncionario.value = listaFuncionario.value.filter((val: Funcionario) => val.id !== funcionario.value.id);
                    funcionario.value = emptyFuncionario;        
                    snackBar('Funcionário excluído', 3000);
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
            funcionarioService.report(reportParamForm.value).then(() => {
                snackBar('Funcionário exportado', 3000);
            });            
        }

        const exportPdf = () => {
            const head: string[] = [];
            const data: any[] = [];

            exportColumns.value.forEach(item => head.push(item.title));
            listaFuncionario.value.forEach(item => data.push(
                [item.id, item.nome, item.cpfFormatado, item.email, item.telefone, item.celular, 
                item.setor, item.codCargo, item.cargo, item.dataAdmissaoFormatada, item.dataSaidaFormatada, item.ativo]
            ));

            exportService.exportPdf(head, data, 'funcionarios.pdf');
        }
        
        const exportExcel = () => {
            exportService.exportExcel(listaFuncionario.value, 'funcionarios');
        }    

        return { listaFuncionario, funcionario, submitted, mostrarListar, mostrarEditar, loadFuncionarios,
            selectedFuncionarios, deleteSelected, funcionarioDialog, hideDialog, onClean, nomePesquisa,
            deleteFuncionarioDialog, confirmDelete, deleteFuncionariosDialog, exportExcel, exportPdf,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange,
            confirmDeleteSelected, itemsPerPage, columns, loading, totalItems, search, snackbar }
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
                    <v-card-title>Funcionário</v-card-title>
                </v-card-item>
                <v-card-text>
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </v-card-text>

                <v-toolbar>
                    <v-btn prepend-icon="add" @click="onInsert" variant="elevated" color="green" :style="{ marginRight: '10px' }">Adicionar</v-btn>
                    <v-btn prepend-icon="delete" @click="deleteSelected" variant="elevated" color="red"
                        :disabled="!selectedFuncionarios || !selectedFuncionarios.length" :style="{ marginRight: '10px' }">Excluir</v-btn>
                        
                    <span class="spacer"></span>
                        
                    <v-btn icon="description" @click="exportExcel" variant="elevated"></v-btn>
                    <v-btn icon="picture_as_pdf" @click="exportPdf" variant="elevated"></v-btn>

                    <span class="spacer"></span>

                    <v-btn prepend-icon="upload" @click="onExport" variant="elevated" color="indigo-darken-3">Exportar</v-btn>
                </v-toolbar>

                <v-toolbar>
                    <span class="spacer"></span>
                    <v-text-field v-model="nomePesquisa" class="ma-2" density="compact" 
                        placeholder="Pesquisar nome..." hide-details style="max-width: 300px">
                    </v-text-field>
                </v-toolbar>

                <v-data-table-server
                    v-model="selectedFuncionarios"
                    v-model:items-per-page="itemsPerPage"
                    :headers="columns"
                    :items="listaFuncionario"
                    :items-length="totalItems"
                    :loading="loading"
                    loading-text="Carregando, por favor espere"
                    :search="search"
                    item-value="id"
                    show-select
                    @update:options="loadFuncionarios"
                    :sort-by="[{ key: 'id', order: 'asc' }]">

                    <template v-slot:item.actions="{ item }">
                        <v-icon class="me-2" size="small" @click="onEdit(item)">edit</v-icon>
                        <v-icon size="small" @click="onDelete(item)">delete</v-icon>
                    </template>
                    
                </v-data-table-server>
            </div>    

            <div :style="mostrarEditar()">
                <v-card-item>
                    <v-card-title>Funcionário</v-card-title>
                </v-card-item>
                <v-card-text>
                    <v-toolbar>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" @click="hideDialog" variant="elevated">Cancelar</v-btn>
                        <v-btn prepend-icon="star" color="secondary" :style="{ marginRight: '10px' }" @click="onClean" variant="elevated">Limpar</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="onSave" variant="elevated">Salvar</v-btn>
                    </v-toolbar>                

                    <v-form ref="form">
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Descrição" v-model="funcionario.nome" required autofocus
                                        :class="{ 'text-red': submitted && !funcionario.nome }">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row v-if="submitted && !funcionario.nome">
                                <v-col cols="12">
                                    <small class="text-red" v-if="submitted && !funcionario.nome">O nome é obrigatório.</small>
                                </v-col>                                    
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Email" v-model="funcionario.email"></v-text-field>
                                </v-col>                                
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Cpf" v-model="funcionario.cpfFormatado" required
                                        :class="{ 'text-red': submitted && !funcionario.cpfFormatado }">
                                    </v-text-field>
                                    <small class="text-red" v-if="submitted && !funcionario.cpfFormatado">O Cpf é obrigatório.</small>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Telefone" v-model="funcionario.telefone"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Celular" v-model="funcionario.celular"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Setor" v-model="funcionario.setor"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field type="number" label="CodCargo" v-model="funcionario.codCargo"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Cargo" v-model="funcionario.cargo"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6">
                                    <v-text-field type="date" label="Data Admissão" v-model="funcionario.dataAdmissao"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field type="date" label="Data Saída" v-model="funcionario.dataSaida"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-checkbox v-model="funcionario.ativo" label="Ativo"></v-checkbox>
                            </v-row>                            
                        </v-container>
                    </v-form>
                </v-card-text>
            </div>
        
            <v-dialog v-model="deleteFuncionarioDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="funcionario">Tem certeza de que deseja excluir <b>{{ funcionario.nome }}</b>?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteFuncionarioDialog = false" variant="elevated">Não</v-btn>
                        <v-btn prepend-icon="check" color="primary" @click="confirmDelete" variant="elevated">Sim</v-btn>
                    </template>
                </v-card>
            </v-dialog>

            <v-dialog v-model="deleteFuncionariosDialog" max-width="450" persistent>
                <v-card prepend-icon="warning" title="Confirme">
                    <v-card-text>
                        <span v-if="funcionario">Tem certeza de que deseja excluir os funcionários selecionados?</span>
                    </v-card-text>                        
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="cancel" color="secondary" :style="{ marginRight: '10px' }" 
                            @click="deleteFuncionariosDialog = false" variant="elevated">Não</v-btn>
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
</style>import { Funcionario, emptyFuncionario } from '../api/funcionario';
import FuncionarioService from '../service/FuncionarioService';import { Funcionario, emptyFuncionario } from '../api/funcionario';
import FuncionarioService from '../service/FuncionarioService';

