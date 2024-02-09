import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import * as jsonTraducaoPtBr from '../assets/i18n/pt-br.json';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    traducaoPtBr: any = jsonTraducaoPtBr;

    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.primengConfig.setTranslation(this.traducaoPtBr['pt-br']);
    }

}
