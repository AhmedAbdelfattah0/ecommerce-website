import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHeroComponent } from './products-hero.component';

describe('ProductsHeroComponent', () => {
  let component: ProductsHeroComponent;
  let fixture: ComponentFixture<ProductsHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
