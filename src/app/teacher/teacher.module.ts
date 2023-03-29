import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiplomasComponent } from './diplomas/diplomas.component';
import { CreatDiplomaComponent } from './create-diploma/create-diploma.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DiplomaComponent } from './diploma/diploma.component';
import { UpdateDiplomaComponent } from './update-diploma/update-diploma.component';
import { DiplomaAppliesComponent } from './diploma-applies/diploma-applies.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DropzoneModule } from 'ngx-dropzone-wrapper';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

const routes: Routes = [
  {
    path: 'diplomas',
    component: DiplomasComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'create-diploma',
    component: CreatDiplomaComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'diploma/:id',
    component: DiplomaComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'update-diploma/:id',
    component: UpdateDiplomaComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: 'diploma-applies',
    component: DiplomaAppliesComponent,
    data: { animation: 'decommerce' },
  },
  {
    path: '',
    redirectTo: '/teacher/diplomas',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    DiplomasComponent,
    CreatDiplomaComponent,
    DiplomaComponent,
    UpdateDiplomaComponent,
    DiplomaAppliesComponent,
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgbModule,
    DropzoneModule,
  ],
})
export class TeacherModule {}
