import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DiplomaDto } from '../models/diploma.model';
import { UserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DiplomaService {
  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<DiplomaDto> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<DiplomaDto>(
      `${environment.apiUrl}/diploma/create`,
      formData,
      { headers }
    );
  }

  update(formData: FormData): Observable<DiplomaDto> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    return this.http.patch<DiplomaDto>(
      `${environment.apiUrl}/diploma/update`,
      formData
    );
  }
  getAll(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all`
    );
  }
  getMyDiplomas(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-my-diplomas`
    );
  }
  delete(id: number): Observable<Array<DiplomaDto>> {
    return this.http.delete<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/delete/` + id
    );
  }
  getById(id: number): Observable<DiplomaDto> {
    return this.http.get<DiplomaDto>(
      `${environment.apiUrl}/diploma/` + id
    );
  }

  getAllVisible(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all-visible-diplomas`
    );
  }

  assignStudentToDiploma(userID: number, diplomaID: number) {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/${diplomaID}/assign-to-diploma/${userID}`,
      {}
    );
  }
  getAllAppliedDiplomas(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all-applied-diplomas`
    );
  }
  getByIdForStudent(id: number): Observable<DiplomaDto> {
    return this.http.get<DiplomaDto>(
      `${environment.apiUrl}/diploma/getbyIDForStudent/` + id
    );
  }
  changeAppliedPriority(
    id: number,
    diplomaDtos: Array<DiplomaDto>
  ): Observable<DiplomaDto> {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/change-applied-priority/` + id,
      diplomaDtos
    );
  }
  enableStudentDiploma(diplomaID: number, studentID: number) {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/${diplomaID}/enable-student-diploma/${studentID}`,
      {}
    );
  }

  enableAllStudentDiploma() {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/enable-all-student-diploma`,
      {}
    );
  }

  getAllStudentsApplied(
    diplomaID: number
  ): Observable<Array<UserDto>> {
    return this.http.get<any>(
      `${environment.apiUrl}/diploma/${diplomaID}/get-all-students-applied`,
      {}
    );
  }
}
