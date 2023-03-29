import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { CookieService } from "../services/cookie.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    let currentUser = JSON.parse(this.cookieService.getCookie("currentUser"));
    if (currentUser.role !== "admin" && currentUser.role !== "manager") {
      this.router.navigate(["access/login"]);
    }
    return true;
  }
}
