import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // envia o erro para a infraestrutura de log remoto
      //console.error(error);

      // melhor trabalho de transformação de erros para consumo do usuário
      this.log(`${operation} falhou: ${error.message}`);

      // Deixe o aplicativo continuar em execução retornando um resultado vazio.
      return of(result as T);
    };
  }

  public log(message: string) {
    this.snackBar.open('message', '[ErrorService]', { duration: 3000 });
  }
/*
  public handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Ocorreu um erro no lado do cliente ou na rede. Lide com isso de acordo.
      console.error('Um erro ocorreu:', error.error.message);
    } else {
      // O back-end retornou um código de resposta malsucedido.
       // O corpo da resposta pode conter pistas sobre o que deu errado.
      console.error(`Backend codigo de retorno ${error.status}, body foi: ${error.error}`);
    }
    // Retorna um observável com uma mensagem de erro voltada ao usuário.
    return throwError(() => new Error('Algo ruím aconteceu; por favor, tente novamente mais tarde.'));
  }
*/
  public handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.      
      console.error('Um erro ocorreu:', error.message);
      
      this.log(`Um erro ocorreu: ${error.message}, ERROR: ${error.error}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend codigo de retorno ${error.status}, body foi: ${error.error}, message: ${error.message}`);

      //this.log(`Backend codigo de retorno ${error.status}, body foi: ${error.error}, message: ${error.message}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Algo ruím aconteceu; por favor, tente novamente mais tarde.'));
  }
}
