import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
//Logout
import { Router } from '@angular/router';
// Language
import { CookieService } from 'ngx-cookie-service';
import { CartModel } from './topbar.model';
import { EventService } from 'src/core/services/event.service';
import { UserDto } from 'src/core/models/user.model';
import { AuthenticationService } from 'src/core/services/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: UserDto;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public _cookiesService: CookieService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.element = document.documentElement;
    let user = this._cookiesService.get('currentUser');

    if (user !== null && user !== undefined && user !== '') {
      this.userData = JSON.parse(user);
    } else {
      this.userData = null;
    }

    this.changeMode('light');
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document
      .querySelector('.hamburger-icon')
      ?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute(
          'data-layout-mode',
          'light'
        );
        break;
      case 'dark':
        document.documentElement.setAttribute(
          'data-layout-mode',
          'dark'
        );
        break;
      default:
        document.documentElement.setAttribute(
          'data-layout-mode',
          'light'
        );
        break;
    }
  }
  logout() {
    this.authService.logout();
  }

  windowScroll() {
    // Top Btn Set
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (
        document.getElementById('back-to-top') as HTMLElement
      ).style.display = 'block';
      document
        .getElementById('page-topbar')
        ?.classList.add('topbar-shadow');
    } else {
      (
        document.getElementById('back-to-top') as HTMLElement
      ).style.display = 'none';
      document
        .getElementById('page-topbar')
        ?.classList.remove('topbar-shadow');
    }
  }
}
