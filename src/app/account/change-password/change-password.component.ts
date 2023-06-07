import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, first } from 'rxjs';
import { PasswordDto } from 'src/core/models/user.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { AuthenticationService } from 'src/core/services/authentication.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { UsersService } from 'src/core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  public loginForm: UntypedFormGroup;
  public fieldTextType!: boolean;
  public loading = false;
  public submitted = false;
  public error = '';
  public passwordTextType: boolean;
  public returnUrl!: string;
  public year: number = new Date().getFullYear();
  public activationCode: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _authentificationService: AuthenticationService,
    private toastrService: CustomToastrService,
    private userService: UsersService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.activationCode = params.get('validation_code');
    });

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      password1: ['', [Validators.required]],
      password2: ['', Validators.required],
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

    if (this.f.password1.value != this.f.password2.value) {
      this.toastrService.toastrError('Két jelszó nem egyezik!');

      return;
    }
    let password: string = this.f.password1.value;
    const regexNumber: RegExp = /\d/;
    const regexCapital: RegExp = /[A-Z]/;

    if (
      !password.match(regexNumber) ||
      !password.match(regexCapital) ||
      password.length < 7
    ) {
      this.toastrService.toastrError(
        'Jelszó kell tartalmazzon nagy betűt, számot és minimum 8 karaktert!'
      );
    }
    let passwordDto = new PasswordDto();
    passwordDto.password = password;
    passwordDto.validationCode = this.activationCode;

    this.userService
      .changePassword(passwordDto)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            'Sikeresen megváltoztattad a jelszavad!'
          );
          this._router.navigate(['/']);
        },
        error: () => {
          this.toastrService.toastrError(
            'Hiba történt a jelszó cserélése közben!'
          );
          this._router.navigate(['/']);
        },
      });
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
