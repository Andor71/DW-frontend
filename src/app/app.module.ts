import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from 'src/core/auth/error.interceptor';
import { JwtInterceptor } from 'src/core/auth/jwt.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsModule } from './layouts/layouts.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthAdminGuard } from 'src/core/guards/auth-admin.guard';
import { AuthTeacherGouard } from 'src/core/guards/auth-teacher.gurad';
// import { SortablejsModule } from "angular-sortablejs";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    LayoutsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [
    AuthAdminGuard,
    AuthTeacherGouard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
