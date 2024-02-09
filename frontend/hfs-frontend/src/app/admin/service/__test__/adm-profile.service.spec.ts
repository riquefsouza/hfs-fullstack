import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { AdmProfileService } from '../AdmProfileService';
import * as jsonDADOS from '../../../../assets/admin/data/admProfile.json';
import { AdmProfile } from '../../api/AdmProfile';
import { AuthService } from '../../../base/services/auth.service';
import { ReportParamForm } from '../../../base/models/ReportParamsForm';
import { AdmPage } from '../../api/AdmPage';
import { MenuItemDTO } from '../../../base/models/MenuItemDTO';
import * as jsonMENU from '../../../../assets/admin/data/menu.json';

describe('AdmProfileService', () => {
    let httpTestingController: HttpTestingController;
    let authService: AuthService;
    let service: AdmProfileService;
    let dadosLength: number = 2;
    let dados: AdmProfile[] = jsonDADOS;
    let menuDados: MenuItemDTO[] = jsonMENU;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                MessageService,
                AuthService,
                AdmProfileService
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AdmProfileService);
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
    
    it('should findIndexById a AdmProfile', () => {
        //given
        let response: AdmProfile[] = [];
        for (let i = 0; i < dadosLength; i++) {
            response.push(dados[i]);
        }

        //when
        const index: number = service.findIndexById(response, 1);
        
        //then
        expect(response.length).toEqual(dadosLength);
        expect(index).toEqual(0);
    });    

    it('should findAllPaginated AdmProfile', () => {
        //given
        let response: AdmProfile[] = [];
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

    it('should findById a AdmProfile', () => {
        const response: AdmProfile = dados[0];

        service.findById(1).then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();    

    });

    it('should findByAll AdmProfile', () => {
        const response: AdmProfile[] = dados;

        service.findAll().then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: service.PATH
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();

    });

    it('should insert a AdmProfile', () => {
        const input: AdmProfile = dados[0];
        
        service.insert(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'POST',
            url: service.PATH
        });

        expect(req.request.method).toEqual('POST');

        req.flush(input);

        httpTestingController.verify();

    });

    it('should update a AdmProfile', () => {
        const input: AdmProfile = dados[0];

        service.update(input).then(res => expect(res).toEqual(input));

        const req = httpTestingController.expectOne({
            method: 'PUT',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('PUT');

        req.flush(input);

        httpTestingController.verify();        

    });

    it('should delete a AdmProfile', () => {
            
        service.delete(1).then(res => expect(res).toBeDefined());

        const req = httpTestingController.expectOne({
            method: 'DELETE',
            url: `${service.PATH}/1`
        });

        expect(req.request.method).toEqual('DELETE');

        req.flush(1, { status: 200, statusText: 'OK' });

        httpTestingController.verify();

    });    

    it('should report AdmProfile', () => {
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

    it('should findProfilesByPage', () => {
        const input: AdmPage = {
            "id": 1,
            "description": "Category of Configuration Parameters",
            "url": "admin/admParameterCategory/listAdmParameterCategory.xhtml",
            "admIdProfiles": [1]
        };
        const response: AdmProfile[] = [dados[0]];

        service.findProfilesByPage(input).then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'GET',
            url: `${service.PATH}/findProfilesByPage/1`
        });

        expect(req.request.method).toEqual('GET');

        req.flush(response);

        httpTestingController.verify();    

    });
/*
    it('should mountMenu', () => {
        const input: string[] = ["Gestor","Administrador"];        
        const response: MenuItemDTO[] = menuDados;

        service.mountMenu(input).then(res => expect(res).toEqual(response));

        const req = httpTestingController.expectOne({
            method: 'POST',
            url: `${service.PATH}/mountMenu`
        });

        expect(req.request.method).toEqual('POST');

        req.flush(input);

        httpTestingController.verify();

    });
*/
});
