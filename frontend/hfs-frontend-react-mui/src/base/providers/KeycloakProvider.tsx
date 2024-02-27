import React, { useEffect } from "react";
import KeycloakService from "../services/KeycloakService";
import { UserAuthenticated } from "../models/UserAuthenticated";
import AdmProfileService from "../../admin/service/AdmProfileService";
import { MenuItemDTO } from "../models/MenuItemDTO";
import { SessionStorageService } from "../services/SessionStorageService";

const keycloakService: KeycloakService = new KeycloakService();

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {        
        const sessionStorageService = new SessionStorageService();
        
        keycloakService.init().then(async (authenticated: boolean) => {
        
            //console.log(`User is ${authenticated ? 'authenticated' : 'NOT authenticated'}`);
        
            if (!authenticated) {
                await keycloakService.login({
                    redirectUri: window.location.origin
                });
                // window.location.reload();
            } else {
                keycloakService.loadUserAuthenticated().then((user: UserAuthenticated) => {
                    
                    //sessionStorageService.persistObj('userAuthenticated', user);

                    if (user && user.roles && user.roles.length > 0) {
                        const admProfileService = new AdmProfileService();
        
                        admProfileService.mountMenu(user.roles).then((menus: MenuItemDTO[]) => {
                            keycloakService.setMenus(menus);
                            sessionStorageService.persistObj('menus', menus);
                            console.log(menus);
                        });
                    }            
                });
            }
        
        }).catch(error => {
            console.error('Failed to initialize keycloakService:', error);
        });

    }, []);

    return <>{children}</>;
};

export default keycloakService;
