import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LayoutProvider } from './layout/context/layoutcontext.tsx'
import './styles/layout/layout.scss';
import AppLayout from './AppLayout.tsx';
import App from './App';
import AdmProfileService from './admin/service/AdmProfileService.ts';
import { MenuItemDTO } from './base/models/MenuItemDTO.ts';
import { UserAuthenticated } from './base/models/UserAuthenticated.ts';
import KeycloakService from './base/services/KeycloakService.ts';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';

const keycloakService: KeycloakService = new KeycloakService();

keycloakService.init().then(async (authenticated: boolean) => {

    //console.log(`User is ${authenticated ? 'authenticated' : 'NOT authenticated'}`);

    if (!authenticated) {
        await keycloakService.login({
            redirectUri: window.location.origin
        });
        // window.location.reload();
    } else {
        keycloakService.loadUserAuthenticated().then((user: UserAuthenticated) => {
            if (user && user.roles && user.roles.length > 0) {
                const admProfileService = new AdmProfileService();

                admProfileService.mountMenu(user.roles).then((menus: MenuItemDTO[]) => {
                    keycloakService.setMenus(menus);

                    ReactDOM.createRoot(document.getElementById('root')!).render(                      
                      <React.StrictMode>
                        <BrowserRouter>
                          <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <LayoutProvider>
                              <AppLayout>
                                <App></App>
                              </AppLayout>
                            </LayoutProvider>
                          </ThemeProvider>
                        </BrowserRouter>
                      </React.StrictMode>
                    )

                });
            }            
        });
    }

}).catch(error => {
    console.error('Failed to initialize keycloakService:', error);
});

export default keycloakService;

