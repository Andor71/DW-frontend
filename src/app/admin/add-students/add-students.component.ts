import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';

@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.scss'],
})
export class AddStudentsComponent implements OnInit {
  //Form Variables
  public createStudentForm: UntypedFormGroup;
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public error = '';

  //Data
  public students: Array<UserDto> = new Array<UserDto>();
  public period: PeriodDto = new PeriodDto();

  //Helper
  public periodID: number;
  public isLoading = true;
  public numberOfFiles: number;
  public activeIds: number;
  public isfilesSelected: Boolean = false;
  public formData: FormData = new FormData();
  public loadDataSubscription: Subscription = new Subscription();

  constructor(
    private toastrService: CustomToastrService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private periodService: PeriodService
  ) {
    this.periodID = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.userService.getAllStudents(this.periodID),
      this.periodService.getById(this.periodID),
    ]).subscribe(
      ([students, period]) => {
        this.students = students;
        this.period = period;

        this.initForm();
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }

  onFileChange(event): void {
    let file = event.target.files;
    if (file) {
      this.formData.append('file', file);
      this.isfilesSelected = true;
    }
  }

  upload() {
    if (!this.isfilesSelected) {
      this.toastrService.toastrWarning(
        'Elöször válassz ki CSV a feltöltéshez!'
      );
      return;
    }
    this.userService
      .uploadStudents(this.formData, this.periodID)
      .subscribe({
        next: (students) => {
          this.students = students;
          this.toastrService.toastrSuccess(
            'Tanulók feltöltve sikeresen!'
          );
        },
        error: (err) => {
          this.toastrService.toastrError(err);
        },
      });
  }
  get f() {
    return this.createStudentForm.controls;
  }
  initForm() {
    this.createStudentForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      media: ['', [Validators.required]],
    });
    this.submitted = false;
    this.loading = false;
  }

  deleteStudent(id: number) {}
  updateStudent() {}
  filterUpdate(event) {
    // const val = event.target.value.toLowerCase();
    // const temp = this.diplomasConst.filter((d) => {
    //   return d.keywords.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    // this.diplomas = temp;
  }
}
