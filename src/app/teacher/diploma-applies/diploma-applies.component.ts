import { Component, OnInit } from '@angular/core';
import { first, forkJoin, Subscription } from 'rxjs';
import { PeriodEnums } from 'src/core/enums/periode.enums';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { FinishedSDMappingDto } from 'src/core/models/finishedSDMapping.model';
import { UserDto } from 'src/core/models/user.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { CookieService } from 'src/core/services/cookie.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diploma-applies',
  templateUrl: './diploma-applies.component.html',
  styleUrls: ['./diploma-applies.component.scss'],
})
export class DiplomaAppliesComponent implements OnInit {
  //Data
  public diplomaApplies: Array<FinishedSDMappingDto> =
    new Array<FinishedSDMappingDto>();
  public FIRST_TOPIC_ADVERTISMENT_END: Boolean;
  public FIRST_ALLOCATION: Boolean;
  public SECOND_ALLOCATION: Boolean;
  public currentUser: UserDto;

  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  public allAccepted: boolean = true;
  public canSort: boolean = false;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private periodService: PeriodService,
    private userServices: UsersService,
    private cookieService: CookieService
  ) {
    this.currentUser = cookieService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllAppliedDiplomasForApproving(
        this.currentUser.department.departmentId
      ),
      this.userServices.checkPreconditions(
        PeriodEnums.FIRST_TOPIC_ADVERTISMENT_END
      ),
      this.userServices.checkPreconditions(
        PeriodEnums.FIRST_ALOCATION
      ),
      this.userServices.checkPreconditions(
        PeriodEnums.SECOND_ALLOCATION
      ),
    ]).subscribe(
      ([
        diplomaApplies,
        FIRST_TOPIC_ADVERTISMENT_END,
        FIRST_ALLOCATION,
        SECOND_ALLOCATION,
      ]) => {
        this.FIRST_TOPIC_ADVERTISMENT_END =
          FIRST_TOPIC_ADVERTISMENT_END;
        this.FIRST_ALLOCATION = FIRST_ALLOCATION;
        this.SECOND_ALLOCATION = SECOND_ALLOCATION;

        this.diplomaApplies = diplomaApplies;
        this.diplomaApplies.forEach((x) => {
          if (!x.accepted) {
            this.allAccepted = false;
          }
        });

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }

  enableStudentDiploma(finishedSDMapping: FinishedSDMappingDto) {
    this.diplomaService
      .enableStudentDiploma(
        finishedSDMapping.diploma.diplomaId,
        finishedSDMapping.student.id
      )
      .pipe(first())
      .subscribe({
        next: () => {
          if (finishedSDMapping.accepted) {
            finishedSDMapping.accepted = false;
            this.toastrService.toastrSuccess('Diploma nem indulhat!');
          } else {
            this.toastrService.toastrSuccess('Diploma indulhat!');
            finishedSDMapping.accepted = true;
          }
        },
        error: () => {
          if (finishedSDMapping.accepted) {
            this.toastrService.toastrError(
              'Hiba lépett fel az elutasít közben!'
            );
          } else {
            this.toastrService.toastrError(
              'Hiba lépett fel az elfogadás közben!'
            );
          }
        },
      });
  }
  enableAllStudentDiploma() {
    this.diplomaService
      .enableAllStudentDiploma(this.allAccepted)
      .pipe(first())
      .subscribe({
        next: (diplomaApplies) => {
          this.allAccepted = !this.allAccepted;
          this.diplomaApplies = diplomaApplies;

          this.toastrService.toastrSuccess(
            'Sikeresen változtattad a diplomák státuszát!'
          );
        },
        error: () => {
          this.toastrService.toastrError(
            'Hiba lépett fel a diplomák státusza változtasása közben!'
          );
        },
      });
  }
  finalizeApplies() {
    Swal.fire({
      title: 'Biztos vagy benne?',
      text: 'A véglegesítés után már nem leszel képes változtani a jelentkezéseken!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Igen, véglegesítem!',
    }).then((result) => {
      if (result.isConfirmed)
        this.diplomaService
          .finalizeApplies()
          .pipe(first())
          .subscribe({
            next: () => {
              this.toastrService.toastrSuccess(
                'Sikeresen véglegesítetted a diploma jelentkezéseket!'
              );
            },
            error: () => {
              this.toastrService.toastrError(
                'Hiba lépett fel a diploma jelentkezések véglegesítése közben!'
              );
            },
          });
    });
  }
}
