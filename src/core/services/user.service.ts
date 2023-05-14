import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDto } from '../models/user.model';
import { PeriodEnums } from '../enums/periode.enums';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/user/` + id);
  }
  getAllActive(): Observable<Array<UserDto>> {
    return this.http.get<Array<UserDto>>(
      `${environment.apiUrl}/user/get-all-active`
    );
  }
  getAll(): Observable<Array<UserDto>> {
    return this.http.get<Array<UserDto>>(
      `${environment.apiUrl}/user/get-all`
    );
  }
  getAllTeachers(): Observable<Array<UserDto>> {
    return this.http.get<Array<UserDto>>(
      `${environment.apiUrl}/user/get-all-teachers`
    );
  }
  getAllStudents(periodID: number): Observable<Array<UserDto>> {
    return this.http.get<Array<UserDto>>(
      `${environment.apiUrl}/user/get-all-students-for-period/${periodID}`
    );
  }
  uploadStudents(
    formData: FormData,
    periodID: number
  ): Observable<Array<UserDto>> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<Array<UserDto>>(
      `${environment.apiUrl}/user/upload-students/${periodID}`,
      formData,
      { headers }
    );
  }
  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/user/delete/` + id
    );
  }
  createStudent(user: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${environment.apiUrl}/user/create-student`,
      user
    );
  }
  checkPreconditions(enums: PeriodEnums): Observable<Boolean> {
    return this.http.get<Boolean>(
      `${
        environment.apiUrl
      }/user/check-preconditions/${enums.toString()}`
    );
  }
}
