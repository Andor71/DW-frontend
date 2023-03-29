import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodsComponent } from './periods/periods.component';
import { RouterModule, Routes } from '@angular/router';
import { CreatePeriodComponent } from './create-period/create-period.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeriodComponent } from './period/period.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes: Routes = [
  {
    path: 'periods',
    component: PeriodsComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'create-period/:id',
    component: CreatePeriodComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'period/:id',
    component: PeriodComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: '',
    redirectTo: '/admin/periods',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error', //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    PeriodsComponent,
    CreatePeriodComponent,
    PeriodComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class AdminModule {}
