import { Injectable } from '@angular/core';

@Injectable()
export class HTTPResponseError extends Error {

    constructor(response: Response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`);
        //this.response = response;
    }
    
}