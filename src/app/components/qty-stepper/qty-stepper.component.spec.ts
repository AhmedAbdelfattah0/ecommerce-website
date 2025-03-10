import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyStepperComponent } from './qty-stepper.component';

describe('QtyStepperComponent', () => {
  let component: QtyStepperComponent;
  let fixture: ComponentFixture<QtyStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QtyStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QtyStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
