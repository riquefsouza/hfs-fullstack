import { KeycloakService } from "./KeycloakService";

export abstract class KeycloakAuthGuard {

    protected keycloakService: KeycloakService;
    protected authenticated: boolean = false;
    protected roles: string[] = [];
    abstract isAccessAllowed(url: string, roles: []): Promise<boolean>;

    constructor(keycloakService: KeycloakService) {
        this.keycloakService = keycloakService;
    }

    public async canActivate(url: string, roles: []): Promise<boolean> {
        try {
            this.authenticated = this.keycloakService.isLoggedIn();
            this.roles = this.keycloakService.getUserRoles(true);
            return await this.isAccessAllowed(url, roles);
        }
        catch (error) {
            throw new Error('An error happened during access validation. Details:' + error);
        }
    }
}