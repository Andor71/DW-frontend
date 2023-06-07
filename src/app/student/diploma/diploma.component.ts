import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, forkJoin, Subscription } from 'rxjs';
import { DiplomaStages } from 'src/core/enums/diploma.enums';
import { getDiplomaStage } from 'src/core/helpers/helperFunctions';
import { CommentDto } from 'src/core/models/comment.model';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { DiplomaFileDto } from 'src/core/models/diplomaFile.model';
import { PeriodDto } from 'src/core/models/Period.model';
import { UserDto } from 'src/core/models/user.model';
import { CommentService } from 'src/core/services/comment.service';
import { CookieService } from 'src/core/services/cookie.service';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { DocumentService } from 'src/core/services/document.service';
import { PeriodService } from 'src/core/services/period.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.scss'],
})
export class DiplomaComponent {
  //Helper Functions
  getDiplomaStage = getDiplomaStage;

  //Data
  public diploma: DiplomaDto = new DiplomaDto();
  public id: number;
  public currentUser: UserDto;

  public comments: Array<CommentDto> = new Array<CommentDto>();
  public commentDto: CommentDto = new CommentDto();
  public periodDto: PeriodDto = new PeriodDto();
  public formData: FormData = new FormData();
  public diplomaFile: DiplomaFileDto = new DiplomaFileDto();

  //Helper
  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();
  public tempApplied: Boolean;
  public isfileSelected: Boolean;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    public route: ActivatedRoute,
    private commetService: CommentService,
    private cookieService: CookieService,
    private periodService: PeriodService,
    private router: Router
  ) {
    this.currentUser = this.cookieService.getCurrentUser();
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadStudentData(student: UserDto) {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getDiplomaFile(this.id, student.id),
    ]).subscribe(
      ([diplomaFile]) => {
        this.diplomaFile = diplomaFile;
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
      this.diplomaService.getByIdForStudent(this.id),
      this.commetService.getByDiplomas(this.id),
      this.periodService.getCurrentPeriodForMajor(
        this.currentUser.majorDto.majorId
      ),
    ]).subscribe(
      ([diploma, comments, period]) => {
        this.diploma = diploma;
        this.tempApplied = this.diploma.applied;
        this.periodDto = period;

        this.comments = comments.sort((a, b) => {
          return <any>new Date(b.date) - <any>new Date(a.date);
        });

        if (this.diploma.student != null) {
          this.loadStudentData(this.diploma.student);
        }
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
          if (e === 'Csak 3 diplomára tudsz jelentkezni egyszerre!') {
            this.toastrService.toastrError(
              'Csak 3 diplomára tudsz jelentkezni egyszerre!'
            );
            this.router.navigate(['student/diplomas']);
          } else {
            this.toastrService.toastrError(
              'Hiba lépett fel jelentkezés közben!'
            );
          }
        },
      });
  }

  onFileChange(event): void {
    let zip = event.target.files;
    if (zip && zip[0]) {
      this.isfileSelected = true;
      this.formData.append('file', zip[0]);
      console.log(this.formData);
    }
  }
  upLoad() {
    if (!this.isfileSelected) {
      this.toastrService.toastrWarning(
        'Elöször válassz ki dokumentumot a feltöltéshez!'
      );
      return;
    }

    this.diplomaService
      .uploadeDiplomaFile(this.formData, this.id, this.currentUser.id)
      .pipe(first())
      .subscribe({
        next: (diplomaFileDto) => {
          this.diplomaFile = diplomaFileDto;

          this.toastrService.toastrSuccess(
            'Dokumentum sikeresen feltöltve!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel a dokumentum feltöltése közben!'
          );
        },
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
  deleteDiploma() {
    this.diplomaService
      .deleteDiplomaFile(this.diplomaFile.diplomaFilesId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.diplomaFile = null;
          this.toastrService.toastrSuccess(
            'Dokumentum sikeresen törölve!'
          );
        },
        error: (e) => {
          this.toastrService.toastrSuccess(
            'Hiba lépett fe la dokumentum törlése közben!'
          );
        },
      });
  }
}
