import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";

@Injectable({
  providedIn: "root",
})
export class DefaultInterceptor implements HttpInterceptor {
  countRequests: number;

  constructor(public loaderService: LoaderService) {
    this.countRequests = 0;
  }

  timer: number | undefined;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (this.timer) {
      window.clearTimeout(this.timer);
    }

    this.countRequests++;

    this.timer = window.setTimeout(() => this.loaderService.isLoading.next(true), 500);

    return next.handle(authReq).pipe(
      finalize(() => {
        
        this.countRequests--;

        if (this.countRequests == 0) {

          this.loaderService.isLoading.next(false);

          if (this.timer) {
            window.clearTimeout(this.timer);
          }

        }
      })
    );
  }
}
