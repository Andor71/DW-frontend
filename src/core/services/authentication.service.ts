import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { CookieService } from "./cookie.service";
import { environment } from "src/environments/environment";
import { UserDto } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<UserDto>;

  //private
  private currentUserSubject: BehaviorSubject<UserDto>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDto>(
      JSON.parse(_cookieService.getCookie("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): UserDto {
    if (!this.currentUserSubject) {
      this.currentUserSubject = new BehaviorSubject<UserDto>(
        JSON.parse(this._cookieService.getCookie("currentUser"))
      );
    }
    return this.currentUserSubject.value;
  }

  public setUser(newUserData) {
    if (newUserData) {
      this._cookieService.setCookie(
        "currentUser",
        JSON.stringify(newUserData),
        1
      );
    }
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http.post<any>(
      environment.apiUrl + "/user/login",
      {
        email,
        password,
      },
      { observe: "response" }
    );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    this._cookieService.deleteCookie("currentUser");
    this.currentUserSubject.next(null);
    window.location.href = "/";
  }

  forgotPassword(email: string) {
    return this._http.post<any>(
      environment.apiUrl + "/user/recover-password?email=" + email,
      email
    );
  }

  recoverPassword(password: string, recoveryCode: string) {
    return this._http.post<any>(
      environment.apiUrl +
        "/user/reset-password?recoveryCode=" +
        recoveryCode +
        "&password=" +
        password,
      password
    );
  }
}
