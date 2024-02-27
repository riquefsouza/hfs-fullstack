import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { KeycloakService } from 'keycloak-angular';
import { MenuItemDTO } from '../base/models/MenuItemDTO';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItemDTO[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,
        private readonly keycloak: KeycloakService) { }

    public logout() {
        this.keycloak.logout();
    }
}
 