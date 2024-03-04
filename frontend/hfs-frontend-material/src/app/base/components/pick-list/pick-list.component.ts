import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatListOption, MatSelectionList } from "@angular/material/list";
import { Entidade } from "../../models/Entidade";

@Component({
    selector: 'pickList',
    templateUrl: './pick-list.component.html',
    styleUrls: ['./pick-list.component.css']
})
export class PickListComponent<T extends Entidade> implements OnInit {

    @Input() sourceLista: T[];
    @Input() targetLista: T[];

    @ViewChild('source') source: MatSelectionList;
    @ViewChild('target') target: MatSelectionList;
    
    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
    }

    public findIndexById(lista: T[], id: number): number {
        let index = -1;
        for (let i = 0; i < lista.length; i++) {

            if (lista[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    addTarget() {
        let items: MatListOption[] = this.source.selectedOptions.selected;
        if (items.length > 0) {
            items.forEach(item => {
                this.targetLista.push(item.value);

                let index = this.findIndexById(this.sourceLista, item.value.id);
                this.sourceLista.splice(index, 1);
            });
        }
    }

    addAllTarget() {
        this.sourceLista.forEach(item => {
            this.targetLista.push(item);
        });
        this.sourceLista = [];
    }

    addSource() {
        let items: MatListOption[] = this.target.selectedOptions.selected;
        if (items.length > 0) {
            items.forEach(item => {
                this.sourceLista.push(item.value);

                let index = this.findIndexById(this.targetLista, item.value.id);
                this.targetLista.splice(index, 1);
            });
        }
    }

    addAllSource() {
        this.targetLista.forEach(item => {
            this.sourceLista.push(item);
        });
        this.targetLista = [];
    }
}
