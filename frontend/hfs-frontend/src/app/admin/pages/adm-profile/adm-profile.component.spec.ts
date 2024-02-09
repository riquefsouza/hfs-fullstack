import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AdmProfileComponent } from './adm-profile.component';
import { AdmPageService } from '../../service/AdmPageService';
import { FormsModule } from '@angular/forms';

describe('AdmProfileComponent', () => {
  let component: AdmProfileComponent;
  let fixture: ComponentFixture<AdmProfileComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let admPageService: AdmPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,FormsModule],
      providers: [MessageService, AdmPageService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AdmProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);
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
