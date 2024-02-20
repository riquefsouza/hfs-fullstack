export var KeycloakEventType;
(function (KeycloakEventType) {
    KeycloakEventType[KeycloakEventType["OnAuthError"] = 0] = "OnAuthError";
    KeycloakEventType[KeycloakEventType["OnAuthLogout"] = 1] = "OnAuthLogout";
    KeycloakEventType[KeycloakEventType["OnAuthRefreshError"] = 2] = "OnAuthRefreshError";
    KeycloakEventType[KeycloakEventType["OnAuthRefreshSuccess"] = 3] = "OnAuthRefreshSuccess";
    KeycloakEventType[KeycloakEventType["OnAuthSuccess"] = 4] = "OnAuthSuccess";
    KeycloakEventType[KeycloakEventType["OnReady"] = 5] = "OnReady";
    KeycloakEventType[KeycloakEventType["OnTokenExpired"] = 6] = "OnTokenExpired";
    KeycloakEventType[KeycloakEventType["OnActionUpdate"] = 7] = "OnActionUpdate";
})(KeycloakEventType || (KeycloakEventType = {}));
