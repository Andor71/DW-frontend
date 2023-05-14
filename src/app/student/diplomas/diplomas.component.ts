import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { first, forkJoin, Subscription } from 'rxjs';
import { Options } from 'sortablejs';
import { PeriodEnums } from 'src/core/enums/periode.enums';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { UserDto } from 'src/core/models/user.model';
import { CookieService } from 'src/core/services/cookie.service';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
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
  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();

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
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.currentUser = this.cookieService.getCurrentUser();
    console.log(this.currentUser);

    if (this.currentUser.status !== 'searching') {
      this.diplomaService
        .getCurrentDiploma()
        .pipe(first())
        .subscribe({
          next: (diplomaDto) => {
            this._router.navigate([
              './student/diploma/' + diplomaDto.diplomaId,
            ]);
          },
          error: (e) => {
            this.toastrService.toastrError(e);
          },
        });
    }
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllVisibleForGivenMajor(),
      this.diplomaService.getAllAppliedDiplomasForStudent(),
      this.userService.checkPreconditions(
        PeriodEnums.FIRST_TOPIC_ADVERTISMENT_END
      ),
    ]).subscribe(
      ([diplomas, appliedDiplomas, FIRST_TOPIC_ADVERTISMENT_END]) => {
        this.FIRST_TOPIC_ADVERTISMENT_END =
          FIRST_TOPIC_ADVERTISMENT_END;
        this.diplomas = diplomas;
        this.diplomasConst = diplomas;
        this.appliedDiplomas = appliedDiplomas;

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
          'Még nem fejeződött be a diploma feltöltési időszak, a diploma lista még vátozhat!',
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
    // update the rows
    this.diplomas = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
