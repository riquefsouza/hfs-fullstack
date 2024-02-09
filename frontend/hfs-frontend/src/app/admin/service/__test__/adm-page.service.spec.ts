import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { AdmPageService } from '../AdmPageService';
import * as jsonDADOS from '../../../../assets/admin/data/admPage.json';
import { AdmPage } from '../../api/AdmPage';
import { AuthService } from '../../../base/services/auth.service';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';

describe('AdmPageService', () => {
    let httpTestingController: HttpTestingController;
    let authService: AuthService;
    let service: AdmPageService;
    let dadosLength: number = 12;
    let dados: AdmPage[] = jsonDADOS;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                MessageService,
                AuthService,
                AdmPageService
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AdmPageService);
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
    
    it('should findIndexById a AdmPage', () => {
        //given
        let response: AdmPage[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        //when
        const index: number = service.findIndexById(response, 1);
        
        //then
        expect(response.length).toEqual(dadosLength);
        expect(index).toEqual(0);
    });    

    it('should findAllPaginated AdmPage', () => {
        //given
        let response: AdmPage[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        const page: number = 0;
        const size: number = response.length;
        const sortField: string = 'description';
        const direction: string = 'desc';

        //when
        service.findAllPaginated(page, size, sortField, direction)
            .then(res => expect(res).toEqual(response));

        //then    
        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/paged?page=${page}&size=${size}&sort=${sortField},${direction}`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();

    });

    it('should findById a AdmPage', () => {
        const response: AdmPage = dados[0];

        service.findById(1).then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();    

    });

    it('should findByAll AdmPage', () => {
        const response: AdmPage[] = dados;

        service.findAll().then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: service.PATH
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();

    });

    it('should insert a AdmPage', () => {
        const input: AdmPage = dados[0];
        
        service.insert(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'POST',
            url: service.PATH
        });

        expect(req.request.method).toEqual('POST');

        req.flush(input);

        httpTestingController.verify();

    });

    it('should update a AdmPage', () => {
        const input: AdmPage = dados[0];

        service.update(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'PUT',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('PUT');

        req.flush(input);

        httpTestingController.verify();        

    });

    it('should delete a AdmPage', () => {
            
        service.delete(1).then(res => expect(res).toBeDefined());

        const req = httpTestingController.expectOne({
            method: 'DELETE',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('DELETE');

        req.flush(1, { status: 200, statusText: 'OK' });

        httpTestingController.verify();

    });    

    it('should report AdmPage', () => {
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
