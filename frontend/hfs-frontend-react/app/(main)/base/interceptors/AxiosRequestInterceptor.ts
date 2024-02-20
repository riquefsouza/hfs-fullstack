import axios from 'axios'
import { TokenStorageService } from '../services/TokenStorageService';
import keycloakService from '../keycloak/KeycloakInit';

const tokenStorage = new TokenStorageService();

axios.interceptors.request.use(
    config => {
        config.headers['Cache-Control'] = 'no-cache';
        config.headers['Content-Type'] = 'application/json';
        
        if(keycloakService.isLoggedIn()) {
            config.headers['Authorization'] = 'Bearer ' + tokenStorage.getToken();
        }
        
        return config
    },
    error => {
        Promise.reject(error)
    }
)

export default axios;