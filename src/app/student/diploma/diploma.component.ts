import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class DiplomaComponent {
  //Data
  public diploma: DiplomaDto = new DiplomaDto();
  public id: number;
  public currentUser: UserDto;

  public comments: Array<CommentDto> = new Array<CommentDto>();
  public commentDto: CommentDto = new CommentDto();

  //Helper
  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();
  public tempApplied: Boolean;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    public route: ActivatedRoute,
    private commetService: CommentService,
    private cookieService: CookieService
  ) {
    this.currentUser = this.cookieService.getCurrentUser();
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getByIdForStudent(this.id),
      this.commetService.getByDiplomas(this.id),
    ]).subscribe(
      ([diploma, comments]) => {
        this.diploma = diploma;
        this.tempApplied = this.diploma.applied;

        this.comments = comments.sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
        this.isLoading = false;
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

    this.commentDto.diploma = this.diploma;
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
  assigneToDiploma(diplomaID: number) {
    this.diplomaService
      .assignStudentToDiploma(this.currentUser.id, this.id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            'Sikeresen jelentkezett a diplomára!'
          );
        },
        error: (e) => {
          this.toastrService.toastrSuccess(
            'Hiba lépett fel jelentkezés közben!'
          );
        },
      });
  }
}
