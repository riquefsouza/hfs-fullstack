export const emptyPaginationDTO: PaginationDTO = {
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
            sorted: false,
            unsorted: false,
            empty: false
        },
        offset: 0,
        unpaged: false,
        paged: false
    },
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: false,
    size: 0,
    number: 0,
    sort: {
        sorted: false,
        unsorted: false,
        empty: false
    },
    numberOfElements: 0,
    empty: false    
}

export interface PaginationDTO {
    content: any[],
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            sorted: boolean,
            unsorted: boolean,
            empty: boolean
        },
        offset: number,
        unpaged: boolean,
        paged: boolean
    },
    totalPages: number,
    totalElements: number,
    last: boolean,
    first: boolean,
    size: number,
    number: number,
    sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    },
    numberOfElements: number,
    empty: boolean    
}
