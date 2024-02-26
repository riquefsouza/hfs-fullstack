//import keycloakService from "../init/KeycloakInit";

import { UserAuthenticated, emptyUserAuthenticated } from "../models/UserAuthenticated";
import { SessionStorageService } from "../services/SessionStorageService";

export abstract class KeycloakAuthGuard {

    private sessionStorageService: SessionStorageService;
    private userAuthenticated: UserAuthenticated = emptyUserAuthenticated;
    protected authenticated: boolean | undefined = false;
    protected roles: string[] = [];
    abstract isAccessAllowed(url: string, roles: []): Promise<boolean>;

    constructor() {
        this.sessionStorageService = new SessionStorageService();
    }

    public async canActivate(url: string, roles: []): Promise<boolean> {
        try {
            //this.authenticated = keycloakService.isLoggedIn();
            //this.roles = keycloakService.getUserAuthenticated().roles;            
            this.userAuthenticated = this.sessionStorageService.getPersistedObj('userAuthenticated') as UserAuthenticated;
            if (this.userAuthenticated){
                this.authenticated = true;
                this.roles = this.userAuthenticated.roles;
            } else {
                this.authenticated = false;
                this.roles = [];
            }

            return await this.isAccessAllowed(url, roles);
        }
        catch (error) {
            throw new Error('An error happened during access validation. Details:' + error);
        }
    }
    /*
    public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        await keycloakService.login(options);
    }
    */
}