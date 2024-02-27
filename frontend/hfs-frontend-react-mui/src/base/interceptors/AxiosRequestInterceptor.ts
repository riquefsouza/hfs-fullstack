import axios from 'axios';
//import keycloakService from '../providers/KeycloakProvider';
import keycloakService from '../../main';

axios.interceptors.request.use(
    config => {
        config.headers['Cache-Control'] = 'no-cache';
        config.headers['Content-Type'] = 'application/json';
        
        if(keycloakService.isLoggedIn()) {
            config.headers['Authorization'] = 'Bearer ' + keycloakService.getToken();
        }
        
        return config
    },
    error => {
        Promise.reject(error)
    }
)

export default axios;