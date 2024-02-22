import { environment } from "../../environments/environment";
import { HttpStatusCode } from "axios";
import { ErrorResponseDTO } from "../../base/models/ErrorResponseDTO";
import { AdmParameter } from "../api/AdmParameter";
import axios from "../../base/interceptors/AxiosRequestInterceptor";
import { ReportParamForm } from "../../base/models/ReportParamsForm";
import FileSaver from "file-saver";

export default class AdmParameterService {

    public PATH: string;
 
    constructor() {
        this.PATH = environment.backendApiURL + '/admParameter';
    }

    public findIndexById(listaAdmParameter: AdmParameter[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmParameter.length; i++) {
            if (listaAdmParameter[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    public async findAllPaginated(page: number, size: number, 
        sort: string, direction: string): Promise<any[]> {
            
        const url = `${this.PATH}/paged?page=${page}&size=${size}&sort=${sort},${direction}`;

        const response = await axios.get<any[]>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;            
            const data = json as any[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findAll(): Promise<AdmParameter[]> {
        const url = this.PATH;

        const response = await axios.get<AdmParameter[]>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmParameter[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findById(id: number): Promise<AdmParameter> {
        const url = `${this.PATH}/${id}`;

        const response = await axios.get<AdmParameter>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmParameter;
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: AdmParameter): Promise<AdmParameter> {
        const url = this.PATH;

        const response = await axios.post<AdmParameter>(url, obj);

        if (response.status == HttpStatusCode.Created){
            const json = response.data;
            const data = json as AdmParameter;
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: AdmParameter): Promise<AdmParameter> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await axios.put<AdmParameter>(url, obj);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmParameter;
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
            const filename: string = 'AdmParameter.' + obj.reportType.toLowerCase();
            FileSaver.saveAs(response.data, filename);
            Promise.resolve(filename);
        } else {
            const json = await response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

}