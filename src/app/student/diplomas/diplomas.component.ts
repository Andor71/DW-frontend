import { Component } from "@angular/core";
import { first, forkJoin, Subscription } from "rxjs";
import { Options } from "sortablejs";
import { DiplomaDto } from "src/core/models/diploma.model";
import { UserDto } from "src/core/models/user.model";
import { CookieService } from "src/core/services/cookie.service";
import { CustomToastrService } from "src/core/services/CustomToastrService.service";
import { DiplomaService } from "src/core/services/diploma.service";

@Component({
  selector: "app-diplomas",
  templateUrl: "./diplomas.component.html",
  styleUrls: ["./diplomas.component.scss"],
})
export class DiplomasComponent {
  //Data
  public diplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  public appliedDiplomas: Array<DiplomaDto> = new Array<DiplomaDto>();
  public currentUser: UserDto;
  //Helper
  public isLoading = true;
  public loadDataSubscription: Subscription = new Subscription();

  public options: Options = {
    onEnd: (event: any) => {
      this.sendPriorityChanges();
    },
    scrollSensitivity: 10,
  };

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    private cookieService: CookieService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.cookieService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    this.loadDataSubscription = forkJoin([
      this.diplomaService.getAllVisible(),
      this.diplomaService.getAllAppliedDiplomas(),
    ]).subscribe(
      ([diplomas, appliedDiplomas]) => {
        this.diplomas = diplomas;
        this.appliedDiplomas = appliedDiplomas;
        console.log(this.appliedDiplomas);
        
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          "Hiba lépett fel az adatok betöltése közben !"
        );
        this.isLoading = false;
      }
    );
  }

  sendPriorityChanges() {
    this.diplomaService
      .changeAppliedPriority(this.currentUser.id, this.appliedDiplomas)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            "Sikeresen változtattad a jelentkezett diplomák prioritását!"
          );
        },
        error: (e) => {
          this.toastrService.toastrError("");
        },
      });
  }
}
