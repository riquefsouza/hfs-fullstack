export const emptyErrorResponseDTO: ErrorResponseDTO = {
    timestamp: '',
    status: -1,
    error: '',
    trace: '',
    message: '',
    path: ''
}

export interface ErrorResponseDTO {
    timestamp?: string;
    status?: number;
    error?: string;
    trace?: string;
    message?: string;
    path?: string;
}
