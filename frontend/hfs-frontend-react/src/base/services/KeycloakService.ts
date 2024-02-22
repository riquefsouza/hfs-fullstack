import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { TokenStorageService } from "../../base/services/TokenStorageService";
import { UserAuthenticated, emptyUserAuthenticated } from '../models/UserAuthenticated';
import { environment } from '../../environments/environment';
import { MenuItemDTO } from '../models/MenuItemDTO';
import { SessionStorageService } from './SessionStorageService';

export default class KeycloakService {

    private _instance: Keycloak;
    private _userProfile: KeycloakProfile | undefined;
    private _userAuthenticated: UserAuthenticated;
    private _menus: MenuItemDTO[];
    private tokenStorage: TokenStorageService;
    private sessionStorageService: SessionStorageService;
    
    constructor() {
        this._userAuthenticated = emptyUserAuthenticated;
        this._menus = [];
        this.tokenStorage = new TokenStorageService();
        this.sessionStorageService = new SessionStorageService();

        this._instance = new Keycloak({
            url: environment.keycloakHost,
            realm: environment.keycloakRealm,
            clientId: environment.keycloakClient
        });

        this._instance.onTokenExpired = () => {
            this.updateToken(true);
        };        
    }

    public async init(): Promise<boolean> {
        const authenticated = await this._instance.init({
            onLoad: 'check-sso',
            checkLoginIframe: false,
            silentCheckSsoRedirectUri:
                window.location.origin + '/silent-check-sso.html'
        });

        return authenticated;
    }

    public updateToken(refresh = false) {
        if (refresh) {
            this._instance.updateToken(70).then((refreshed: boolean) => {
                if (refreshed) {
                    this.tokenStorage.saveToken(this._instance.token);
                }
            });
        }
    }

    public isUserInRole(role: string, resource?: string): boolean {
        let hasRole;
        hasRole = this._instance.hasResourceRole(role, resource);
        if (!hasRole) {
            hasRole = this._instance.hasRealmRole(role);
        }
        return hasRole;
    }    

    public getUserRoles(realmRoles?: boolean, resource?: string): string[] {
        let roles: string[] = [];
        if (this._instance.resourceAccess) {
            Object.keys(this._instance.resourceAccess).forEach((key) => {
                if (resource && resource !== key) {
                    return;
                }
                if (this._instance.resourceAccess){
                    const resourceAccess = this._instance.resourceAccess[key];
                    const clientRoles = resourceAccess['roles'] || [];
                    roles = roles.concat(clientRoles);    
                }
            });
        }
        if (realmRoles && this._instance.realmAccess) {
            const realmRoles = this._instance.realmAccess['roles'] || [];
            roles.push(...realmRoles);
        }        
        return roles;
    }

    public async loadUserAuthenticated(): Promise<UserAuthenticated> {
        this.tokenStorage.saveToken(this.getToken());

        if (!this._instance.authenticated) {
            throw new Error('The user profile was not loaded as the user is not logged in.');
        }
        this._userProfile = await this._instance.loadUserProfile();

        this._userAuthenticated = this.buildUserAuthenticated(this._userProfile);

        this.sessionStorageService.persistObj('userAuthenticated', this._userAuthenticated);

        return this._userAuthenticated;
    }

    private buildUserAuthenticated(userProfile: KeycloakProfile) {
        let userRoles: string[] = [];

        userRoles = this.getUserRoles(true).filter(item => {
            return !(item.includes("-") || item.includes("_"));
        });

        this._userAuthenticated = {
            id: userProfile.id,
            userName: userProfile.username,
            fullName: `${userProfile.firstName} ${userProfile.lastName}`,
            email: userProfile.email,
            emailVerified: userProfile.emailVerified,
            roles: userRoles,
            isAdmin: this.isUserInRole("Administrador")
        };

        return this._userAuthenticated;
    }

    public setMenus(menus: MenuItemDTO[]){
        this._menus = menus;
    }

    public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        if (this._instance) {
            await this._instance.login(options);    
        }
    }

    public async logout(redirectUri?: string): Promise<void> {
        this._userProfile = undefined;
        this.tokenStorage.clear();   
        this.sessionStorageService.removePersistedObj('userAuthenticated');

        const options = {
            redirectUri
        };
        await this._instance.logout(options);
    }

    public async register(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        await this._instance.register(options);
    }

    public isLoggedIn(): boolean {
        if (!this._instance) {
            return false;
        }
        if (this._instance.authenticated) {
            return this._instance.authenticated;
        }
        return false;
    }

    public isTokenExpired(minValidity?: number): boolean {
        return this._instance.isTokenExpired(minValidity);
    }

    public getToken(): string | undefined {
        return this._instance.token;
    }

    public clearToken(): void {
        this._instance.clearToken();
    }

    public getKeycloakInstance(): Keycloak {
        return this._instance;
    }

    public getUserAuthenticated(): UserAuthenticated {
        return this._userAuthenticated;
    }

    public getMenus(): MenuItemDTO[] {
        return this._menus;
    }

}