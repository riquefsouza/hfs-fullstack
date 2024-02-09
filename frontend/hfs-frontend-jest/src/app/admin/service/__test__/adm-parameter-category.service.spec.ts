import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { AdmParameterCategoryService } from '../AdmParameterCategoryService';
import * as jsonDADOS from '../../../../assets/admin/data/admParameterCategory.json';
import { AdmParameterCategory } from '../../api/AdmParameterCategory';
import { AuthService } from '../../../base/services/auth.service';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';

describe('AdmParameterCategoryService', () => {
    let httpTestingController: HttpTestingController;
    let authService: AuthService;
    let service: AdmParameterCategoryService;
    let dadosLength: number = 5;
    let dados: AdmParameterCategory[] = jsonDADOS;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                MessageService,
                AuthService,
                AdmParameterCategoryService
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AdmParameterCategoryService);
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
    
    it('should findIndexById a AdmParameterCategory', () => {
        //given
        let response: AdmParameterCategory[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        //when
        const index: number = service.findIndexById(response, 1);
        
        //then
        expect(response.length).toEqual(dadosLength);
        expect(index).toEqual(0);
    });    

    it('should findAllPaginated parameters categories', () => {
        //given
        const page: number = 0;
        const size: number = dadosLength;
        const sortField: string = 'description';
        const direction: string = 'desc';

        //when
        service.findAllPaginated(page, size, sortField, direction)
        .then(result => {
            //then
            expect(result).toContain("content");

            const req = httpTestingController.expectOne({
                method: 'GET',
                url: `${service.PATH}/paged?page=${page}&size=${size}&sort=${sortField},${direction}`
            });
    
            expect(req.request.method).toEqual('GET');
    
            req.flush(result);
    
            httpTestingController.verify();    
        });

    });

    it('should findById a AdmParameterCategory', () => {
        //given
        const response: AdmParameterCategory = dados[0];

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

    it('should findByAll parameters categories', () => {
        //given
        const response: AdmParameterCategory[] = dados;

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

    it('should insert a AdmParameterCategory', () => {
        //given
        const input: AdmParameterCategory = {
            "id": 1000,
            "description": "NOVO ITEM PARA TESTAR",
            "order": 1000
        };
        
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

    it('should update a AdmParameterCategory', () => {
        //given
        const input: AdmParameterCategory = {
            "id": 1,
            "description": "NOVO ITEM ALTERADO PARA TESTAR",
            "order": 5000
        };

        //when
        service.update(input).then(res => {
            //then
            expect(res).toEqual(input);

            const req = httpTestingController.expectOne({
                method: 'PUT',
                url: `${service.PATH}/1`
            });
    
            expect(req.request.method).toEqual('PUT');
    
            req.flush(input);
    
            httpTestingController.verify();        
    
        });

    });

    it('should delete a AdmParameterCategory', () => {
        //given
        const input: number = 1;
        
        //when
        service.delete(input).then(res => {
            //then
            expect(res).toBeDefined();

            const req = httpTestingController.expectOne({
                method: 'DELETE',
                url: `${service.PATH}/1`
            });
    
            expect(req.request.method).toEqual('DELETE');
    
            req.flush(input, { status: 200, statusText: 'OK' });
    
            httpTestingController.verify();
    
        });
    });    

    it('should report parameters categories', () => {
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
