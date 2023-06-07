import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    let currentUser = JSON.parse(
      this.cookieService.getCookie('currentUser')
    );
    if (currentUser === null || currentUser === '') {
      this.authService.logout();
    }
    if (currentUser.role !== 'admin') {
      this.authService.logout();
    }
    return true;
  }
}
