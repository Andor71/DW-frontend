import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first, forkJoin } from 'rxjs';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';
import Swal from 'sweetalert2';

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
  public studentCost: Array<UserDto> = new Array<UserDto>();
  public period: PeriodDto = new PeriodDto();
  public newStudent: UserDto = new UserDto();

  //Helper
  public periodID: number;
  public isLoading = true;
  public numberOfFiles: number;
  public activeIds: number;
  public isfilesSelected: Boolean = false;
  public formData: FormData = new FormData();
  public loadDataSubscription: Subscription = new Subscription();
  public wannaUpdate: boolean = false;
  public isLoadingCustom: boolean = false;

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
        this.studentCost = students;
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
    if (file || !this.isfilesSelected) {
      this.formData.append('file', file[0]);
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
    this.isLoadingCustom = true;
    this.userService
      .uploadStudents(this.formData, this.periodID)
      .subscribe({
        next: (students) => {
          students.forEach((x) => {
            this.students.push(x);
          });
          this.toastrService.toastrSuccess(
            'Tanulók feltöltve sikeresen!'
          );
          this.isLoadingCustom = false;
        },
        error: (err) => {
          this.toastrService.toastrError(err);
          this.isLoadingCustom = false;
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

  deleteStudent(id: number) {
    Swal.fire({
      title: 'Biztos vagy benne?',
      text: 'Ezt a müveletet nem lehet visszaforditani!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Igen, töröld!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService
          .deleteStudent(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.students = this.students.filter((x) => x.id != id);
              this.toastrService.toastrSuccess(
                'Hallgató sikeresen törölve!'
              );
            },
            error: (e) => {
              this.toastrService.toastrError(
                'Hiba lépett fel a hallagató törlése közben!'
              );
            },
          });
      }
    });
  }
  updateStudent() {
    this.submitted = true;

    if (this.createStudentForm.invalid) {
      return;
    }

    this.userService
      .updateStudent(this.newStudent)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.students = this.students.map((x) => {
            if (x.id == user.id) {
              x = user;
            }
            return x;
          });
          this.toastrService.toastrSuccess(
            'Hallgató sikeresen létrehozva'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a hallgató létrehozása közben!'
          );
        },
      });
  }

  selectStudent(id: number) {
    this.newStudent = this.students.filter((x) => x.id == id)[0];

    this.wannaUpdate = true;
  }

  cancelUpdate() {
    this.wannaUpdate = false;
  }

  createStudent() {
    this.submitted = true;

    if (this.createStudentForm.invalid) {
      return;
    }

    this.newStudent.majorDto = this.period.major;
    this.userService
      .createStudent(this.newStudent)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.students.push(user);
          this.toastrService.toastrSuccess(
            'Hallgató sikeresen létrehozva'
          );
          this.initForm();
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a hallgató létrehozása közben!'
          );
          this.initForm();
        },
      });
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.studentCost.filter((d) => {
      return (
        d.firstName.toLowerCase().indexOf(val) !== -1 ||
        d.lastName.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.students = temp;
  }

  // filterUpdate(event) {
  //   const val = event.target.value.toLowerCase();
  //   const temp = this.diplomasConst.filter((d) => {
  //     return d.keywords.toLowerCase().indexOf(val) !== -1 || !val;
  //   });
  //   this.diplomas = temp;
  // }
}
