import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AdmProfileService } from '../admin/service/AdmProfileService';
import { MenuItemDTO } from '../base/models/MenuItemDTO';
import { ErrorService } from '../base/services/error.service';
import { MessageService } from 'primeng/api';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [AdmProfileService, ErrorService, MessageService]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    userRoles: string[] | null = null;

    sistemaItemMenu: any = 
        { 
            label: 'Sistema',
            items: [
                { label: 'Usuário logado', routerLink: ['/system/usuario'] },
                { label: 'Configuração de Tela', routerLink: ['/system/config'] },
            ]
        };

    constructor(public layoutService: LayoutService,
        private admProfileService: AdmProfileService,
        private readonly keycloak: KeycloakService) { }

    ngOnInit() {
        if (this.keycloak.isLoggedIn()) {
            this.userRoles = this.keycloak.getUserRoles().filter(item => {
                return !(item.includes("-") || item.includes("_"));
            });

            this.admProfileService.mountMenu(this.userRoles)
            .then((menus: MenuItemDTO[]) => {
    
                this.model = menus;
    
                if (this.model) {
                  this.model.push(this.sistemaItemMenu);
                }
    
            });
    
        }
       
    }
}
