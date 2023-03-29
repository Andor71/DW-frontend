import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { Subject } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { CustomToastrService } from "src/core/services/CustomToastrService.service";
import { AuthenticationService } from "src/core/services/authentication.service";
import { CookieService } from "src/core/services/cookie.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  //  Public
  public loginForm: UntypedFormGroup;
  public fieldTextType!: boolean;
  public loading = false;
  public submitted = false;
  public error = "";
  public passwordTextType: boolean;
  public returnUrl!: string;
  public year: number = new Date().getFullYear();

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _authentificationService: AuthenticationService,
    private cookieService: CookieService,
    private toastrService: CustomToastrService
  ) {
    if (this._authentificationService.currentUser) {
      this._router.navigate(["/"]);
    }
    this._unsubscribeAll = new Subject();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["s@s.com", [Validators.required, Validators.email]],
      password: ["123", Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this._authentificationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (response: HttpResponse<any>) => {
          let user = response.body;
          user.token = response.headers.get("Authorization");
          this._authentificationService.setUser(user);
          this.cookieService.setCookie("currentUser", JSON.stringify(user), 7);
          setTimeout(() => {
            if (user.role == "teacher" || user.role == "departmenthead") {
              this._router.navigate(["./teacher/diplomas"]);
            }
            if (user.role == "admin") {
              this._router.navigate(["./admin/periods"]);
            }
            if (user.role == "student") {
              this._router.navigate(["./student/diplomas"]);
            }
          }, 300);
        },
        (error: HttpErrorResponse) => {
          this.toastrService.toastrError("" + error);
          this.loading = false;
        }
      );
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }
}
