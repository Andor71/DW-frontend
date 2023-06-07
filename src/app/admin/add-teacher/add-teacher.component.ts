import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first, forkJoin } from 'rxjs';
import { PeriodDto } from 'src/core/models/Period.model';
import { DepartmentDto } from 'src/core/models/department.model';
import { MajorDto } from 'src/core/models/major.model';
import { UserDto } from 'src/core/models/user.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DepartmentService } from 'src/core/services/department.service';
import { MajorService } from 'src/core/services/major.service';
import { PeriodService } from 'src/core/services/period.service';
import { UsersService } from 'src/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
})
export class AddTeacherComponent {
  //Form Variables
  public createTeacherForm: UntypedFormGroup;
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public error = '';

  //Data
  public teachers: Array<UserDto> = new Array<UserDto>();
  public teachersCost: Array<UserDto> = new Array<UserDto>();
  public period: PeriodDto = new PeriodDto();
  public newTeacher: UserDto = new UserDto();
  public majors: Array<MajorDto> = new Array<MajorDto>();
  public departments: Array<DepartmentDto> =
    new Array<DepartmentDto>();
  public selectedDepartmentID: number;

  //Helper
  public isLoading = true;
  public wannaUpdate: boolean = false;
  public loadDataSubscription: Subscription = new Subscription();
  public isdepartmentHead: boolean = false;

  constructor(
    private toastrService: CustomToastrService,
    private userService: UsersService,
    private majorService: MajorService,
    private departmentService: DepartmentService,
    private _formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.userService.getAllTeachers(),
      this.majorService.getAll(),
      this.departmentService.getAll(),
    ]).subscribe(
      ([teachers, majors, departments]) => {
        this.teachers = teachers;
        this.majors = majors;
        this.departments = departments;
        this.teachersCost = teachers;
        this.initForm();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }
  get f() {
    return this.createTeacherForm.controls;
  }

  initForm() {
    this.createTeacherForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      department: [''],
    });
    this.submitted = false;
    this.loading = false;
  }

  selectChange(role) {
    if (role === 'departmenthead') {
      this.isdepartmentHead = true;
    } else {
      this.isdepartmentHead = false;
    }
  }

  deleteTeacher(id: number) {
    Swal.fire({
      title: 'Biztos vagy benne?',
      text: 'Ezt a müveletet nem lehet visszaforditani!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Igen, töröld!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService
          .deleteTeacher(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.teachers = this.teachers.filter((x) => x.id != id);
              this.toastrService.toastrSuccess(
                'Tanár sikeresen törölve!'
              );
            },
            error: (e) => {
              this.toastrService.toastrError(
                'Hiba lépett fel a tanár törlése közben!'
              );
            },
          });
      }
    });
  }
  updateTeacher() {
    this.submitted = true;

    if (this.createTeacherForm.invalid) {
      return;
    }
    let department = this.departments.filter(
      (x) => x.departmentId == this.selectedDepartmentID
    )[0];

    this.newTeacher.department = department;

    this.isdepartmentHead = false;
    this.userService
      .updateTeacher(this.newTeacher)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.teachers = this.teachers.map((x) => {
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
  selectTeacher(id: number) {
    this.newTeacher = this.teachers.filter((x) => x.id == id)[0];
    this.wannaUpdate = true;
  }
  cancelUpdate() {
    this.wannaUpdate = false;
  }

  createTeacher() {
    this.submitted = true;

    if (this.createTeacherForm.invalid) {
      return;
    }

    let department = this.departments.filter(
      (x) => x.departmentId == this.selectedDepartmentID
    )[0];

    this.newTeacher.department = department;

    this.isdepartmentHead = false;

    this.userService
      .createTeacher(this.newTeacher)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.teachers.push(user);
          this.toastrService.toastrSuccess(
            'Tanár sikeresen létrehozva'
          );
          this.initForm();
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a tanár létrehozása közben!'
          );
          this.initForm();
        },
      });
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.teachersCost.filter((d) => {
      return (
        d.firstName.toLowerCase().indexOf(val) !== -1 ||
        d.lastName.toLowerCase().indexOf(val) ||
        !val
      );
    });
    this.teachers = temp;
  }
}
