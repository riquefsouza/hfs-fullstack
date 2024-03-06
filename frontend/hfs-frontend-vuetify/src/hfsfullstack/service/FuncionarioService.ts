import { environment } from "../../environments/environment";
import { HttpStatusCode } from "axios";
import { ErrorResponseDTO } from "../../base/models/ErrorResponseDTO";
import { Funcionario } from "../api/funcionario";
import axios from "../../base/interceptors/AxiosRequestInterceptor";
import { ReportParamForm } from "../../base/models/ReportParamsForm";
import FileSaver from "file-saver";
import { LazyTableParam } from "../../base/models/LazyTableParam";
import { DataTableFilterMetaData } from "primevue/datatable";
import { PaginationDTO } from "../../base/models/PaginationDTO";

export default class FuncionarioService {

    public PATH: string;

    constructor() {
        this.PATH = environment.backendApiURL + '/funcionario';
    }

    public findIndexById(listaFuncionario: Funcionario[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaFuncionario.length; i++) {
            if (listaFuncionario[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }
        
    public async findAllPaginated(param: LazyTableParam): Promise<PaginationDTO> {

        let nome: string = "";
        let page: number = param.first;
        //let page: number = param.first / param.rows;
        
        if(param.sortField === null || param.sortField === undefined){
            param.sortField = 'id';
        }

        if(param.sortOrder === null || param.sortOrder === undefined){
            param.sortOrder = 1;
        }

        if (param.filters['nome'] !== undefined){
            let filtro: DataTableFilterMetaData = param.filters['nome'] as DataTableFilterMetaData;
            nome = filtro.value;
        }

        let size: number = param.rows;
        let sort: string = param.sortField;
        let direction: string = (param.sortOrder === 1 ? 'asc' : 'desc');
            
        let url = '';
        if (nome){
            url = `${this.PATH}/paged?nome=${nome}&=page=${page}&size=${size}&sort=${sort},${direction}`;
        } else {
            url = `${this.PATH}/paged?page=${page}&size=${size}&sort=${sort},${direction}`;
        }

        const response = await axios.get<PaginationDTO>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;            
            const data = json as PaginationDTO;
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findAll(): Promise<Funcionario[]> {
        const url = this.PATH;

        const response = await axios.get<Funcionario[]>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as Funcionario[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findById(id: number): Promise<Funcionario> {
        const url = `${this.PATH}/${id}`;

        const response = await axios.get<Funcionario>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as Funcionario;
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: Funcionario): Promise<Funcionario> {
        const url = this.PATH;

        const response = await axios.post<Funcionario>(url, obj);

        if (response.status == HttpStatusCode.Created){
            const json = response.data;
            const data = json as Funcionario;
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: Funcionario): Promise<Funcionario> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await axios.put<Funcionario>(url, obj);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as Funcionario;
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }    

    public async delete(id: number): Promise<any> {        
        const url = `${this.PATH}/${id}`;

        const response = await axios.delete<any>(url);

        if (response.status == HttpStatusCode.Ok){
            return Promise.resolve();
        } else {
            const json = await response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }        
    }

    public async report(obj: ReportParamForm): Promise<any> {
        const url = `${this.PATH}/report`;
        
        const response = await axios.post(url, obj, { responseType: 'blob' });

        if (response.status == HttpStatusCode.Ok){
            const filename: string = 'Funcionario.' + obj.reportType.toLowerCase();
            FileSaver.saveAs(response.data, filename);
            Promise.resolve(filename);
        } else {
            const json = await response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

}
