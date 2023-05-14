import { Component, OnInit } from '@angular/core';
import { first, forkJoin, Subscription } from 'rxjs';
import { PeriodEnums } from 'src/core/enums/periode.enums';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { FinishedSDMappingDto } from 'src/core/models/finishedSDMapping.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
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
  public FIRST_ALOCATION: Boolean;
  public SECOND_ALLOCATION: Boolean;

  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  public allAccepted: boolean = true;
  public canSort: boolean = false;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private periodService: PeriodService,
    private userServices: UsersService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllAppliedDiplomasForApproving(),
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
        FIRST_ALOCATION,

        SECOND_ALLOCATION,
      ]) => {
        this.FIRST_TOPIC_ADVERTISMENT_END =
          FIRST_TOPIC_ADVERTISMENT_END;
        this.FIRST_ALOCATION = FIRST_ALOCATION;
        this.SECOND_ALLOCATION = SECOND_ALLOCATION;

        this.diplomaApplies = diplomaApplies;
        this.diplomaApplies.forEach((x) => {
          if (!x.accepted) {
            this.allAccepted = false;
          }
        });

        console.log(this.FIRST_ALOCATION);

        this.preconditionsAlert();
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }
  preconditionsAlert() {
    if (!this.FIRST_ALOCATION) {
      Swal.fire({
        title: 'Még nem fejeződött be a jelentkezési időszak',
        icon: 'warning',
        confirmButtonText: 'OK!',
      });
    }
  }

  sortStudentsForDiploma() {
    this.diplomaService
      .sortStudentsForDiploma()
      .pipe(first())
      .subscribe({
        next: () => {
          this.diplomaService
            .getAllAppliedDiplomasForApproving()
            .pipe(first())
            .subscribe({
              next: (appliedDiplomas) => {
                this.diplomaApplies = appliedDiplomas;
              },
              error: (e) => {
                this.toastrService.toastrError(
                  'Hiba lépett fel a diákok elosztása közben!'
                );
              },
            });
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a diákok elosztása közben!'
          );
        },
      });
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
}
