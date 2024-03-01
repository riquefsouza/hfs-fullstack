import { DataTableFilterMeta } from 'primevue/datatable';

export interface LazyTableParam {
    first: number;
    rows: number;
    sortField: string | null;
    sortOrder: number | null;
    filters: DataTableFilterMeta;
}

export const emptyLazyTableParam: LazyTableParam = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    filters: {}
}

