import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FuncionarioComponent } from './funcionario.component';
import { AuthService } from 'src/app/base/services/auth.service';

describe('FuncionarioComponent', () => {
  let component: FuncionarioComponent;
  let fixture: ComponentFixture<FuncionarioComponent>;

  let httpClient: HttpClient;
  //let httpErrorResponse: HttpErrorResponse;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ FuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    //httpErrorResponse = TestBed.inject(HttpErrorResponse);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(FuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
