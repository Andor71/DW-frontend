import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DiplomaDto, ScoreDto } from '../models/diploma.model';
import { UserDto } from '../models/user.model';
import { FinishedSDMappingDto } from '../models/finishedSDMapping.model';
import { DocumentDto } from '../models/document.model';
import { DiplomaFileDto } from '../models/diplomaFile.model';

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
  getFinished(id: number): Observable<DiplomaDto> {
    return this.http.get<DiplomaDto>(
      `${environment.apiUrl}/diploma/get-finished/` + id
    );
  }

  getAllVisibleForGivenMajor(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all-visible-diplomas-for-given-major`
    );
  }

  assignStudentToDiploma(userID: number, diplomaID: number) {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/${diplomaID}/assign-to-diploma/${userID}`,
      {},
      { observe: 'response' }
    );
  }
  getAllAppliedDiplomasForApproving(
    id: number
  ): Observable<Array<FinishedSDMappingDto>> {
    return this.http.get<Array<FinishedSDMappingDto>>(
      `${environment.apiUrl}/diploma/get-all-applied-diplomas-for-approving/` +
        id
    );
  }
  getAllAppliedDiplomasForStudent(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all-applied-diplomas-for-student`
    );
  }
  getByIdForStudent(id: number): Observable<DiplomaDto> {
    return this.http.get<DiplomaDto>(
      `${environment.apiUrl}/diploma/get-by-id-for-student/` + id
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

  enableAllStudentDiploma(allAccepted: boolean) {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/enable-all-student-diploma/` +
        allAccepted,
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
  sortStudentsForDiploma(): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/diploma/sort-students-for-diploma`,
      {}
    );
  }
  getCurrentDiploma(): Observable<DiplomaDto> {
    return this.http.get<DiplomaDto>(
      `${environment.apiUrl}/diploma/get-current-diploma`
    );
  }

  uploadeDiplomaFile(
    file: FormData,
    diplomaID: number,
    userID: number
  ): Observable<DiplomaFileDto> {
    const headers = new HttpHeaders().set('Content-Type', []);
    return this.http.post<DiplomaFileDto>(
      `${environment.apiUrl}/diploma-file/${diplomaID}/upload/${userID}`,
      file,
      { headers }
    );
  }

  downloadDiploma(diplomaID: number, userID: number) {
    return this.http.get(
      `${environment.apiUrl}/diploma-file/${diplomaID}/download-diploma-file/${userID}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  deleteDiplomaFile(diplomaFileID: number) {
    return this.http.delete(
      `${environment.apiUrl}/diploma-file/delete` + diplomaFileID
    );
  }
  getDiplomaFile(
    diplomaID: number,
    userID: number
  ): Observable<DiplomaFileDto> {
    return this.http.get<DiplomaFileDto>(
      `${environment.apiUrl}/diploma-file/${diplomaID}/get-diploma-file/${userID}`
    );
  }

  getFinishesd(): Observable<Array<DiplomaDto>> {
    return this.http.get<Array<DiplomaDto>>(
      `${environment.apiUrl}/diploma/get-all-finished`
    );
  }

  finalizeApplies(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/finalize-applies`,
      {}
    );
  }

  finalizeDiploma(scoreDto: ScoreDto): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/diploma/set-score`,
      scoreDto
    );
  }
}
