import { ROLE, ROLE_MAPPER } from './role';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CredentialResponse } from '../models/auth/credentialresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  
  constructor(private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {      
      return this.authService.isLoggedIn.pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          if(!isLoggedIn) {
            this.redirectToLogin();
            return false;
          }
          const loggedUser: CredentialResponse = this.authService.LoggedUser;
          if(loggedUser != null && loggedUser.authenticated) {
            for (let role in ROLE) {
              let checkAuthRole: boolean;
              loggedUser.authorities.forEach(el => checkAuthRole = el.authority == role);
              //if(AuthService.checkSection(state.url, BASE_URLS_FOR_ROLES[role])) {
              if(checkAuthRole) {
                let access = AuthService.checkAuthUser(loggedUser, ROLE_MAPPER[role]);
                if(!access && checkAuthRole) {
                  this.redirectToLogin();
                }
                return access;
              }
            }
          }
          return false;
        })
      );
  }

  private redirectToLogin() {
    this.router.navigate(['login']);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  
}

