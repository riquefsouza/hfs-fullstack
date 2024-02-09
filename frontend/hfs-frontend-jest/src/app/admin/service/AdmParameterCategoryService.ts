import { HttpClient, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdmParameterCategory } from '../api/AdmParameterCategory';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import * as FileSaver from 'file-saver';
import { AuthService } from '../../base/services/auth.service';
import { ErrorResponseDTO } from 'src/app/base/models/ErrorResponseDTO';
import fetch from 'node-fetch';

@Injectable()
export class AdmParameterCategoryService {

    public PATH: string;

    public headers: HttpHeaders;

    public headersFetch: any;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.PATH = environment.backendApiURL + '/admParameterCategory';
        this.headers = new HttpHeaders({ 
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        });

        this.headersFetch = { 
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'Authorization': authService.getToken()
        };
    }

    public findIndexById(listaAdmParameterCategory: AdmParameterCategory[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmParameterCategory.length; i++) {
            if (listaAdmParameterCategory[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    public async findAllPaginated(page: number, size: number, 
        sort: string, direction: string): Promise<any[]> {
        const params = new HttpParams()
            .append('page', page.toString())
            .append("size", size.toString())
            .append("sort", `${sort},${direction}`);
            
        const url = `${this.PATH}/paged`;
        const response = await fetch(url, { method: 'GET', headers: this.headersFetch, params });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();            
            const data = json as any[];
            return data;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async findAll(): Promise<AdmParameterCategory[]> {
        const url = this.PATH;
        const response = await fetch(url, { method: 'GET', headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();            
            const data = json as AdmParameterCategory[];
            return data;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }
    
    public async findById(id: number): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${id}`;
        const response = await fetch(url, { method: 'GET', headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();            
            const data = json as AdmParameterCategory;
            return data;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = this.PATH;

        const response = await fetch(url, 
        { method: 'POST', body: JSON.stringify(obj), headers: this.headersFetch });

        if (response.status == HttpStatusCode.Created){
            const json = await response.json();
            const data = json as AdmParameterCategory;
            return Promise.resolve(data);
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await fetch(url, 
        { method: 'PUT', body: JSON.stringify(obj), headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();
            const data = json as AdmParameterCategory;
            return Promise.resolve(data);
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async delete(id: number): Promise<any> {
        
        const url = `${this.PATH}/${id}`;
        const response = await fetch(url, 
        { method: 'DELETE', headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            return Promise.resolve();
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
        
    }

    public async report(obj: ReportParamForm): Promise<any> {
        const url = `${this.PATH}/report`;
        
        const response = await fetch(url, 
        { method: 'POST', body: JSON.stringify(obj), headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const blob = await response.blob();
            
            FileSaver.saveAs(blob, 'AdmParameterCategory.' + obj.reportType.toLowerCase());
            
            return blob;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }

    }

}
