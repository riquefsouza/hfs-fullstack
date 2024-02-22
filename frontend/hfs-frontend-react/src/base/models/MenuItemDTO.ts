export const emptyMenuItemDTO: MenuItemDTO = {
    label: '',
    routerLink: '',
    to: '',
    items: []
}

export interface MenuItemDTO {
    label: string;
    routerLink?: string;
    to?: string;
    items?: MenuItemDTO[];
}
