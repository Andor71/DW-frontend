import { ToastsContainer } from "./login/toasts-container.component";
import { AccountRoutingModule } from "./account-routing.module";
import { LoginComponent } from "./login/login.component";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [LoginComponent, ToastsContainer],
  imports: [
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule {}
