import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Funcionario } from '../api/funcionario';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { environment } from '../../../environments/environment';
import * as FileSaver from 'file-saver';
import { tap, catchError, of } from 'rxjs';
import { ReportParamForm } from '../../base/models/ReportParamsForm';
import { ErrorService } from '../../base/services/error.service';
import { DataTableFilterMetaData, LazyTableParam } from 'src/app/base/models/LazyTableParam';
import { PaginationDTO } from 'src/app/base/models/PaginationDTO';

@Injectable()
export class FuncionarioService {

    public PATH: string;

    public headers: HttpHeaders;
    
    constructor(private http: HttpClient, private errorService: ErrorService) {
        this.PATH = environment.backendApiURL + '/funcionario';
        this.headers = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
     }
    /*
    async getFuncionarios() {
        const resultado$ = this.http.get<any>('assets/hfsfullstack/data/funcionarios.json')   
        .pipe(
            map(res => res.data as Funcionario[])
        );
        return await lastValueFrom(resultado$);
    }

, {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${ptoken}` }) 
        }    

*/
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
        //let page: number = param.first / param.rows;
        let page: number = param.first;
        
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
        
        let params: HttpParams;
        let url = `${this.PATH}/paged`;
        
        if (nome){
            params = new HttpParams()
            .append('nome', nome)
            .append('page', page.toString())
            .append('size', size.toString())
            .append('sort', `${sort},${direction}`);            
        } else {
            params = new HttpParams()
            .append('page', page.toString())
            .append('size', size.toString())
            .append('sort', `${sort},${direction}`);
        }

        const resultado$ = this.http.get<PaginationDTO>(url, { headers: this.headers, params })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(resultado$);
    }

    public async findAll(): Promise<Funcionario[]> {
        const url = this.PATH;
        const res$ = this.http.get<Funcionario[]>(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );
        
        return await lastValueFrom(res$);
    }

    public async findById(id: number): Promise<Funcionario> {
        const url = `${this.PATH}/${id}`;
        const res$ = this.http.get<Funcionario>(url, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async insert(obj: Funcionario): Promise<Funcionario> {
        const url = this.PATH;
        const res$ = this.http.post<Funcionario>(url, obj, { headers: this.headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }

    public async update(obj: Funcionario): Promise<Funcionario> {
        const url = `${this.PATH}/${obj.id}`;
        const res$ = this.http.put<Funcionario>(url, obj, { headers: this.headers })
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
                    FileSaver.saveAs(data, 'Funcionario.' + obj.reportType.toLowerCase());
                },
                error: error => {
                    this.errorService.log(`report Funcionario: ${error}`);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                return of();
            })
        );

        return await lastValueFrom(res$);
    }
}
