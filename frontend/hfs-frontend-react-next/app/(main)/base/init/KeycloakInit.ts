import { environment } from "@/environments/environment";
import AdmProfileService from "../../admin/service/AdmProfileService";
import { MenuItemDTO } from "../models/MenuItemDTO";
import { UserAuthenticated } from "../models/UserAuthenticated";
import KeycloakService from "../services/KeycloakService";
import Keycloak from 'keycloak-js';
import { SessionStorageService } from "../services/SessionStorageService";
import { TokenStorageService } from "../services/TokenStorageService";

const keycloak = new Keycloak({
    url: environment.keycloakHost,
    realm: environment.keycloakRealm,
    clientId: environment.keycloakClient
});

const keycloakService: KeycloakService = new KeycloakService(keycloak);
const sessionStorageService = new SessionStorageService();
const tokenStorage = new TokenStorageService();

const updateToken = (refresh = false) => {
    if (refresh) {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
            tokenStorage.saveToken(keycloak.token);
        }
      });
    }
};

export async function initializeKeycloak() {

    try {

        const authenticated = await keycloakService.getKeycloakInstance().init({
            onLoad: 'check-sso',
            checkLoginIframe: false,
            //silentCheckSsoRedirectUri:
            //    window.location.origin + '/silent-check-sso.html'
        });
    
        keycloakService.getKeycloakInstance().onTokenExpired = () => {
            updateToken(true);
        };        

        console.log(`User is ${authenticated ? 'authenticated' : 'NOT authenticated'}`);

        if (!authenticated) {
            await keycloakService.login({
                redirectUri: window.location.origin
            });
            // window.location.reload();
        } else {
            tokenStorage.saveToken(keycloakService.getToken());

            keycloakService.loadUserAuthenticated().then((user: UserAuthenticated) => {

                sessionStorageService.persistObj('userAuthenticated', user);

                if (user && user.roles && user.roles.length > 0) {
                    const admProfileService = new AdmProfileService();

                    admProfileService.mountMenu(user.roles).then((menus: MenuItemDTO[]) => {
                        keycloakService.setMenus(menus);
                        sessionStorageService.persistObj('menus', menus);
                        //console.log(menus);
                    });
                }            
            });
        }

    } catch (error) {
        console.error('Failed to initialize keycloakService:', error);
    }

}

export default keycloakService;