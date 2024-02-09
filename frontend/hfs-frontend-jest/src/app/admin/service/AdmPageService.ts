import { HttpClient, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdmPage } from '../api/AdmPage';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import * as FileSaver from 'file-saver';
import { AuthService } from '../../base/services/auth.service';
import { ErrorResponseDTO } from 'src/app/base/models/ErrorResponseDTO';
import fetch from 'node-fetch';

@Injectable()
export class AdmPageService {

    public PATH: string;

    public headers: HttpHeaders;

    public headersFetch: any;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.PATH = environment.backendApiURL + '/admPage';
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

    public findIndexById(listaAdmPage: AdmPage[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmPage.length; i++) {
            if (listaAdmPage[i].id === id) {
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

    public async findAll(): Promise<AdmPage[]> {
        const url = this.PATH;
        const response = await fetch(url, { method: 'GET', headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();            
            const data = json as AdmPage[];
            return data;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }
    
    public async findById(id: number): Promise<AdmPage> {
        const url = `${this.PATH}/${id}`;
        const response = await fetch(url, { method: 'GET', headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();            
            const data = json as AdmPage;
            return data;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }
    }

    public async insert(obj: AdmPage): Promise<AdmPage> {
        const url = this.PATH;

        const response = await fetch(url, 
        { method: 'POST', body: JSON.stringify(obj), headers: this.headersFetch });

        if (response.status == HttpStatusCode.Created){
            const json = await response.json();
            const data = json as AdmPage;
            return Promise.resolve(data);
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }    
    }

    public async update(obj: AdmPage): Promise<AdmPage> {
        const url = `${this.PATH}/${obj.id}`;

        const response = await fetch(url, 
        { method: 'PUT', body: JSON.stringify(obj), headers: this.headersFetch });

        if (response.status == HttpStatusCode.Ok){
            const json = await response.json();
            const data = json as AdmPage;
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
            
            FileSaver.saveAs(blob, 'AdmPage.' + obj.reportType.toLowerCase());
            
            return blob;
        } else {
            const json = await response.json() as ErrorResponseDTO;
            return Promise.reject(json);    
        }

    }

}
