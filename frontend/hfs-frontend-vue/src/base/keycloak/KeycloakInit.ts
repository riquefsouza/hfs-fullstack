import { KeycloakService } from "./KeycloakService";
import { KeycloakProfile } from "keycloak-js";
import { UserAuthenticated } from "../models/UserAuthenticated";
import { TokenStorageService } from "../services/TokenStorageService";
import { SessionStorageService } from "../services/SessionStorageService";
import { environment } from "../../environments/environment";

const tokenStorage = new TokenStorageService();
const sessionStorageService = new SessionStorageService();
let userRoles: string[] = [];

const keycloakService: KeycloakService = new KeycloakService();

export async function initializeKeycloak() {

  try {
    const authenticated = await keycloakService.init({
      config: {
        url: environment.keycloakHost,
        realm: environment.keycloakRealm,
        clientId: environment.keycloakClient
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html'
      },
      enableBearerInterceptor: true,
      bearerPrefix: "Bearer",
      bearerExcludedUrls: [],
    });

    console.log(`User is ${authenticated ? 'authenticated' : 'NOT authenticated'}`);

    if (!authenticated) {
      await keycloakService.login({
        redirectUri: window.location.origin
      });
    } else {

      keycloakService.getToken().then(ptoken => {
        tokenStorage.saveToken(ptoken);
      });

      userRoles = keycloakService.getUserRoles(true).filter(item => {
        return !(item.includes("-") || item.includes("_"));
      });

      keycloakService.loadUserProfile().then((userProfile: KeycloakProfile) => {
        const user: UserAuthenticated = {
          id: userProfile.id,
          userName: userProfile.username,
          fullName: `${userProfile.firstName} ${userProfile.lastName}`,
          email: userProfile.email,
          emailVerified: userProfile.emailVerified,
          roles: userRoles,
          isAdmin: keycloakService.isUserInRole("Administrador")
        };
        sessionStorageService.persistObj('userAuthenticated', user);
      });

    }

  } catch (error) {
    console.error('Failed to initialize keycloakService:', error);
  }
}

export default keycloakService;
