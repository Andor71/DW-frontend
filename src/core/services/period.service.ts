import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PeriodDto, PeriodsByYear } from '../models/Period.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  constructor(private http: HttpClient) {}

  create(periodDto: PeriodDto): Observable<PeriodDto> {
    return this.http.post<PeriodDto>(
      `${environment.apiUrl}/period/create`,
      periodDto
    );
  }

  update(periodDto: PeriodDto): Observable<PeriodDto> {
    return this.http.patch<PeriodDto>(
      `${environment.apiUrl}/period/update`,
      periodDto
    );
  }
  getAllActive(): Observable<Array<PeriodDto>> {
    return this.http.get<Array<PeriodDto>>(
      `${environment.apiUrl}/period/get-all`
    );
  }
  delete(id: number): Observable<number> {
    return this.http.delete<number>(
      `${environment.apiUrl}/period/delete/` + id
    );
  }
  getById(id: number): Observable<PeriodDto> {
    return this.http.get<PeriodDto>(
      `${environment.apiUrl}/period/` + id
    );
  }
  getbyMajorID(id: number): Observable<PeriodDto> {
    return this.http.get<PeriodDto>(
      `${environment.apiUrl}/period/get-by-major-id/` + id
    );
  }
  getAllPeriodsByYear(): Observable<Array<PeriodsByYear>> {
    return this.http.get<Array<PeriodsByYear>>(
      `${environment.apiUrl}/period/get-all-period-by-year`
    );
  }
  getCurrentPeriodForMajor(majorID: number): Observable<PeriodDto> {
    return this.http.get<PeriodDto>(
      `${environment.apiUrl}/period/get-current-period-for-major/${majorID}`
    );
  }
}
