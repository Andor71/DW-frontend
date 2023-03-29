import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PeriodDto } from 'src/core/models/Period.model';
import { PeriodService } from 'src/core/services/period.service';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
})
export class PeriodComponent implements OnInit {
  //Form Variables
  public updatePeriodForm: UntypedFormGroup;
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public error = '';

  //Data
  public periodDto: PeriodDto = new PeriodDto();

  //Helper
  public id: number;
  public isLoading: boolean = true;
  public datePipe = new DatePipe('en-US');

  constructor(
    private periodService: PeriodService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: UntypedFormBuilder,
    private toastrService: CustomToastrService
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getById();
  }

  getById() {
    this.periodService
      .getbyMajorID(this.id)
      .pipe(first())
      .subscribe({
        next: (periodDto) => {
          this.periodDto = periodDto;
          for (const field in this.periodDto) {
            if (field !== 'periodId') {
              if (field !== 'major') {
                periodDto[field] = new Date(periodDto[field]);
              }
            }
          }

          this.initForm();
          this.isLoading = false;
        },
        error: (e) => {
          this.toastrService.toastrError(
            'An error occurred while loading period!'
          );
          this.isLoading = false;
        },
      });
  }

  validetDates() {
    let keys = Object.keys(this.periodDto);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i + 1] != null) {
        if (this.periodDto[keys[i]] > this.periodDto[keys[i + 1]]) {
          this.updatePeriodForm.get(keys[i]).setValue('');
          this.updatePeriodForm.get(keys[i + 1]).setValue('');
          this.toastrService.toastrError('Wrong Dates!');
          return false;
        }
      }
    }
    return true;
  }

  get f() {
    return this.updatePeriodForm.controls;
  }

  create() {
    this.submitted = true;

    if (this.updatePeriodForm.invalid) {
      return;
    }

    if (!this.validetDates()) {
      return;
    }

    this.loading = true;
    this.periodService
      .create(this.periodDto)
      .pipe(first())
      .subscribe({
        next: (periodDto) => {
          this.router.navigate(['admin/periods']);
          this.toastrService.toastrSuccess(
            'Period has been created succesfully!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError('Error creating a period!');
          console.log(e);
        },
      });
  }

  initForm() {
    this.updatePeriodForm = this._formBuilder.group({
      major: [this.periodDto.major.programme, Validators.required],
      startOfEnteringTopics: [
        new Date(this.periodDto.startOfEnteringTopics),
        Validators.required,
      ],
      endOfEnteringTopics: [
        new Date(this.periodDto.endOfEnteringTopics),
        Validators.required,
      ],
      firstTopicAdvertisement: [
        this.periodDto.firstTopicAdvertisement,
        Validators.required,
      ],
      firstTopicAdvertisementEnd: [
        this.periodDto.firstTopicAdvertisementEnd,
        Validators.required,
      ],
      firstAllocation: [this.periodDto.firstAllocation, Validators.required],
      secondTopicAdvertisement: [
        this.periodDto.secondTopicAdvertisement,
        Validators.required,
      ],
      secondTopicAdvertisementEnd: [
        this.periodDto.secondTopicAdvertisementEnd,
        Validators.required,
      ],
      secondAllocation: [this.periodDto.secondAllocation, Validators.required],
      implementationOfTopics: [
        this.periodDto.implementationOfTopics,
        Validators.required,
      ],
      documentumUpload: [this.periodDto.documentumUpload, Validators.required],
      diplomaDefend: [this.periodDto.diplomaDefend, Validators.required],
    });
    console.log(
      this.datePipe.transform(
        this.periodDto.startOfEnteringTopics,
        'yyyy.MM.dd'
      )
    );
    console.log(new Date(this.periodDto.startOfEnteringTopics));

    this.updatePeriodForm.get('major').disable();
    this.submitted = false;
    this.loading = false;
  }
}
