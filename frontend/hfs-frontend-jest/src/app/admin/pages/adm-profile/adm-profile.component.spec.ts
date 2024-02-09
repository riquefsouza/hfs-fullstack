import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ExportService } from '../../../base/services/export.service';
import { MessageService } from 'primeng/api';
import { AdmProfileComponent } from './adm-profile.component';
import { AdmPageService } from '../../service/AdmPageService';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../base/services/auth.service';

describe('AdmProfileComponent', () => {
  let component: AdmProfileComponent;
  let fixture: ComponentFixture<AdmProfileComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let exportService: ExportService;
  let admPageService: AdmPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,FormsModule],
      providers: [MessageService, ExportService, AdmPageService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
    exportService = TestBed.inject(ExportService);
    messageService = TestBed.inject(MessageService);
    admPageService = TestBed.inject(AdmPageService);

    fixture = TestBed.createComponent(AdmProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
