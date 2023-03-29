import { Component, OnInit } from '@angular/core';
import { first, forkJoin, Subscription } from 'rxjs';
import { DiplomaDto } from 'src/core/models/diploma.model';
import { CustomToastrService } from 'src/core/services/CustomToastrService.service';
import { DiplomaService } from 'src/core/services/diploma.service';

@Component({
  selector: 'app-diploma-applies',
  templateUrl: './diploma-applies.component.html',
  styleUrls: ['./diploma-applies.component.scss']
})
export class DiplomaAppliesComponent implements OnInit{

  //Data
  public diplomaApplies: Array<DiplomaDto> = new Array<DiplomaDto>;

  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();
  public allEnabled : boolean = true;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllAppliedDiplomas(),
    ]).subscribe(
      ([diplomaApplies]) => {
        this.diplomaApplies = diplomaApplies;
        console.log(this.diplomaApplies);
        
        this.diplomaApplies.forEach(x=>{
          if(!x.enabled){
            this.allEnabled = false;
          }
        })

        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          "An error occurred while loading the content"
        );
      }
    );
  }

  enableStudentDiploma(diplomaDto:DiplomaDto){   
    this.diplomaService.enableStudentDiploma(diplomaDto.diplomaId,diplomaDto.student.id).pipe(first()).subscribe({
      next:()=>{
        console.log(diplomaDto.enabled);
        
        if(diplomaDto.enabled){
          diplomaDto.enabled = false;
          this.toastrService.toastrSuccess(
            "Diploma nem indulhat!"
          );

        }else{
          this.toastrService.toastrSuccess(
            "Diploma indulhat!"
          );
          diplomaDto.enabled = true;

        }
      },
      error:()=>{
        if(diplomaDto.enabled){
          this.toastrService.toastrError(
            "Hiba lépett fel az elutasít közben!"
          );
        }else{
          this.toastrService.toastrError(
            "Hiba lépett fel az elfogadás közben!"
          );
        }

      }
    })
  }
  enableAllStudentDiploma(){
    this.diplomaService.enableAllStudentDiploma().pipe(first()).subscribe({
      next:()=>{
        this.toastrService.toastrSuccess(
          "Sikeresen változtattad a diplomák státuszát!"
        );
      },
      error:()=>{
        this.toastrService.toastrError(
          "Hiba lépett fel a diplomák státusza változtasása közben!"
        );
      }
    })
  }
}



