import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AdmParameterCategoryComponent } from './adm-parameter-category.component';
import { AuthService } from 'src/app/base/services/auth.service';

describe('AdmParameterCategoryComponent', () => {
  let component: AdmParameterCategoryComponent;
  let fixture: ComponentFixture<AdmParameterCategoryComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmParameterCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(AdmParameterCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
