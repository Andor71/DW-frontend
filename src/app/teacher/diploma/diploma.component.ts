import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { first, forkJoin, Subscription } from 'rxjs';
import { getDiplomaStage } from 'src/core/helpers/helperFunctions';
import { CommentDto } from 'src/core/models/comment.model';
import { DiplomaDto, ScoreDto } from 'src/core/models/diploma.model';
import { DiplomaFileDto } from 'src/core/models/diplomaFile.model';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { CommentService } from 'src/core/services/comment.service';
import { CookieService } from 'src/core/services/cookie.service';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { PeriodService } from 'src/core/services/period.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.scss'],
})
export class DiplomaComponent implements OnInit {
  //Herlper Functions
  getDiplomaStage = getDiplomaStage;

  //Data
  public diploma: DiplomaDto = new DiplomaDto();
  public id: number;

  public comments: Array<CommentDto> = new Array<CommentDto>();
  public commentDto: CommentDto = new CommentDto();
  public appliedStudents: Array<UserDto> = new Array<UserDto>();
  public currentUser: UserDto;
  public periodDto: PeriodDto;
  public finalScore: number = 0;

  public diplomaFile: DiplomaFileDto;
  //Helper
  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();
  public error: boolean = false;
  public submited: boolean = false;

  DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {};

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private commetService: CommentService,
    private periodService: PeriodService,
    private cookieService: CookieService,
    public route: ActivatedRoute,
    private _router: Router
  ) {
    this.id = this.route.snapshot.params.id;
    this.currentUser = this.cookieService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadStudentData(student: UserDto) {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getDiplomaFile(this.id, student.id),
      this.periodService.getCurrentPeriodForMajor(
        student.majorDto.majorId
      ),
    ]).subscribe(
      ([diplomaFile, periodDto]) => {
        this.diplomaFile = diplomaFile;
        this.periodDto = periodDto;
      },
      (error) => {
        this.toastrService.toastrError(
          'Hiba lépett fel az adatok betöltésénél!'
        );
      }
    );
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getById(this.id),
      this.commetService.getByDiplomas(this.id),
      this.diplomaService.getAllStudentsApplied(this.id),
    ]).subscribe(
      ([myDiploma, comments, appliedStudents]) => {
        this.diploma = myDiploma;
        console.log(this.diploma);

        this.comments = comments.sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });

        this.appliedStudents = appliedStudents.sort((a, b) => {
          return a.media > b.media ? 1 : -1;
        });

        if (this.diploma.student != null) {
          this.loadStudentData(this.diploma.student);
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'Hiba lépett fel az adatok betöltésénél!'
        );
      }
    );
  }

  deleteComment(commentID) {
    Swal.fire({
      title: 'Biztos vagy benne?',
      text: 'Ezt a müveletet nem lehet visszaállítani!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Igen, töröld!',
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
  downloadFile() {
    this.diplomaService
      .downloadDiploma(this.id, this.currentUser.id)
      .subscribe((response) => {
        let blob: Blob = response.body;
        let a = document.createElement('a');
        a.download = this.diplomaFile.title;
        a.href = window.URL.createObjectURL(blob);
        a.click();
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
  setScore() {
    if (this.finalScore == 0) {
      this.toastrService.toastrWarning('Adj meg egy pontszámot!');
      return;
    }
    let score = new ScoreDto();

    score.id = this.id;
    score.score = this.finalScore;

    this.diplomaService
      .finalizeDiploma(score)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            'Sikeresen lezártad a diplomát!'
          );
          this._router.navigate(['./teacher/diplomas']);
        },
        error: () => {
          this.toastrService.toastrSuccess(
            'Hiba lépett fel a diploma lezárása közben!'
          );
        },
      });
  }
}
