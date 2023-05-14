import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';

@Component({
  selector: 'app-diplomas',
  templateUrl: './diplomas.component.html',
  styleUrls: ['./diplomas.component.scss'],
})
export class DiplomasComponent implements OnInit {
  //Data
  public myDiplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getMyDiplomas(),
    ]).subscribe(
      ([myDiplomas]) => {
        this.myDiplomas = myDiplomas;
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'An error occurred while loading the content'
        );
      }
    );
  }
}
