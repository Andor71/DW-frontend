import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDiplomaComponent } from './update-diploma.component';

describe('UpdateDiplomaComponent', () => {
  let component: UpdateDiplomaComponent;
  let fixture: ComponentFixture<UpdateDiplomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDiplomaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDiplomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
