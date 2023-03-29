import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./layouts/layout.component";

const routes: Routes = [
  {
    path: "admin",
    component: LayoutComponent,
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "teacher",
    component: LayoutComponent,
    loadChildren: () =>
      import("./teacher/teacher.module").then((m) => m.TeacherModule),
  },
  {
    path: "student",
    component: LayoutComponent,
    loadChildren: () =>
      import("./student/student.module").then((m) => m.StudentModule),
  },
  {
    path: "access",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "",
    redirectTo: "/access/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
