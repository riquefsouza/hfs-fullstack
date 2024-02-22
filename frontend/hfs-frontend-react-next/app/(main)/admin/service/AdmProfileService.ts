import { environment } from "@/environments/environment";
import { HttpStatusCode } from "axios";
import { ErrorResponseDTO } from "../../base/models/ErrorResponseDTO";
import { AdmProfile } from "../api/AdmProfile";
import axios from "../../base/interceptors/AxiosRequestInterceptor";
import { ReportParamForm } from "../../base/models/ReportParamsForm";
import FileSaver from "file-saver";
import { MenuItemDTO } from "../../base/models/MenuItemDTO";
import { AdmPage } from "../api/AdmPage";
import { AppMenuItem } from "@/types";

export default class AdmProfileService {

    public PATH: string;
 
    constructor() {
        this.PATH = environment.backendApiURL + '/admProfile';
    }

    public findIndexById(listaAdmProfile: AdmProfile[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmProfile.length; i++) {
            if (listaAdmProfile[i].id === id) {
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

    public async findAll(): Promise<AdmProfile[]> {
        const url = this.PATH;

        const response = await axios.get<AdmProfile[]>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmProfile[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findById(id: number): Promise<AdmProfile> {
        const url = `${this.PATH}/${id}`;

        const response = await axios.get<AdmProfile>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmProfile;
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: AdmProfile): Promise<AdmProfile> {
        const url = this.PATH;

        const response = await axios.post<AdmProfile>(url, obj);

        if (response.status == HttpStatusCode.Created){
            const json = response.data;
            const data = json as AdmProfile;
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: AdmProfile): Promise<AdmProfile> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await axios.put<AdmProfile>(url, obj);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmProfile;
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
            const filename: string = 'AdmProfile.' + obj.reportType.toLowerCase();
            FileSaver.saveAs(response.data, filename);
            Promise.resolve(filename);
        } else {
            const json = await response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findProfilesByPage(admPage: AdmPage): Promise<AdmProfile[]> {
        const url = `${this.PATH}/findProfilesByPage/${admPage.id}`;
        const response = await axios.get<AdmProfile>(url);

        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AdmProfile[];
            return data;
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async mountMenu(obj: string[]): Promise<AppMenuItem[]> {
        const url = `${this.PATH}/mountMenu`;
        const response = await axios.post<AdmProfile>(url, obj);
    
        if (response.status == HttpStatusCode.Ok){
            const json = response.data;
            const data = json as AppMenuItem[];
            return Promise.resolve(data);
        } else {
            const json = response.data as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }    

}