export const emptySnackbarMessage: SnackbarMessage = {
    open: false, 
    message: '', 
    timeout: 3000
}

export interface SnackbarMessage {
    open: boolean;
    message: string;
    timeout: number;
}