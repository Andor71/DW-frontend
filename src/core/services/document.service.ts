import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DocumentDto,
  DocumentResponseDto,
} from '../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient) {}

  upLoadFile(
    files: FormData,
    yearID: number
  ): Observable<Array<DocumentDto>> {
    const headers = new HttpHeaders().set('Content-Type', []);
    return this.http.post<Array<DocumentDto>>(
      `${environment.apiUrl}/document/uploadMultipleFiles/` + yearID,
      files,
      { headers }
    );
  }
  downloadFile(documentID: number) {
    return this.http.get(
      `${environment.apiUrl}/document/downloadFile/` + documentID,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getAll(): Observable<Array<DocumentResponseDto>> {
    return this.http.get<Array<DocumentResponseDto>>(
      `${environment.apiUrl}/document/get-all`
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/document/delete/` + id
    );
  }
}
