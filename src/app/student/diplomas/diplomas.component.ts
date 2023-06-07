import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { first, forkJoin, Subscription } from 'rxjs';
import { Options } from 'sortablejs';
import { PeriodEnums } from 'src/core/enums/periode.enums';
import { UserStatus } from 'src/core/enums/user.enums';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { AuthenticationService } from 'src/core/services/authentication.service';
import { CookieService } from 'src/core/services/cookie.service';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diplomas',
  templateUrl: './diplomas.component.html',
  styleUrls: ['./diplomas.component.scss'],
})
export class DiplomasComponent {
  //Data
  public diplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  public diplomasConst: Array<DiplomaDto> = new Array<DiplomaDto>();
  public appliedDiplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  public currentUser: UserDto;
  public FIRST_TOPIC_ADVERTISMENT_END: Boolean;
  public FIRST_ALLOCATION: Boolean;
  public SECOND_ALLOCATION: Boolean;
  public SECOND_TOPIC_ADVERTISMENT_END: Boolean;
  public period: PeriodDto = new PeriodDto();
  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  p: number = 1;

  public options: Options = {
    onEnd: (event: any) => {
      this.sendPriorityChanges();
    },
    scrollSensitivity: 10,
  };

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private cookieService: CookieService,
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private periodService: PeriodService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.currentUser = this.cookieService.getCurrentUser();
    if (this.currentUser.status !== UserStatus.SEARCHING) {
      this.authenticationService.logout();
    }
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllVisibleForGivenMajor(),
      this.diplomaService.getAllAppliedDiplomasForStudent(),
      this.periodService.getCurrentPeriodForMajor(
        this.currentUser.majorDto.majorId
      ),
      this.userService.checkPreconditions(
        PeriodEnums.FIRST_TOPIC_ADVERTISMENT_END
      ),
      this.userService.checkPreconditions(
        PeriodEnums.SECOND_TOPIC_ADVERTISMENT_END
      ),
      this.userService.checkPreconditions(
        PeriodEnums.SECOND_ALLOCATION
      ),
    ]).subscribe(
      ([
        diplomas,
        appliedDiplomas,
        period,
        FIRST_TOPIC_ADVERTISMENT_END,
        SECOND_TOPIC_ADVERTISMENT_END,
        SECOND_ALLOCATION,
      ]) => {
        this.FIRST_TOPIC_ADVERTISMENT_END =
          FIRST_TOPIC_ADVERTISMENT_END;
        this.SECOND_TOPIC_ADVERTISMENT_END =
          SECOND_TOPIC_ADVERTISMENT_END;
        this.SECOND_ALLOCATION = SECOND_ALLOCATION;
        if (
          this.SECOND_ALLOCATION &&
          this.currentUser.status === UserStatus.SEARCHING
        ) {
          this.authenticationService.logout();
          this.toastrService.toastrError(
            'Lejártak a diploma leosztási időszakok, keresd fel a titkárságot!'
          );
          return;
        }
        this.period = period;
        this.diplomas = diplomas;
        this.diplomasConst = diplomas;
        this.appliedDiplomas = appliedDiplomas;
        this.preconditionsAlert();
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'Hiba lépett fel az adatok betöltése közben !'
        );
        this.isLoading = false;
      }
    );
  }

  preconditionsAlert() {
    if (!this.FIRST_TOPIC_ADVERTISMENT_END) {
      Swal.fire({
        title:
          'Még nem fejeződött be a diploma feltöltési időszak, a diploma lista még változhat!',
        icon: 'warning',
        confirmButtonText: 'OK!',
      });
    }
    if (
      !this.FIRST_TOPIC_ADVERTISMENT_END &&
      !this.FIRST_TOPIC_ADVERTISMENT_END
    ) {
      Swal.fire({
        title:
          'Még nem fejeződött be a diploma feltöltési időszak, a diploma lista még változhat!',
        icon: 'warning',
        confirmButtonText: 'OK!',
      });
    }
  }
  sendPriorityChanges() {
    this.diplomaService
      .changeAppliedPriority(
        this.currentUser.id,
        this.appliedDiplomas
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            'Sikeresen változtattad a jelentkezett diplomák prioritását!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(e);
        },
      });
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.diplomasConst.filter((d) => {
      return d.keywords.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.diplomas = temp;
  }

  datePassed(date: Date) {
    return date < new Date();
  }
}
