import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomaAppliesComponent } from './diploma-applies.component';

describe('DiplomaAppliesComponent', () => {
  let component: DiplomaAppliesComponent;
  let fixture: ComponentFixture<DiplomaAppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiplomaAppliesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomaAppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
