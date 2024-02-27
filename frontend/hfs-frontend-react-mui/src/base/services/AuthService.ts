import { environment } from "../../environments/environment";
import { TokenStorageService } from "./TokenStorageService";

export class AuthService {

    private tokenStorage: TokenStorageService;

    private PATH: string;

    private headersFetch: any;

    //private user$ = new BehaviorSubject<UserAuthenticated>(emptyUserAuthenticated);

    constructor() { 
        this.tokenStorage = new TokenStorageService();
        this.PATH = environment.keycloakHost + '/realms/hfs-realm/protocol/openid-connect/token';
        this.headersFetch = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    public async getAccessToken(): Promise<string> {
        const url: string = this.PATH;
        const body: string = 'username=admin&password=admin&grant_type=password&client_id=hfs-frontend';

        const response = await fetch(url, { 
            method: 'POST', 
            body: JSON.stringify(body), 
            headers: this.headersFetch 
        });

        const json: any = await response.json();
        return json['access_token'];
    }

    public getToken(): string {
        const token: string | null = this.tokenStorage.getToken() || '';
        return `Bearer ${token}`;
        //return { Authorization: `Bearer ${token}` };
    }
/*
    public clear(): void {
        this.tokenStorage.clear();
        this.setUser(emptyUserAuthenticated);
    }

    public setUser(user: UserAuthenticated): void {    
        this.user$.next(user);
    }
    
    public getUser(): Observable<UserAuthenticated> {
        return this.user$.asObservable();
    }    
*/
}