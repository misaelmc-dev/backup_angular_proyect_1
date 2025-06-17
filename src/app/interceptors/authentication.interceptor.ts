import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {from, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {catchError} from "rxjs/operators";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService, public cookieService: CookieService, private router: Router) {}

  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler)
  {
    // convert promise to observable using 'from' operator
    return from(this.handle(req, next))
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {

    if (req.url.includes('sanctum/csrf-cookie'))
      return next.handle(req).toPromise()

    /*//todos los endpoints de autenticación deben primero pedir una csrf-cookie
    if (req.url.includes('/api/login') || req.url.includes('/api/logout') || req.url.includes('/api/register') ||
        req.url.includes('/api/forgot_password') || req.url.includes('/api/user/password') )
    {

    }*/

    if (!this.cookieService.check('XSRF-TOKEN'))
      await this.authService.getCsrfCookie().toPromise();

    let authReq: HttpRequest<any>
    if (this.cookieService.check('XSRF-TOKEN')) {
      authReq = req.clone({
        withCredentials: true,
       // responseType: 'text',
        headers: req.headers.set('X-XSRF-TOKEN', this.cookieService.get('XSRF-TOKEN'))
      })
    } else {
      authReq = req.clone({
        withCredentials: true,
        //responseType: 'text'
      })
    }

    return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 419) { //si no se está autenticado
        //se elimina la cookie de XSRF-COOKIE para evitar conflictos con otros backend
        this.cookieService.delete('XSRF-COOKIE', undefined, undefined, true);
        this.authService.getCsrfCookie().subscribe(next => {});
        let intendedUrl = this.router.routerState.snapshot.url.split('?')[0];
        if (!authReq.url.includes('/login') && !intendedUrl.includes('/login')) {
          let intendedUrl = this.router.routerState.snapshot.url.split('?')[0];
          //console.log(intendedUrl)
          this.authService.logout()
          this.router.navigate(['/login'], {queryParams: {intendedUrl: intendedUrl}});
          //this.router.navigate(['/login']);
        }
      }
      if (err.status === 403)
        this.router.navigate(['/unauthorized'])
      return throwError(err);
    })).toPromise()
  }

}
