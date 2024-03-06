import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FuncionarioService } from '../../service/funcionario.service';
import * as jsonDADOS from '../../../../assets/hfsfullstack/data/funcionario.json';
import { Funcionario } from '../../api/funcionario';
import { AuthService } from '../../../base/services/auth.service';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';
import { DataTableFilterMeta, LazyTableParam } from 'src/app/base/models/LazyTableParam';
import { PaginationDTO } from 'src/app/base/models/PaginationDTO';

describe('FuncionarioService', () => {
    let httpTestingController: HttpTestingController;
    let authService: AuthService;
    let service: FuncionarioService;
    let dadosLength: number = 1;
    let dados: Funcionario[] = jsonDADOS;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                AuthService,
                FuncionarioService
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(FuncionarioService);
        authService = TestBed.inject(AuthService);
    });

    it('should be created', done => {
        expect(service).toBeTruthy();
        done();
    });

    it('should get a auth token', () => {
        authService.getAccessToken().then(ptoken => {
            service.headers.append('Authorization','Bearer ' + ptoken);
            expect(ptoken).toContain('-');
            expect(service.headers.get('Authorization')).toContain('Bearer ');
        });
        expect().nothing();
    });
    
    it('should findIndexById a Funcionario', () => {
        //given
        let response: Funcionario[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        //when
        const index: number = service.findIndexById(response, 93203);
        
        //then
        expect(response.length).toEqual(dadosLength);
        expect(index).toEqual(0);
    });    
/*
    it('should findAllPaginated Funcionario', () => {
        //given
        let response: PaginationDTO[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        let lazyParams: LazyTableParam = {
            first: 0,
            rows: response.length,
            sortField: 'nome',
            sortOrder: 0,
            filters: {
                'nome': {value: 'HENRIQUE FIGUEIREDO DE SOUZA', matchMode: 'startsWith'},
            }
        };

        //when
        service.findAllPaginated(lazyParams)
            .then(res => expect(res).toEqual(response));

        //then    
        let direction: string = (lazyParams.sortOrder === 1 ? 'asc' : 'desc');
        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/paged?nome=HENRIQUE%20FIGUEIREDO%20DE%20SOUZA&page=${lazyParams.first}&size=${lazyParams.rows}&sort=${lazyParams.sortField},${direction}`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();

    });
*/
    it('should findById a Funcionario', () => {
        const response: Funcionario = dados[0];

        service.findById(1).then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();    

    });

    it('should findByAll Funcionario', () => {
        const response: Funcionario[] = dados;

        service.findAll().then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: service.PATH
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();

    });

    it('should insert a Funcionario', () => {
        const input: Funcionario = dados[0];
        
        service.insert(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'POST',
            url: service.PATH
        });

        expect(req.request.method).toEqual('POST');

        req.flush(input);

        httpTestingController.verify();

    });

    it('should update a Funcionario', () => {
        const input: Funcionario = dados[0];

        service.update(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'PUT',
            url: `${service.PATH}/93203`
        });

        expect(req.request.method).toEqual('PUT');

        req.flush(input);

        httpTestingController.verify();        

    });

    it('should delete a Funcionario', () => {
            
        service.delete(93203).then(res => expect(res).toBeDefined());

        const req = httpTestingController.expectOne({
            method: 'DELETE',
            url: `${service.PATH}/93203`
        });

        expect(req.request.method).toEqual('DELETE');

        req.flush(1, { status: 200, statusText: 'OK' });

        httpTestingController.verify();

    });    

    it('should report Funcionario', () => {
        //given
        const reportParamForm: ReportParamForm = {
            reportType: 'PDF',
            forceDownload: true
        };
        let response = new Blob();

        //when
        service.report(reportParamForm)
            .then(res => expect(res).toBeDefined());

        //then    
        const req = httpTestingController.expectOne({
            method: 'POST',
            url: `${service.PATH}/report`
        });

        expect(req.request.method).toEqual('POST');
        expect(req.request.responseType).toEqual('blob');

        req.flush(response, { status: 200, statusText: 'OK' });

        httpTestingController.verify();

    });

});