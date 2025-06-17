import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUserInfoFromBackend().pipe(
      map(response => {
        if (response) {
          //console.log('NonAuth Autenticado')
          return this.router.parseUrl('/')
        } else {
          //console.log('NonAuth No Autenticado')
          return true
        }
      }),
      catchError(() => {
        //console.log('NonAuth No Autenticado')
        return of(true)
      }))
  }

}
