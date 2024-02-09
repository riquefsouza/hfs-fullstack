import { KeycloakService } from "keycloak-angular";
import { environment } from "../../../environments/environment";

export function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
      keycloak.init({
        config: {
          url: environment.keycloakHost,
          realm: environment.keycloakRealm,
          clientId: environment.keycloakClient
        },
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html'
        },
        enableBearerInterceptor: true,
        bearerPrefix: "Bearer",
        bearerExcludedUrls: [],        
      });
}
