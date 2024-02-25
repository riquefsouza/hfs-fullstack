import { DataTableFilterMeta, SortOrder } from "primereact/datatable";

export interface LazyTableState {
    first: number;
    rows: number;
    page: number;
    sortField?: string;
    sortOrder?: SortOrder;
    filters: DataTableFilterMeta;
}