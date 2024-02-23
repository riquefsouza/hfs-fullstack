interface DataTableFilterMetaData {
    value: any;
    matchMode: 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter' | 'custom' | undefined;
}

interface DataTableFilterMeta {
    [key: string]: DataTableFilterMetaData;
}

export interface LazyTableParam {
    first: number;
    rows: number;
    sortField?: string;
    sortOrder?: number;
    filters: DataTableFilterMeta;
}

export const emptyLazyTableParam: LazyTableParam = {
    first: 0,
    rows: 10,
    sortField: undefined,
    sortOrder: undefined,
    filters: {}
}

