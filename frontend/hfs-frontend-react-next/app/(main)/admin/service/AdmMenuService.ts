import { environment } from "@/environments/environment";
import { HttpStatusCode } from "axios";
import { ErrorResponseDTO } from "../../base/models/ErrorResponseDTO";
import { AdmMenu } from "../api/AdmMenu";
import axios from "../../base/interceptors/AxiosRequestInterceptor";
import { ReportParamForm } from "../../base/models/ReportParamsForm";
import FileSaver from "file-saver";

export default class AdmMenuService {

    public PATH: string;
 
    constructor() {
        this.PATH = environment.backendApiURL + '/admMenu';
    }

    public findIndexById(listaAdmMenu: AdmMenu[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmMenu.length; i++) {
            if (listaAdmMenu[i].id === id) {
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

    public async findAll(): Promise<AdmMenu[]> {
        const url = this.PATH;

        const response = await axios.get<AdmMenu[]>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmMenu[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findById(id: number): Promise<AdmMenu> {
        const url = `${this.PATH}/${id}`;

        const response = await axios.get<AdmMenu>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmMenu;
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: AdmMenu): Promise<AdmMenu> {
        const url = this.PATH;

        const response = await axios.post<AdmMenu>(url, obj);

        if (response.status == HttpStatusCode.Created){
            const json = response.data;
            const data = json as AdmMenu;
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: AdmMenu): Promise<AdmMenu> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await axios.put<AdmMenu>(url, obj);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmMenu;
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
            const filename: string = 'AdmMenu.' + obj.reportType.toLowerCase();
            FileSaver.saveAs(response.data, filename);
            Promise.resolve(filename);
        } else {
            const json = await response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

}