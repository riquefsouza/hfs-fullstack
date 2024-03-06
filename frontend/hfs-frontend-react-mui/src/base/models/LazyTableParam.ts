export interface DataTableFilterMetaData {
    value: any;
    matchMode: 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter' | string | undefined;
}

export interface DataTableFilterMeta {
    [key: string]: string | DataTableFilterMetaData;
}

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

