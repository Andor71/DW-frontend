import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first, forkJoin, Subscription } from "rxjs";
import { DiplomaDto } from "src/core/models/diploma.model";
import { UserDto } from "src/core/models/user.model";
import { CookieService } from "src/core/services/cookie.service";
import { CustomToastrService } from "src/core/services/CustomToastrService.service";
import { DiplomaService } from "src/core/services/diploma.service";

@Component({
  selector: "app-diploma",
  templateUrl: "./diploma.component.html",
  styleUrls: ["./diploma.component.scss"],
})
export class DiplomaComponent {
  //Data
  public diploma: DiplomaDto = new DiplomaDto();
  public id: number;
  public currentUser: UserDto;

  //Helper
  public isLoading: boolean = true;
  public loadDataSubscription: Subscription = new Subscription();
  public tempApplied: Boolean;

  constructor(
    private diplomaService: DiplomaService,
    private toastrService: CustomToastrService,
    public route: ActivatedRoute,
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
    ]).subscribe(
      ([diploma]) => {
        this.diploma = diploma;
        this.tempApplied = this.diploma.applied;
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.toastrError(
          "An error occurred while loading the content"
        );
        this.isLoading = false;
      }
    );
  }

  assigneToDiploma(diplomaID: number) {
    this.diplomaService
      .assignStudentToDiploma(this.currentUser.id, this.id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.toastrSuccess(
            "Sikeresen jelentkezett a diplomára!"
          );
        },
        error: (e) => {
          this.toastrService.toastrSuccess(
            "Hiba lépett fel jelentkezés közben!"
          );
        },
      });
  }
}
