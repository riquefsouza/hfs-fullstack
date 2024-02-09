export const environment = {
  production: true,
  keycloakHost: process.env["KEYCLOAK_HOST"],
  keycloakRealm: process.env["KEYCLOAK_REALM"],
  keycloakClient: process.env["KEYCLOAK_CLIENT"],
  backendUrl: process.env["BACKEND_HOST"],
  backendApiURL: process.env["BACKEND_HOST"]
};
