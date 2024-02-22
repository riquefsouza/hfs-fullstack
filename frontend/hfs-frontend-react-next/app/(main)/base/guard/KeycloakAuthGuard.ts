import keycloakService from "../init/KeycloakInit";

export abstract class KeycloakAuthGuard {

    protected authenticated: boolean | undefined = false;
    protected roles: string[] = [];
    abstract isAccessAllowed(url: string, roles: []): Promise<boolean>;

    constructor() {
    }

    public async canActivate(url: string, roles: []): Promise<boolean> {
        try {
            this.authenticated = keycloakService.isLoggedIn();
            this.roles = keycloakService.getUserAuthenticated().roles;            
            return await this.isAccessAllowed(url, roles);
        }
        catch (error) {
            throw new Error('An error happened during access validation. Details:' + error);
        }
    }

    public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        await keycloakService.login(options);
    }
}