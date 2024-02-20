export const emptyMenuItemDTO: MenuItemDTO = {
    label: '',
    to: '',
    items: []
}

export interface MenuItemDTO {
    label: string;
    to?: string;
    items?: MenuItemDTO[];
}
