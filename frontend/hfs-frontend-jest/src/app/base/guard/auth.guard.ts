import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from '../services/auth.service';
import { UserAuthenticated } from '../models/user-authenticated.interface';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  private userRoles: string[] | null = null;

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private tokenStorage: TokenStorageService,
    private location: Location,
    private authService: AuthService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin +  this.location.prepareExternalUrl(state.url)
      });
    }

    if(this.keycloak.isLoggedIn()) {
      
      this.keycloak.getToken().then(ptoken => {
        this.tokenStorage.saveToken(ptoken);
      });

      this.userRoles = this.keycloak.getUserRoles().filter(item => {
          return !(item.includes("-") || item.includes("_"));
      });

      this.keycloak.loadUserProfile().then((userProfile: KeycloakProfile | null) => {
          const user: UserAuthenticated = {                        
              id: userProfile.id,
              userName: userProfile.username,
              fullName: `${userProfile.firstName} ${userProfile.lastName}`,
              email: userProfile.email,
              emailVerified: userProfile.emailVerified,
              roles: this.userRoles,
              isAdmin: this.keycloak.isUserInRole("Administrador")
          };
          this.authService.setUser(user);
      });

  }    

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
    
  }
}