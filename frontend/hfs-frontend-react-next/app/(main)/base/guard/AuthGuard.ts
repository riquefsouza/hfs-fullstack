import { KeycloakAuthGuard } from './KeycloakAuthGuard';

export default class AuthGuard extends KeycloakAuthGuard {

  public async isAccessAllowed(url: string, roles: []): Promise<boolean> {

    if (!this.authenticated) {
      //await this.login({
        //redirectUri: window.location.origin + url
      //});
    }

    // Get the roles required from the route.
    const requiredRoles = roles;

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
    
  }
}