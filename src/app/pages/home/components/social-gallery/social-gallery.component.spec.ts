import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialGalleryComponent } from './social-gallery.component';

describe('SocialGalleryComponent', () => {
  let component: SocialGalleryComponent;
  let fixture: ComponentFixture<SocialGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
