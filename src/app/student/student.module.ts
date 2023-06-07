import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiplomasComponent } from './diplomas/diplomas.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';
import { DiplomaComponent } from './diploma/diploma.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

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
    redirectTo: '/student/diplomas',
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
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    SortablejsModule,
  ],
})
export class StudentModule {}
