import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AdmMenuComponent } from './adm-menu.component';
import { ExportService } from '../../../base/services/export.service';
import { AuthService } from '../../../base/services/auth.service';

describe('AdmMenuComponent', () => {
  let component: AdmMenuComponent;
  let fixture: ComponentFixture<AdmMenuComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let exportService: ExportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [MessageService, ExportService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
    exportService = TestBed.inject(ExportService);
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(AdmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
