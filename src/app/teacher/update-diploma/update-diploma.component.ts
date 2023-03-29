import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, forkJoin, Subscription } from 'rxjs';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { YearDto } from 'src/core/models/year.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';
import { YearService } from 'src/core/services/year.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-update-diploma',
  templateUrl: './update-diploma.component.html',
  styleUrls: ['./update-diploma.component.scss'],
})
export class UpdateDiplomaComponent implements OnInit {
  //Form Variables
  public submitted = false;
  public error: number = 0;

  //Data
  public id: number;
  public diploma: DiplomaDto = new DiplomaDto();
  public activeStudents: Array<UserDto> = new Array<UserDto>();
  public selectedUserId: number;
  public selectedMajorId: number;
  public keywords = [];
  public customKeywords: Array<string> = new Array<string>();
  public keyword: string = '';
  public yearDto: YearDto = new YearDto();
  public periodDto: PeriodDto = new PeriodDto();
  public allPeriods: Array<PeriodDto> = new Array<PeriodDto>();
  public stages = ['Terv', 'Folyamatban', 'Elkészítve'];
  public selectedStage;

  //Helper
  public newPDFs: any;
  public visibility = false;
  public isLoading = true;
  public formData: FormData = new FormData();
  public loadDataSubscription: Subscription = new Subscription();
  public Editor = ClassicEditor;
  addCustomKeyWord = (term) => ({ id: term, keyword: term });

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private toastrService: CustomToastrService,
    private diplomaService: DiplomaService,
    private usersService: UsersService,
    private yearService: YearService,
    private periodService: PeriodService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params.id;
  }
  initFields() {
    this.selectedMajorId = this.diploma.period.major.majorId;
    this.diploma.keywords.split(',').forEach((x) => {
      this.keywords.push(this.addCustomKeyWord(x));
      this.customKeywords.push(x);
    });
    if (this.diploma.student !== null) {
      this.selectedUserId = this.diploma.student.id;
    }
  }
  loadData() {
    this.loadDataSubscription = forkJoin([
      this.usersService.getAllActive(),
      this.yearService.getCurrent(),
      this.periodService.getAllActive(),
      this.diplomaService.getById(this.id),
    ]).subscribe(
      ([activeStudents, yearDto, periodDtos, diploma]) => {
        this.activeStudents = activeStudents;
        this.activeStudents.map(
          (x) =>
            (x.infoName =
              x.firstName + ' ' + x.lastName + ' ' + x.email)
        );

        this.yearDto = yearDto;
        this.allPeriods = periodDtos;
        this.diploma = diploma;

        this.initFields();

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  onFileChange(event): void {
    this.newPDFs = event.target.files;
    if (this.newPDFs && this.newPDFs[0]) {
      this.formData.append('file', this.newPDFs[0]);
    }
  }

  changeVisisbility() {
    this.visibility = !this.visibility;
  }

  validate() {
    if (this.selectedMajorId === undefined) {
      this.error = 1;
      return;
    }
    if (this.diploma.title === undefined) {
      this.error = 2;
      return;
    }
    if (this.diploma.description === undefined) {
      this.error = 3;
      return;
    }
    if (this.customKeywords.length < 3) {
      this.error = 4;
      return;
    }
    if (this.visibility && this.selectedUserId === undefined) {
      this.error = 5;
      return;
    }
    this.error = 0;
  }

  create() {
    this.submitted = true;

    this.validate();

    if (this.error !== 0) {
      return;
    }

    if (this.visibility) {
      this.diploma.visibility = 1;
    } else {
      this.diploma.visibility = 0;
    }

    this.customKeywords.forEach((x) => {
      this.keyword += x + ',';
    });
    this.keyword = this.keyword.substring(0, this.keyword.length - 1);

    this.diploma.keywords = this.keyword;
    let period = this.allPeriods.filter(
      (x) => x.major.majorId == this.selectedMajorId
    )[0];
    this.diploma.period = period;

    if (this.visibility) {
      this.diploma.student = this.activeStudents.filter(
        (x) => x.id == this.selectedUserId
      )[0];
      this.diploma.taken = true;
    }

    this.formData.append(
      'DiplomaDto',
      new Blob([JSON.stringify(this.diploma)], {
        type: 'application/json',
      })
    );

    this.diplomaService
      .update(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['teacher/diploma/' + this.id]);
          this.toastrService.toastrSuccess(
            'Diploma plan created succesfully!'
          );
        },
        error: (e) => {
          this.router.navigate(['teacher/diploma/' + this.id]);
          this.toastrService.toastrError(
            'An error occoured while creating diploma plan!'
          );
        },
      });
  }
}
