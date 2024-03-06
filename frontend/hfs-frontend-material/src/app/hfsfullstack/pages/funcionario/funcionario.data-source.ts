import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Funcionario } from "../../api/funcionario";
import { FuncionarioService } from "../../service/funcionario.service";
import { PaginationDTO, emptyPaginationDTO } from "src/app/base/models/PaginationDTO";
import { DataTableFilterMeta, LazyTableParam, emptyLazyTableParam } from "src/app/base/models/LazyTableParam";

export class FuncionarioDataSource implements DataSource<Funcionario> {

    private funcionariosSubject = new BehaviorSubject<Funcionario[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public data: PaginationDTO = emptyPaginationDTO;

    constructor(private funcionarioService: FuncionarioService) {}

    connect(collectionViewer: CollectionViewer): Observable<Funcionario[]> {
        return this.funcionariosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.funcionariosSubject.complete();
        this.loadingSubject.complete();
    }

    async loadFuncionarios(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10): Promise<PaginationDTO> {

        this.loadingSubject.next(true);

        let filters: DataTableFilterMeta = {
            global: { value: '', matchMode: 'contains' },
            'nome': {value: filter, matchMode: 'startsWith'},
          };        
        
        let lazyParams: LazyTableParam = {
            first: pageIndex,
            rows: pageSize,
            sortField: null,
            sortOrder: (sortDirection === 'asc' ? 1 : 0),
            filters: filters
        };

        const resultado: PaginationDTO = await this.funcionarioService.findAllPaginated(lazyParams);
        
        this.funcionariosSubject.next(resultado.content);
        this.loadingSubject.next(false);

        return resultado;
    }    
}