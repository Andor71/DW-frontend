import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AllMajorDto, MajorDto } from '../models/major.model';

@Injectable({
  providedIn: 'root',
})
export class MajorService {
  constructor(private http: HttpClient) {}

  getAllMajorWithoutPeriods(yearID: number) {
    return this.http.get<Array<MajorDto>>(
      `${environment.apiUrl}/major/get-all-without-period/` + yearID
    );
  }
  getAll() {
    return this.http.get<Array<MajorDto>>(
      `${environment.apiUrl}/major/get-all`
    );
  }

  create(thisYear: number, secondYear: number) {
    return this.http.post<Array<MajorDto>>(
      `${environment.apiUrl}/major/create?` +
        'thisYear=' +
        thisYear +
        '&secondYear=' +
        secondYear,
      {}
    );
  }
}
