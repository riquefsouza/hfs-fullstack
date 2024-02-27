import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar) { }
    
    private log(message: string) {
        this.snackBar.open(message, 'HttpErrorInterceptor', { duration: 5000 });
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {

                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                  console.log('this is client side error');
                  errorMsg = `Error: ${error.error.message}`;
                }
                else {
                  console.log('this is server side error');
                  errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                }
                console.log(errorMsg);
                this.log(errorMsg);
                return throwError(() => new Error(errorMsg));

                /*
                if (error.status === 0) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('Um erro ocorreu:', error.message);
                    
                    this.log(`Um erro ocorreu: ${error.message}`);
              
                  } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong.
                    console.error(`Backend codigo de retorno ${error.status}, body foi: ${error.error}, message: ${error.message}`);
              
                    this.log(`Backend codigo de retorno ${error.status}, body foi: ${error.error}, message: ${error.message}`);
                  }
                  // Return an observable with a user-facing error message.
                  return throwError(() => new Error('Algo ruím aconteceu; por favor, tente novamente mais tarde.'));
              

                
                if (error.error instanceof Error) {
                    // Ocorreu um erro no lado do cliente ou na rede. Lide com isso de acordo.
                    console.error('Um erro ocorreu:', error.error.message);

                    this.log(`Um erro ocorreu: ${error.error.message}`);
                } else {
                    // O back-end retornou um código de resposta malsucedido.
                    // O corpo da resposta pode conter pistas sobre o que deu errado,                    
                    console.error(`Código retornado do back-end ${error.status}, body foi: ${error.error}`);

                    this.log(`Código retornado do back-end ${error.status}, body foi: ${error.error}`);
                }

                // Se você quiser retornar uma nova resposta:
                //return of(new HttpResponse({body: [{nome: "novo valor..."}]}));

                // Se quiser retornar o erro no nível superior:
                //return throwError(error);
                */

                // ou simplesmente não retorne nada:
                //return EMPTY;
            })
        );
    }
}