import { Component, OnInit } from '@angular/core';
//import * as jsonTraducaoPtBr from '../assets/i18n/pt-br.json';
import { LoaderService } from './base/services/loader.service';

@Component({
    selector: 'app-root',
    styleUrls: ["./app.component.css"],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    //traducaoPtBr: any = jsonTraducaoPtBr;

    height = 0;
    width = 0;

    constructor(public loaderService: LoaderService) {}

    ngOnInit() {
        this.height = document.body.clientHeight;
        this.width = document.body.clientWidth;
    }

}
