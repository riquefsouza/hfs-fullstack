import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AdmPageComponent } from './adm-page.component';
import { AdmProfileService } from '../../service/AdmProfileService';
import { FormsModule } from '@angular/forms';

describe('AdmPageComponent', () => {
  let component: AdmPageComponent;
  let fixture: ComponentFixture<AdmPageComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let admProfileService: AdmProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule],
      providers: [MessageService, AdmProfileService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
    admProfileService = TestBed.inject(AdmProfileService);

    fixture = TestBed.createComponent(AdmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
