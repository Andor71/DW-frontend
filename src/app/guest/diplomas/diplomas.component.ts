import { Component, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
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
  public diplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  public diplomasConst: Array<DiplomaDto> = new Array<DiplomaDto>();
  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  public p: number = 1;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.diplomasConst.filter((d) => {
      return d.keywords.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.diplomas = temp;
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getFinishesd(),
    ]).subscribe(
      ([diplomas]) => {
        this.diplomas = diplomas;
        console.log(this.diplomas);

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          'Hiba lépett fel az adatok betöltésénél!'
        );
        this.isLoading = false;
      }
    );
  }
}
