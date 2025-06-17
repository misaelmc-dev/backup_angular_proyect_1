import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TestingAuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //const token = '2|bFl9Pq5SEqfi9Ch1nA3Grpa6pEqij11DlmOi5Bsk'; //Administrador
    //const token = '3|5j1z02wNE1kwa8AAD02XbqfUf9YVBULxcLkr6tHu'; //Administrador
    const token = '4|YcwUR84y3x79K9v7CuJAsYqw63pAVJeK6RaUoXAW'; //Administrador
    //const token = '3|BXdzppyyHNtb95XjohqYiddS4oMxrz8KeggXU7Sh'; //Entidad

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request);

  }
}
