import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { first, forkJoin, Subscription } from 'rxjs';
import { CommentDto } from 'src/core/models/comment.model';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { UserDto } from 'src/core/models/user.model';
import { CommentService } from 'src/core/services/comment.service';
import { CookieService } from 'src/core/services/cookie.service';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.scss'],
})
export class DiplomaComponent implements OnInit {
  //Data
  public myDiploma: DiplomaDto = new DiplomaDto();
  public id: number;

  public comments: Array<CommentDto> = new Array<CommentDto>();
  public commentDto: CommentDto = new CommentDto();

  public appliedStudents: Array<UserDto> = new Array<UserDto>();

  public currentUser: UserDto;
  //Helper
  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();
  public error: boolean = false;
  public submited: boolean = false;

  DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private commetService: CommentService,
    private cookieService: CookieService,
    public route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params.id;
    this.currentUser = this.cookieService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getById(this.id),
      this.commetService.getByDiplomas(this.id),
      this.diplomaService.getAllStudentsApplied(this.id),
    ]).subscribe(
      ([myDiploma, comments, appliedStudents]) => {
        this.myDiploma = myDiploma;

        this.comments = comments.sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });

        this.appliedStudents = appliedStudents.sort((a, b) => {
          return a.media > b.media ? 1 : -1;
        });

        console.log(this.appliedStudents);

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }

  deleteComment(commentID) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commetService
          .delete(commentID)
          .pipe(first())
          .subscribe({
            next: () => {
              this.comments = this.comments.filter(
                (x) => x.commentId != commentID
              );

              this.comments = this.comments.sort((a, b) => {
                return <any>new Date(b.date) - <any>new Date(a.date);
              });
              this.toastrService.toastrSuccess(
                'Komment sikeresen törölve!'
              );
            },
            error: () => {
              this.toastrService.toastrError(
                'Hiba lépett fel a komment törlése közben!'
              );
            },
          });
      }
    });
  }

  //Section Comments
  sendComment() {
    if (
      this.commentDto.message === null ||
      this.commentDto.message === ''
    ) {
      this.toastrService.toastrError('Komment nem lehet üres!');
      return;
    }

    this.commentDto.diploma = this.myDiploma;
    this.commentDto.user = this.currentUser;

    this.commetService
      .create(this.commentDto)
      .pipe(first())
      .subscribe({
        next: (commentDto) => {
          this.comments.push(commentDto);

          this.comments = this.comments.sort((a, b) => {
            return <any>new Date(b.date) - <any>new Date(a.date);
          });
          this.toastrService.toastrSuccess(
            'Komment sikeresen elküldve!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a komment elküldése közben!'
          );
        },
      });
  }
}
