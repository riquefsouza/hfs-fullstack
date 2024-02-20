import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './base/init/keycloak-init.factory';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorInterceptor } from './base/interceptors/http-error.interceptor';
import { MessageService } from 'primeng/api';
import { AuthService } from './base/services/auth.service';
import { DefaultInterceptor } from './base/interceptors/default.interceptor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AppLayoutModule,
        KeycloakAngularModule,
        ProgressSpinnerModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DefaultInterceptor,
            multi: true,
        },      
        MessageService,
        AuthService,        
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        { provide: LOCALE_ID, useValue: "pt-BR" },
        { provide: DEFAULT_CURRENCY_CODE, useValue: "BRL", },
        { provide: APP_BASE_HREF, useValue: "/hfs-fullstack" },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
