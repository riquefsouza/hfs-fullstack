import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import KeycloakService from "./base/services/KeycloakService";
import { UserAuthenticated } from "./base/models/UserAuthenticated";
import AdmProfileService from "./admin/service/AdmProfileService";
import { MenuItemDTO } from "./base/models/MenuItemDTO";
import ReportPanel from './base/components/ReportPanel.vue';
import PickList from './base/components/PickList.vue';
import '@/assets/styles.scss';

// Vuetify
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, md } from 'vuetify/iconsets/md';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },  
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
//app.use(ToastService);

//app.directive('tooltip', Tooltip);


app.component('DataView', DataView);
app.component('ReportPanel', ReportPanel);
app.component('PickList', PickList);

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

                    app.mount('#app');
                });
            }            
        });
    }

}).catch(error => {
    console.error('Failed to initialize keycloakService:', error);
});

export default keycloakService;