import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { PeriodDto } from 'src/core/models/Period.model';
import { PeriodService } from 'src/core/services/period.service';
import { first, forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MajorService } from 'src/core/services/major.service';
import { MajorDto } from 'src/core/models/major.model';
import { YearService } from 'src/core/services/year.service';
import { YearDto } from 'src/core/models/year.model';

@Component({
  selector: 'app-create-period',
  templateUrl: './create-period.component.html',
  styleUrls: ['./create-period.component.scss'],
})
export class CreatePeriodComponent implements OnInit {
  //Form Variables
  public createPeriodForm: UntypedFormGroup;
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public error = '';

  //Data
  public majors: Array<MajorDto> = new Array();
  public yearID: number;
  public yearDto: YearDto = new YearDto();

  //Helper
  public periodDto = new PeriodDto();
  public fields;
  public isLoading: boolean = true;
  public formLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private toastrService: CustomToastrService,
    private periodService: PeriodService,
    private majorService: MajorService,
    private yearService: YearService
  ) {
    this.yearID = this.route.snapshot.params.id;
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.loadDataSubscription = forkJoin([
      this.majorService.getAllMajorWithoutPeriods(),
      this.yearService.getById(this.yearID),
    ]).subscribe(
      ([majors, yearDto]) => {
        this.majors = majors;
        this.yearDto = yearDto;
        this.initForm();
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'Hiba lépett fel az adatok betöltése közben!'
        );
      }
    );
  }

  validetDates() {
    let keys = Object.keys(this.periodDto);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i + 1] != null) {
        if (this.periodDto[keys[i]] > this.periodDto[keys[i + 1]]) {
          this.createPeriodForm.get(keys[i]).setValue('');
          this.createPeriodForm.get(keys[i + 1]).setValue('');
          this.toastrService.toastrError('Wrong Dates!');
          return false;
        }
      }
    }
    return true;
  }

  get f() {
    return this.createPeriodForm.controls;
  }

  create() {
    this.submitted = true;

    if (this.createPeriodForm.invalid) {
      return;
    }

    if (!this.validetDates()) {
      return;
    }
    this.periodDto.major = this.majors.filter(
      (x) => x.majorId == this.f.major.value
    )[0];
    this.periodDto.year = this.yearDto;
    console.log(this.periodDto);

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
    this.createPeriodForm = this._formBuilder.group({
      major: [{}, Validators.required],
      startOfEnteringTopics: ['', Validators.required],
      endOfEnteringTopics: ['', Validators.required],
      firstTopicAdvertisement: ['', Validators.required],
      firstTopicAdvertisementEnd: ['', Validators.required],
      firstAllocation: ['', Validators.required],
      secondTopicAdvertisement: ['', Validators.required],
      secondTopicAdvertisementEnd: ['', Validators.required],
      secondAllocation: ['', Validators.required],
      implementationOfTopics: ['', Validators.required],
      documentumUpload: ['', Validators.required],
      diplomaDefend: ['', Validators.required],
    });
    this.submitted = false;
    this.loading = false;
  }
}
