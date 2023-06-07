import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
import Swal from 'sweetalert2';
import { PeriodEnums } from 'src/core/enums/periode.enums';

@Component({
  selector: 'app-create-diploma',
  templateUrl: './create-diploma.component.html',
  styleUrls: ['./create-diploma.component.scss'],
})
export class CreatDiplomaComponent implements OnInit {
  //Form Variables
  public createTopicForm: UntypedFormGroup;
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public error: number = 0;

  //Data
  public newDiploma: DiplomaDto = new DiplomaDto();
  public activeStudents: Array<UserDto> = new Array<UserDto>();
  public selectedUserId: number;
  public selectedMajorIds: Array<number> = new Array<number>();
  public selectedTeacherIds: Array<number> = new Array<number>();
  public keywords = [];
  public customKeywords: Array<string> = new Array<string>();
  public keyword: string = '';
  public yearDto: YearDto = new YearDto();
  public periodDto: PeriodDto = new PeriodDto();
  public allPeriods: Array<PeriodDto> = new Array<PeriodDto>();
  public allTeachers: Array<UserDto> = new Array<UserDto>();
  public preconditionStartOfEntring: Boolean;
  public preconditionEndOFEntering: Boolean;
  public preconditionSecondAllocation: Boolean;

  //Helper
  public teachers: Array<{ id: number; name: string }> = new Array<{
    id: number;
    name: string;
  }>();
  public majors: Array<{ id: number; name: string }> = new Array<{
    id: number;
    name: string;
  }>();
  public newPDFs: any;
  public visibility = false;
  public isLoaded = false;
  public formData: FormData = new FormData();
  public loadDataSubscription: Subscription = new Subscription();
  public Editor = ClassicEditor;
  addCustomKeyWord = (term) => ({ id: term, keyword: term });

  constructor(
    private router: Router,
    private toastrService: CustomToastrService,
    private diplomaService: DiplomaService,
    private usersService: UsersService,
    private yearService: YearService,
    private periodService: PeriodService
  ) {}

  createMajors() {
    this.allPeriods.forEach((x) => {
      let tempMajor = {
        id: x.major.majorId,
        name: x.major.programme,
      };
      this.majors.push(tempMajor);
    });
  }

  createTeachers(teachers: Array<UserDto>) {
    teachers.forEach((x) => {
      let tempTeacher = {
        id: x.id,
        name: x.firstName + ' ' + x.lastName,
      };
      this.teachers.push(tempTeacher);
    });
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.usersService.getAllActive(),
      this.yearService.getCurrent(),
      this.periodService.getAllActive(),
      this.usersService.getAllTeachers(),
      this.usersService.checkPreconditions(
        PeriodEnums.START_OF_ENTERING_TOPICS
      ),
      this.usersService.checkPreconditions(
        PeriodEnums.END_OF_ENTERING_TOPICS
      ),
    ]).subscribe(
      ([
        activeStudents,
        yearDto,
        periodDtos,
        teachers,
        preconditionStartOfEntring,
        preconditionEndOFEntering,
      ]) => {
        this.preconditionStartOfEntring = preconditionStartOfEntring;
        this.preconditionEndOFEntering = preconditionEndOFEntering;
        this.activeStudents = activeStudents;

        this.activeStudents.map(
          (x) =>
            (x.infoName =
              x.firstName + ' ' + x.lastName + ' ' + x.email)
        );
        this.yearDto = yearDto;
        this.allPeriods = periodDtos;
        this.allTeachers = teachers;
        this.createMajors();
        this.createTeachers(teachers);
        this.preconditionsAlert();
        this.isLoaded = true;
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

  preconditionsAlert() {
    if (!this.preconditionStartOfEntring) {
      Swal.fire({
        title: 'Korai feltöltés',
        text: 'Még nincs minden szaknak meghatárzva a diploma időszak, lehetéses hogy pár szaknak nem lesz képes diplomát kiírni!',
        icon: 'warning',
        confirmButtonText: 'OK!',
      });
    }

    if (this.preconditionEndOFEntering) {
      Swal.fire({
        title: 'Lejárt a kiírási időszak',
        text: 'Lejárt a diploma kiírási időszak, lehetséges hogy már csak a második elosztásban lesz jelentkező!',
        icon: 'warning',
        confirmButtonText: 'OK!',
      });
    }
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
    if (
      this.selectedMajorIds === undefined ||
      this.selectedMajorIds.length === 0
    ) {
      this.error = 1;
      return;
    }
    if (this.newDiploma.title === undefined) {
      this.error = 2;
      return;
    }
    if (this.newDiploma.description === undefined) {
      this.error = 3;
      return;
    }
    if (this.newDiploma.details === undefined) {
      this.error = 4;
      return;
    }
    if (this.customKeywords.length < 3) {
      this.error = 5;
      return;
    }
    if (this.visibility && this.selectedUserId === undefined) {
      this.error = 6;
      return;
    }
    if (this.newDiploma.bibliography === undefined) {
      this.error = 7;
      return;
    }

    if (this.newDiploma.necessaryKnowledge === undefined) {
      this.error = 8;
      return;
    }

    if (this.newDiploma.differentExpectations === undefined) {
      this.error = 9;
      return;
    }
    if (this.newPDFs === undefined) {
      this.error = 10;
      return;
    }
    this.error = 0;
  }

  create() {
    this.submitted = true;

    // this.validate();

    if (this.error !== 0) {
      return;
    }

    if (this.newDiploma.visibility) {
      this.newDiploma.visibility = 1;
    } else {
      this.newDiploma.visibility = 0;
    }

    this.customKeywords.forEach((x) => {
      this.keyword += x + ',';
    });
    this.keyword = this.keyword.substring(0, this.keyword.length - 1);

    this.newDiploma.keywords = this.keyword;

    let periods = this.allPeriods.filter((x) =>
      this.selectedMajorIds.includes(x.major.majorId)
    );

    this.newDiploma.periods = periods;

    let teachers = this.allTeachers.filter((x) =>
      this.selectedTeacherIds.includes(x.id)
    );

    this.newDiploma.teachers = teachers;

    if (this.visibility) {
      this.newDiploma.student = this.activeStudents.filter(
        (x) => x.id == this.selectedUserId
      )[0];
    }

    this.formData.append(
      'DiplomaDto',
      new Blob([JSON.stringify(this.newDiploma)], {
        type: 'application/json',
      })
    );

    this.diplomaService
      .create(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['teacher/diplomas']);
          this.toastrService.toastrSuccess(
            'Diploma plan created succesfully!'
          );
        },
        error: (e) => {
          this.router.navigate(['teacher/diplomas']);
          this.toastrService.toastrError(
            'An error occoured while creating diploma plan!'
          );
        },
      });
  }
}
