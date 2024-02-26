<script lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import FuncionarioService from '../service/FuncionarioService';
import { Funcionario, cleanFuncionario, emptyFuncionario } from '../api/funcionario';
import { ReportParamForm, emptyReportParamForm } from '../../base/models/ReportParamsForm';
import { ItypeReport, PDFReport, SelectItemGroup } from '../../base/services/ReportService';
import { LazyTableParam, emptyLazyTableParam } from '../../base/models/LazyTableParam';
import { first } from 'rxjs';
import { ExportService } from '../../base/services/ExportService';
import { DataTableFilterMeta } from 'primevue/datatable';
import { PaginationDTO } from '../../base/models/PaginationDTO';

export default {
    setup() {
        const toast = useToast();

        const listaFuncionario = ref<Funcionario[]>([]);
        const funcionarioDialog = ref(false);
        const deleteFuncionarioDialog = ref(false);
        const deleteFuncionariosDialog = ref(false);
        const funcionario = ref(emptyFuncionario);
        const selectedFuncionarios = ref<Funcionario[]>([]);
        const dt = ref(null);
        const first = ref(0);
        const cols = ref();
        const exportColumns = ref([]);
        const submitted = ref(false);

        const funcionarioService = new FuncionarioService();
        const exportService = new ExportService();
        //const baseUtilService = new BaseUtilService();

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        //const rowsPerPageOptions = ref<number[]>([5, 10, 30, 50, 100, 150, 200]);

        const totalRecords = ref<number>(0);

        const loading = ref<boolean>(false);

        const selectAll = ref<boolean>(false);

        const filters = ref<DataTableFilterMeta>({
            global: { value: '', matchMode: 'contains' },
            'nome': {value: '', matchMode: 'startsWith'},
        });        

        const lazyParams = ref<LazyTableParam>(emptyLazyTableParam);

        onMounted(() => {
            selectedTypeReport.value = PDFReport.value;

            cols.value = [
                { field: 'id', header: 'Código' },
                { field: 'nome', header: 'Nome' },
                { field: 'cpfFormatado', header: 'Cpf' },
                { field: 'email', header: 'Email' },
                { field: 'telefone', header: 'Telefone' },
                { field: 'celular', header: 'Celular' },
                { field: 'setor', header: 'Setor' },
                { field: 'codCargo', header: 'CodCargo' },
                { field: 'cargo', header: 'Cargo' },
                { field: 'dataAdmissaoFormatada', header: 'Data Admissão' },
                { field: 'dataSaidaFormatada', header: 'Data Saída' },
                { field: 'ativo', header: 'Ativo' }
            ];
            
            exportColumns.value = cols.value.map((col: { header: any; field: any; }) => ({title: col.header, dataKey: col.field}));

            lazyParams.value = {
                first: 0,
                rows: 10,
                sortField: null,
                sortOrder: null,
                filters: filters.value
            };

            loadFuncionarios();
        });

        const loadFuncionarios = () => {        
            loading.value = true;

            funcionarioService.findAllPaginated(lazyParams.value).then((data: PaginationDTO) => {
                listaFuncionario.value = data.content;
                totalRecords.value = data.totalElements;
                loading.value = false;
            });

        }        

        const onPage = (event) => {
            lazyParams.value = event;
            loadFuncionarios(event);
        };

        const onSort = (event) => {
            lazyParams.value = event;
            loadFuncionarios(event);
        };

        const onFilter = (event) => {
            lazyParams.value.filters = filters.value;
            loadFuncionarios(event);
        };

        const onRowSelect = () => {
            selectAll.value = selectedFuncionarios.value.length === totalRecords.value;
        };

        const onRowUnselect = () => {
            selectAll.value = false;
        };        

        const onSelectAllChange = (event) => {
            selectAll.value = event.checked;

            if (selectAll) {
                funcionarioService.findAll().then((res) => {
                    selectedFuncionarios.value = res;
                    selectAll.value = true;
                });
            } else {
                selectedFuncionarios.value = [];
                selectAll.value = false;
            }
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
            if (funcionario.value.nome && funcionario.value.nome.trim()) {
                if (funcionario.value.id) {
                    funcionarioService.update(funcionario.value).then((obj: Funcionario) => {
                        funcionario.value = obj;

                        if (funcionario.value.id) {
                            const index = funcionarioService.findIndexById(listaFuncionario.value, funcionario.value.id);
                            listaFuncionario.value[index] = funcionario.value;
                            toast.add({severity:'success', summary: 'Successful', detail: 'Funcionário Atualizado', life: 3000});
                        }
                    });            
                } else {
                    funcionarioService.insert(funcionario.value).then((obj: Funcionario) => {
                        funcionario.value = obj;

                        listaFuncionario.value.push(funcionario.value);
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'Funcionário Criado', life: 3000 });
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
            listaFuncionario.value = listaFuncionario.value.filter((val: Funcionario) => !selectedFuncionarios.value.includes(val));

            let excluiu = false;
            selectedFuncionarios.value.forEach((item: Funcionario) => {
                if (item.id){
                    funcionarioService.delete(item.id).then(() => {
                        excluiu = true;
                    });
                }
            });

            if (excluiu) {
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionários excluídos', life: 3000 });
                selectedFuncionarios.value = [];
            }
        }

        const confirmDelete = () => {
            deleteFuncionarioDialog.value = false;
            if (funcionario.value.id){
                funcionarioService.delete(funcionario.value.id).then(() => {
                    listaFuncionario.value = listaFuncionario.value.filter((val: Funcionario) => val.id !== funcionario.value.id);
                    funcionario.value = emptyFuncionario;        
                    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário excluído', life: 3000 });
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
                toast.add({ severity: 'info', summary: 'Funcionário exportado', 
                    detail: 'Funcionário exportada', life: 3000 });
            });
        }

        const exportCSV = (param: boolean) => {
            if (dt.value){
                dt.value.exportCSV({ selectionOnly: param });
            }        
        };

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

        return { listaFuncionario, funcionario, filters, submitted, onClean, exportPdf, exportExcel, exportCSV,
            selectedFuncionarios, deleteSelected, funcionarioDialog, hideDialog, mostrarListar, mostrarEditar,
            deleteFuncionarioDialog, confirmDelete, deleteFuncionariosDialog,
            onInsert, onEdit, onDelete, onSave, onExport, onTypeReportChange, onForceDownloadChange, confirmDeleteSelected,
            first, totalRecords, loading, onPage, onSort, onFilter, selectAll, onSelectAllChange, onRowSelect, onRowUnselect }
    }
}        
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6" :style="mostrarListar()">
                <!-- <Toast /> -->
                <Panel header="Funcionário" class="p-mb-2">
                    <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
                </Panel>                
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success mr-2" @click="onInsert" />
                            <Button label="Excluir" icon="pi pi-trash" class="p-button-danger" @click="deleteSelected" 
                                :disabled="!selectedFuncionarios || !selectedFuncionarios.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="onExport" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt" paginatorPosition="both" lazy
                    :value="listaFuncionario"
                    v-model:selection="selectedFuncionarios"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    v-model:filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10,30,50,100,150,200]" emptyMessage="Nenhum registro encontrado."
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} entradas"
                    responsiveLayout="scroll" :globalFilterFields="['nome']"
                    :first="first" :totalRecords="totalRecords" :loading="loading" 
                    @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
                    :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" 
                    tableStyle="min-width: 75rem"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Funcionários</h5>

                            <div class="flex">
                                <Button icon="pi pi-file" @click="exportCSV(false)" class="mr-2" v-tooltip.bottom="'CSV'" />
                                <Button icon="pi pi-file-excel" @click="exportExcel" class="p-button-success mr-2" v-tooltip.bottom="'XLS'" />
                                <Button icon="pi pi-file-pdf" @click="exportPdf" class="p-button-warning mr-2" v-tooltip.bottom="'PDF'" />
                                <Button icon="pi pi-filter" @click="exportCSV(true)" class="p-button-info mr-2" v-tooltip.bottom="'Somente Seleção'" />
                            </div>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="onEdit(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="onDelete(slotProps.data)" />
                        </template>
                    </Column>
                    <Column field="id" header="Id" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="nome" header="Nome" :sortable="true" filterMatchMode="startsWith" headerStyle="min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nome</span>
                            {{ slotProps.data.nome }}
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @keydown.enter="filterCallback()" class="p-column-filter" />
                        </template>
                    </Column>
                    <Column field="cpfFormatado" header="Cpf" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Cpf</span>
                            {{ slotProps.data.cpfFormatado }}
                        </template>
                    </Column>
                    <Column field="email" header="Email" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="telefone" header="Telefone" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Telefone</span>
                            {{ slotProps.data.telefone }}
                        </template>
                    </Column>
                    <Column field="celular" header="Celular" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Celular</span>
                            {{ slotProps.data.celular }}
                        </template>
                    </Column>
                    <Column field="setor" header="Setor" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Setor</span>
                            {{ slotProps.data.setor }}
                        </template>
                    </Column>
                    <Column field="codCargo" header="CodCargo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">CodCargo</span>
                            {{ slotProps.data.codCargo }}
                        </template>
                    </Column>
                    <Column field="cargo" header="Cargo" :sortable="true" headerStyle="min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Cargo</span>
                            {{ slotProps.data.cargo }}
                        </template>
                    </Column>
                    <Column field="dataAdmissaoFormatada" header="Data Admissão" :sortable="true" headerStyle="min-width:12rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Data Admissão</span>
                            {{ slotProps.data.dataAdmissaoFormatada }}
                        </template>
                    </Column>
                    <Column field="dataSaidaFormatada" header="Data Saída" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Data Saída</span>
                            {{ slotProps.data.dataSaidaFormatada }}
                        </template>
                    </Column>
                    <Column field="ativo" header="Ativo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ativo</span>
                            {{ slotProps.data.ativo }}
                        </template>
                    </Column>

                    <template #footer>
                        <div class="p-d-flex p-ai-center p-jc-between">
                            No total existem {{listaFuncionario ? listaFuncionario.length : 0 }} funcionários.
                        </div>
                    </template>                    
                </DataTable>
            </div>

            <div :style="mostrarEditar()">
                <!-- <Toast /> -->
                <Panel header="Detalhes do funcionário" class="p-mb-2">
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
                            <label for="nome">Nome</label>
                            <InputText id="nome" v-model="funcionario.nome" autofocus required="true"
                                :class="{ 'p-invalid': submitted && !funcionario.nome }" />
                            <small class="p-invalid" v-if="submitted && !funcionario.nome">O Nome é obrigatório.</small>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <InputText id="email" v-model="funcionario.email" />
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="cpf">Cpf</label>
                                <InputMask mask="999.999.999-99" id="cpf" v-model="funcionario.cpfFormatado" required="true"
                                    :class="{ 'p-invalid': submitted && !funcionario.cpf }" />
                                <small class="p-invalid" v-if="submitted && !funcionario.cpf">O Cpf é obrigatório.</small>
                            </div>
                            <div class="field col">
                                <label for="telefone">Telefone</label>
                                <InputText id="telefone" v-model="funcionario.telefone" />
                            </div>
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="celular">Celular</label>
                                <InputText id="celular" v-model="funcionario.celular" />
                            </div>
                            <div class="field col">
                                <label for="setor">Setor</label>
                                <InputText id="setor" v-model="funcionario.setor" />
                            </div>
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="codCargo">CodCargo</label>
                                <InputNumber id="codCargo" v-model="funcionario.codCargo" integeronly locale="pt-BR" />
                            </div>
                            <div class="field col">
                                <label for="cargo">Cargo</label>
                                <InputText id="cargo" v-model="funcionario.cargo" />
                            </div>                        
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="dataAdmissao">Data Admissão</label>
                                <Calendar id="dataAdmissao" v-model="funcionario.dataAdmissaoFormatada" showIcon :showOnFocus="false" 
                                   dateFormat="dd/mm/yy" modelValue="string" />
                            </div>
                            <div class="field col">
                                <label for="dataSaida">Data Saída</label>
                                <Calendar id="dataSaida" v-model="funcionario.dataSaidaFormatada" showIcon :showOnFocus="false" 
                                   dateFormat="dd/mm/yy" modelValue="string" />
                            </div>
                        </div>    
                        <div class="flex align-items-center gap-1">
                            <Checkbox v-model="funcionario.ativo" inputId="ativo" name="ativo" value="Ativo" :binary="true" />
                            <label for="ativo">Ativo</label>                            
                        </div>                    
                    </div>
                </Panel>
            </div>  

            <Dialog v-model:visible="deleteFuncionarioDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="funcionario">Tem certeza de que deseja excluir <b>{{ funcionario.nome }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteFuncionarioDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteFuncionariosDialog" :style="{ width: '450px' }" header="Confirme" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="funcionario">Tem certeza de que deseja excluir as categorias de parâmetros selecionadas?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteFuncionariosDialog = false" />
                    <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDeleteSelected" />
                </template>
            </Dialog>

        </div>
    </div>
</template>
