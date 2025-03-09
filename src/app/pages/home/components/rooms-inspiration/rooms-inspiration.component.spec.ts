import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsInspirationComponent } from './rooms-inspiration.component';

describe('RoomsInspirationComponent', () => {
  let component: RoomsInspirationComponent;
  let fixture: ComponentFixture<RoomsInspirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsInspirationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsInspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
