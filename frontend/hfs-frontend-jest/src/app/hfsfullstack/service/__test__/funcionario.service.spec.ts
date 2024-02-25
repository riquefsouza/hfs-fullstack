import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { FuncionarioService } from '../funcionario.service';
import * as jsonDADOS from '../../../../assets/hfsfullstack/data/funcionario.json';
import { Funcionario } from '../../api/funcionario';
import { AuthService } from '../../../base/services/auth.service';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';

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
                MessageService,
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

    it('should findAllPaginated Funcionario', () => {
        //given
        let response: Funcionario[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        const nome: string = 'HENRIQUE FIGUEIREDO DE SOUZA';
        const page: number = 0;
        const size: number = response.length;
        const sortField: string = 'nome';
        const direction: string = 'desc';

        //when
        service.findAllPaginated(nome, page, size, sortField, direction)
        .then(result => {
            //then    
            const req = httpTestingController.expectOne({
                method: 'GET',
                url: `${service.PATH}/paged?nome=HENRIQUE%20FIGUEIREDO%20DE%20SOUZA&page=${page}&size=${size}&sort=${sortField},${direction}`
            });

            expect(req.request.method).toEqual('GET');

            req.flush(response);

            httpTestingController.verify();
        });

    });

    it('should findById a Funcionario', () => {
        //given
        const response: Funcionario = dados[0];
        
        //when
        service.findById(1).then(result => {
            //then
            expect(result).toEqual(response);

            const req = httpTestingController.expectOne({
                method: 'GET',
                url: `${service.PATH}/1`
            });

            expect(req.request.method).toEqual('GET');

            req.flush(response);

            httpTestingController.verify();
        });

    });

    it('should findByAll Funcionario', () => {
        //given
        const response: Funcionario[] = dados;

        //when
        service.findAll().then(result => {
            //then
            expect(result).toEqual(response);

            const req = httpTestingController.expectOne({
                method: 'GET',
                url: service.PATH
            });

            expect(req.request.method).toEqual('GET');

            req.flush(response);

            httpTestingController.verify();

        });

    });

    it('should insert a Funcionario', () => {
        //given
        const input: Funcionario = dados[0];
        
        //when
        service.insert(input).then(res => {
            //then
            expect(res).toEqual(input);

            const req = httpTestingController.expectOne({
                method: 'POST',
                url: service.PATH
            });

            expect(req.request.method).toEqual('POST');

            req.flush(input);

            httpTestingController.verify();
        
        });

    });

    it('should update a Funcionario', () => {
        //given
        const input: Funcionario = dados[0];

        //when
        service.update(input).then(res => {
            //then
            expect(res).toEqual(input);

            const req = httpTestingController.expectOne({
                method: 'PUT',
                url: `${service.PATH}/93203`
            });

            expect(req.request.method).toEqual('PUT');

            req.flush(input);

            httpTestingController.verify();
        });

    });

    it('should delete a Funcionario', () => {
        //given
        const input: number = 93203;
        
        //when
        service.delete(input).then(res => {
            //then
            expect(res).toBeDefined();

            const req = httpTestingController.expectOne({
                method: 'DELETE',
                url: `${service.PATH}/93203`
            });

            expect(req.request.method).toEqual('DELETE');

            req.flush(1, { status: 200, statusText: 'OK' });

            httpTestingController.verify();
        });
    });    

    it('should report Funcionario', () => {
        //given
        const reportParamForm: ReportParamForm = {
            reportType: 'PDF',
            forceDownload: true
        };
        let response = new Blob();

        //when
        service.report(reportParamForm).then(res => {
            //then    
            expect(res).toBeDefined();
            
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

});