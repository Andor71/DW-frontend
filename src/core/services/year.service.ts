import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { YearDto } from '../models/year.model';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  constructor(private http: HttpClient) {}

  getCurrent(): Observable<YearDto> {
    return this.http.get<YearDto>(
      `${environment.apiUrl}/year/get-current`
    );
  }
  create(): Observable<YearDto> {
    return this.http.post<YearDto>(
      `${environment.apiUrl}/year/create`,
      {}
    );
  }
  getById(id: number): Observable<YearDto> {
    return this.http.get<YearDto>(`${environment.apiUrl}/year/` + id);
  }
}
