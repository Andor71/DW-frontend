import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CommentDto } from "../models/comment.model";

@Injectable({
    providedIn: "root",
  })
  export class CommentService {
    constructor(private http: HttpClient) {}
  
    create(commentDto: CommentDto): Observable<CommentDto> {
      console.log(commentDto);
      
      return this.http.post<CommentDto>(
        `${environment.apiUrl}/comment/create`,
         commentDto 
      );
    }

    delete(commentID: number): Observable<any> {
        return this.http.delete<any>(
          `${environment.apiUrl}/comment/delete/`+commentID,

        );
    }

    getByDiplomas(diplomaID: number): Observable<Array<CommentDto>> {
    return this.http.get<Array<CommentDto>>(
        `${environment.apiUrl}/comment/get-by-diploma/`+diplomaID,
    );
    }
}