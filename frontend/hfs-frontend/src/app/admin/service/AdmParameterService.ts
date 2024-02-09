import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { tap, catchError } from 'rxjs/operators';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ErrorService } from '../../base/services/error.service';
import { environment } from '../../../environments/environment';
import { AdmParameter } from '../api/AdmParameter';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { of } from 'rxjs';

@Injectable()
export class AdmParameterService {

    public PATH: string;

    public headers: HttpHeaders;

    constructor(private http: HttpClient, private errorService: ErrorService) {
        this.PATH = environment.backendApiURL + '/admParameter';
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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

    public async findAll(): Promise<AdmParameter[]> {
        const url = this.PATH;
        const res$ = this.http.get<AdmParameter[]>(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );
        
        return await lastValueFrom(res$);
    }

    public async findById(id: number): Promise<AdmParameter> {
        const url = `${this.PATH}/${id}`;
        const res$ = this.http.get<AdmParameter>(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async insert(obj: AdmParameter): Promise<AdmParameter> {
        const url = this.PATH;
        const res$ = this.http.post<AdmParameter>(url, obj, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async update(obj: AdmParameter): Promise<AdmParameter> {
        const url = `${this.PATH}/${obj.id}`;
        const res$ = this.http.put<AdmParameter>(url, obj, { headers: this.headers })
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
                    FileSaver.saveAs(data, 'AdmParameter.' + obj.reportType.toLowerCase());
                },
                error: error => {
                    this.errorService.log(`report AdmParameter: ${error}`);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }    
}
