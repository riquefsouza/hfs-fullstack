import { ErrorService } from '../../base/services/error.service';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdmParameterCategory } from '../api/AdmParameterCategory';
import { catchError, tap } from 'rxjs/operators';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import * as FileSaver from 'file-saver';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { of } from 'rxjs';

@Injectable()
export class AdmParameterCategoryService {

    public PATH: string;

    public headers: HttpHeaders;

    public headersFetch: any;

    constructor(private http: HttpClient, private errorService: ErrorService) {
        this.PATH = environment.backendApiURL + '/admParameterCategory';
        this.headers = new HttpHeaders({ 
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        });

        this.headersFetch = { 
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
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
        const resultado$ = this.http.get<any[]>(url, { headers: this.headers, params })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );
    
        return await lastValueFrom(resultado$);
    }
    
    public async findAll(): Promise<AdmParameterCategory[]> {
        const url = this.PATH;
        const res$ = this.http.get<AdmParameterCategory[]>(url, { headers: this.headers } )
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );
    
        return await lastValueFrom(res$);
    }

    public async findById(id: number): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${id}`;
        const res$ = this.http.get<AdmParameterCategory>(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async insert(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = this.PATH;
        const res$ = this.http.post<AdmParameterCategory>(url, obj, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async update(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${obj.id}`;
        const res$ = this.http.put<AdmParameterCategory>(url, obj, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async delete(id: number): Promise<any> {
        const url = `${this.PATH}/${id}`;
        const res$ = this.http.delete(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async report(obj: ReportParamForm): Promise<any> {
        const url = `${this.PATH}/report`;
        const res$ = this.http.post(url, obj, {
            headers: this.headers,
            responseType: 'blob'
        })
        .pipe(
            tap({
                next: data => {
                    FileSaver.saveAs(data, 'AdmParameterCategory.' + obj.reportType.toLowerCase());
                },
                error: error => {
                    this.errorService.log(`report AdmParameterCategory: ${error}`);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

}
