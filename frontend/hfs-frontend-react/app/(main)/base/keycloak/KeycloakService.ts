import { Subject } from 'rxjs';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
//import { KeycloakEventType } from './KeycloakEventType';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
export interface ExcludedUrl {
    url: string;
    httpMethods?: HttpMethods[];
}
export interface ExcludedUrlRegex {
    urlPattern: RegExp;
    httpMethods?: HttpMethods[];
}
export interface KeycloakOptions {
    config?: string | Keycloak.KeycloakConfig;
    initOptions?: Keycloak.KeycloakInitOptions;
    enableBearerInterceptor?: boolean;
    loadUserProfileAtStartUp?: boolean;
    bearerExcludedUrls?: (string | ExcludedUrl)[];
    authorizationHeaderName?: string;
    bearerPrefix?: string;
    updateMinValidity?: number;
    //shouldAddToken?: (request: HttpRequest<unknown>) => boolean;
    //shouldUpdateToken?: (request: HttpRequest<unknown>) => boolean;
}

declare enum KeycloakEventType {
    OnAuthError = 0,
    OnAuthLogout = 1,
    OnAuthRefreshError = 2,
    OnAuthRefreshSuccess = 3,
    OnAuthSuccess = 4,
    OnReady = 5,
    OnTokenExpired = 6,
    OnActionUpdate = 7
}
export interface KeycloakEvent {
    type: KeycloakEventType;
    args?: unknown;
}

export class KeycloakService {

    private _instance: Keycloak;

    private _userProfile: KeycloakProfile | undefined;

    private _keycloakEvents$: Subject<any>;

    private _enableBearerInterceptor: boolean = true;
    private _loadUserProfileAtStartUp: boolean = false;
    /*
    private _bearerExcludedUrls: [] = [];
    private _authorizationHeaderName: string = 'Authorization';
    private _bearerPrefix: string = 'Bearer';
    private _initOptions: KeycloakInitOptions | undefined;
    private _updateMinValidity: number = 20;
    */
    private _excludedUrls: ExcludedUrlRegex[] = [];
    private _silentRefresh: boolean = false;

    constructor() {
        //this._instance = new Keycloak();
        this._keycloakEvents$ = new Subject();
    }

    private bindsKeycloakEvents() {
        this._instance.onAuthError = (errorData) => {
            this._keycloakEvents$.next({
                args: errorData,
                type: KeycloakEventType.OnAuthError
            });
        };
        this._instance.onAuthLogout = () => {
            this._keycloakEvents$.next({ type: KeycloakEventType.OnAuthLogout });
        };
        this._instance.onAuthRefreshSuccess = () => {
            this._keycloakEvents$.next({
                type: KeycloakEventType.OnAuthRefreshSuccess
            });
        };
        this._instance.onAuthRefreshError = () => {
            this._keycloakEvents$.next({
                type: KeycloakEventType.OnAuthRefreshError
            });
        };
        this._instance.onAuthSuccess = () => {
            this._keycloakEvents$.next({ type: KeycloakEventType.OnAuthSuccess });
        };
        this._instance.onTokenExpired = () => {
            this._keycloakEvents$.next({
                type: KeycloakEventType.OnTokenExpired
            });
        };
        this._instance.onActionUpdate = (state) => {
            this._keycloakEvents$.next({
                args: state,
                type: KeycloakEventType.OnActionUpdate
            });
        };
        this._instance.onReady = (authenticated) => {
            this._keycloakEvents$.next({
                args: authenticated,
                type: KeycloakEventType.OnReady
            });
        };
    }

    public loadExcludedUrls(bearerExcludedUrls: ExcludedUrlRegex[]) {
        const excludedUrls = [];
        for (const item of bearerExcludedUrls) {
            let excludedUrl;
            if (typeof item === 'string') {
                excludedUrl = { urlPattern: new RegExp(item, 'i'), httpMethods: [] };
            }
            else {
                excludedUrl = {
                    urlPattern: new RegExp(item.url, 'i'),
                    httpMethods: item.httpMethods
                };
            }
            excludedUrls.push(excludedUrl);
        }
        return excludedUrls;
    }
    
    public async init(options?: KeycloakOptions): Promise<boolean> {
        const { config, initOptions } = options;

        config.enableBearerInterceptor = true;
        config.loadUserProfileAtStartUp = false;
        config.authorizationHeaderName = 'Authorization';
        config.bearerPrefix = 'Bearer ';
        config.excludedUrls = this.loadExcludedUrls([]);
        config.silentRefresh = initOptions ? initOptions.flow === 'implicit' : false;
        config.updateMinValidity = 20;
        //config.shouldAddToken = shouldAddToken;
        //config.shouldUpdateToken = shouldUpdateToken;
        
        this._instance = new Keycloak(config);
        this.bindsKeycloakEvents();
        const authenticated = await this._instance.init(initOptions);

        if (authenticated && this._loadUserProfileAtStartUp) {
            await this.loadUserProfile();
        }
        return authenticated;
    }

    public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        if (this._instance) {
            await this._instance.login(options);    
        }
    }

    public async logout(redirectUri?: string): Promise<void> {
        const options = {
            redirectUri
        };
        await this._instance.logout(options);
        this._userProfile = undefined;
    }

    public async register(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        await this._instance.register(options);
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

    public isLoggedIn(): boolean {
        if (!this._instance) {
            return false;
        }
        return this._instance.authenticated;
    }

    public isTokenExpired(minValidity?: number): boolean {
        return this._instance.isTokenExpired(minValidity);
    }

    public async updateToken(minValidity?: number): Promise<boolean> {
        if (this._silentRefresh) {
            if (this.isTokenExpired()) {
                throw new Error('Failed to refresh the token, or the session is expired');
            }
            return Promise.resolve(true);
        }
        if (!this._instance) {
            throw new Error('Keycloak is not initialized.');
        }
        try {
            return await this._instance.updateToken(minValidity);
        }
        catch (error) {
            //return Promise.resolve(false);
            return Promise.reject(false);
        }
    }

    public async loadUserProfile(forceReload?: boolean): Promise<KeycloakProfile> {
        if (this._userProfile && !forceReload) {
            return this._userProfile;
        }
        if (!this._instance.authenticated) {
            throw new Error('The user profile was not loaded as the user is not logged in.');
        }
        return (this._userProfile = await this._instance.loadUserProfile());
    }

    public async getToken(): Promise<string> {
        return this._instance.token;
    }

    public getUsername(): string {
        if (!this._userProfile) {
            throw new Error('User not logged in or user profile was not loaded.');
        }
        return this._userProfile.username;
    }

    public clearToken(): void {
        this._instance.clearToken();
    }

    /*
    public addTokenToHeader(headers?: HttpHeaders): Observable<HttpHeaders> {
        return from(this.getToken()).pipe(map((token) => token
            ? headers.set(this._authorizationHeaderName, this._bearerPrefix + token)
            : headers));
    }
    */

    public getKeycloakInstance(): Keycloak {
        return this._instance;
    }

    public get excludedUrls(): ExcludedUrlRegex[] {
        return this._excludedUrls;
    }

    public get enableBearerInterceptor(): boolean {
        return this._enableBearerInterceptor;
    }

    public get keycloakEvents$(): Subject<KeycloakEvent> {
        return this._keycloakEvents$;
    }
}