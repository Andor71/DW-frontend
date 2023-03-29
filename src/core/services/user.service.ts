import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDto } from '../models/user.model';

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
    return this.http.get<Array<UserDto>>(`${environment.apiUrl}/user/get-all`);
  }
}
