import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AdmParameterComponent } from './adm-parameter.component';
import { AuthService } from 'src/app/base/services/auth.service';

describe('AdmParameterComponent', () => {
  let component: AdmParameterComponent;
  let fixture: ComponentFixture<AdmParameterComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [MessageService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmParameterComponent ]      
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(AdmParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
