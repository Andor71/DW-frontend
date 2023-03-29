import { Component, OnInit } from '@angular/core';
import { layerGroup } from 'leaflet';
import { first, forkJoin, Subscription } from 'rxjs';
import { DocumentResponseDto } from 'src/core/models/document.model';
import { AllMajorDto } from 'src/core/models/major.model';
import {
  PeriodDto,
  PeriodsByYear,
} from 'src/core/models/Period.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DocumentService } from 'src/core/services/document.service';
import { MajorService } from 'src/core/services/major.service';
import { PeriodService } from 'src/core/services/period.service';
import { YearService } from 'src/core/services/year.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-period',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent implements OnInit {
  //Data
  public periodsByYear: Array<PeriodsByYear> = Array();
  public documents: Array<DocumentResponseDto> =
    new Array<DocumentResponseDto>();

  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  public wannaCreateYear: boolean = true;
  public thisYear: number;
  public secondYear: number;
  public canCreatePeriod = true;
  public formData: FormData = new FormData();
  public numberOfFiles: number;
  public activeIds: number;

  constructor(
    private periodService: PeriodService,
    private documentService: DocumentService,
    private toastrService: CustomToastrService,
    private yearService: YearService
  ) {
    this.thisYear = new Date().getFullYear();
    this.secondYear = new Date().getFullYear() + 1;
    this.activeIds = this.thisYear;
  }

  ngOnInit(): void {
    this.loadData();
  }

  canCreatePeriodFun() {
    this.periodsByYear.forEach((x) => {
      if (x.year.firstYear >= new Date().getFullYear()) {
        this.canCreatePeriod = false;
      }
    });
  }

  deleteDocument(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (id) => {
              this.documents.forEach((x) => {
                x.documents = x.documents.filter(
                  (y) => y.documentId != id
                );
              });
              this.toastrService.toastrSuccess(
                'Document deleted successfully!'
              );
            },
            error: (e) => {
              this.toastrService.toastrError(
                'An error occurred while deleting the Docuument!'
              );
            },
          });
      }
    });
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.periodService.getAllPeriodsByYear(),
      this.documentService.getAll(),
    ]).subscribe(
      ([periodsByYear, documents]) => {
        this.periodsByYear = periodsByYear;
        this.documents = documents;
        this.canCreatePeriodFun();
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }
  deletePeriod(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.periodService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (id) => {
              // this.majors.forEach((x) => {
              //   x.majors = x.majors.filter((y) => y.majorId != id);
              // });
              this.toastrService.toastrSuccess(
                'Period deleted successfully!'
              );
            },
            error: (e) => {
              this.toastrService.toastrError(
                'An error occurred while deleting the Period!'
              );
            },
          });
      }
    });
  }

  createYearsSwitch() {
    if (this.wannaCreateYear) {
      this.createYear();
    }
    this.wannaCreateYear = !this.wannaCreateYear;
  }

  createYear() {
    this.yearService
      .create()
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            'Év sikeresen létrehozva!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Hiba lépett fel az év létrehozása közben!'
          );
        },
      });
  }
  onFileChange(event): void {
    let newPDFs = event.target.files;
    if (newPDFs && newPDFs[0]) {
      this.numberOfFiles = newPDFs.length;
      for (let i = 0; i < this.numberOfFiles; i++) {
        this.formData.append('files', newPDFs[i]);
      }
    }
  }

  upLoad(yearID: number) {
    this.documentService
      .upLoadFile(this.formData, yearID)
      .pipe(first())
      .subscribe({
        next: (documentDto) => {
          this.documents.forEach((x) => {
            if (x.yearDto.id == yearID) {
              documentDto.forEach((y) => {
                x.documents.push(y);
              });
            }
          });
          this.toastrService.toastrSuccess(
            'File has been uploaded successfully!'
          );
        },
        error: (e) => {
          this.toastrService.toastrError(
            'Error with uploading a file!'
          );
        },
      });
  }
}
