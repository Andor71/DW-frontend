import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiplomasComponent } from './diplomas/diplomas.component';
import { DiplomaComponent } from './diploma/diploma.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: 'diplomas',
    component: DiplomasComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'diploma/:id',
    component: DiplomaComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: '',
    redirectTo: '/guest/diplomas',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error', //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [DiplomasComponent, DiplomaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    NgbModule,
  ],
})
export class GuestModule {}
