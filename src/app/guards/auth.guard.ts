import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private intendedUrl: string

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.intendedUrl = this.router.routerState.snapshot.url;
    //console.log('AuthGuard: ' + this.activatedRoute.snapshot)
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUserInfoFromBackend().pipe(
      map(user => {
        //console.log(user)
        if (user) {
          //console.log('Auth Autenticado')
          return true
        } else {
          //console.log('Auth No autenticado')
          return this.router.parseUrl('/login?intendedUrl=' + encodeURIComponent(state.url))
        }
      }),
      catchError((err, caught) => {
        //console.log(err)
        //console.log('Auth No autenticado (ERROR)')
        return of(this.router.parseUrl('/login?intendedUrl=' + encodeURIComponent(state.url)));
      }))
  }

}
