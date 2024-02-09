import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { TokenStorageService } from './token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAuthenticated } from '../models/user-authenticated.interface';

@Injectable()
export class AuthService {

    private PATH: string;

    private headers: HttpHeaders;

    private user$ = new BehaviorSubject<UserAuthenticated | null>(null);

    constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { 
        this.PATH = environment.keycloakHost + '/realms/hfs-realm/protocol/openid-connect/token';
        this.headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    public async getAccessToken(): Promise<string> {
        const url: string = this.PATH;
        const body: string = 'username=admin&password=admin&grant_type=password&client_id=hfs-frontend';

        const res$ = this.http.post<any>(url, body, { headers: this.headers });

        const json: string = await lastValueFrom(res$);
        return json['access_token'];
    }

    public getToken(): string {
        const token: string | null = this.tokenStorage.getToken() || '';
        return `Bearer ${token}`;
        //return { Authorization: `Bearer ${token}` };
    }

    public clear(): void {
        this.tokenStorage.clear();
        this.setUser(null);
    }

    public setUser(user: UserAuthenticated | null): void {    
        this.user$.next(user);
    }
    
    getUser(): Observable<UserAuthenticated | null> {
        return this.user$.asObservable();
    }    
}