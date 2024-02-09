export const emptyMenuItemDTO: MenuItemDTO = {
    label: '',
    routerLink: '',
    items: []
}

export interface MenuItemDTO {
    label: string;
    routerLink?: string;
    items?: MenuItemDTO[];
}
