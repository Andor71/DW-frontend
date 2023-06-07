import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first, forkJoin } from 'rxjs';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { DiplomaFileDto } from 'src/core/models/diplomaFile.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';
import { PeriodService } from 'src/core/services/period.service';

@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.scss'],
})
export class DiplomaComponent implements OnInit {
  //Data
  public diploma: DiplomaDto = new DiplomaDto();
  public diplomaFile: DiplomaFileDto = new DiplomaFileDto();
  public id: number;
  //Helper

  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private periodService: PeriodService,
    public route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadDiplomaFile() {
    this.diplomaService
      .getDiplomaFile(this.diploma.student.id, this.id)
      .pipe(first())
      .subscribe({
        next: (diplomaFile) => {
          this.diplomaFile = diplomaFile;
          this.isLoading = false;
        },
        error: (e) => {
          this.isLoading = false;
          this.toastrService.toastrError(
            'An error occurred while loading the content'
          );
        },
      });
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getFinished(this.id),
    ]).subscribe(
      ([diploma]) => {
        this.diploma = diploma;
        this.loadDiplomaFile();
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
        this.isLoading = false;
      }
    );
  }
  downloadFile() {
    this.diplomaService
      .downloadDiploma(this.id, this.diploma.student.id)
      .subscribe((response) => {
        let blob: Blob = response.body;
        let a = document.createElement('a');
        a.download = this.diplomaFile.title;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      });
  }
}
