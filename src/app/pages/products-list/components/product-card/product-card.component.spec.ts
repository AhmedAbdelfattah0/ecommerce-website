import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart/cart.service';
import { AddSpaceAfterCurrencyPipe } from '../../../../common/pipes/add-space-after-currency';
import { of } from 'rxjs';
import { Product } from '../../../../models/product';
import { Cart } from '../../../../models/cart';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent, AddSpaceAfterCurrencyPipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default viewMode as "grid"', () => {
    expect(component.viewMode).toBe('grid');
  });

  it('should add product to cart when addToCart is called', () => {
  component.product = {
    id: 1,
    title: 'Test Product',
    titleAr: 'اختبار المنتج',
    discountedPrice: '50',
    description: 'Test Description',
    imgOne: 'img1.jpg',
    imgTwo: 'img2.jpg',
    imgThree: 'img3.jpg',
    imgFour: 'img4.jpg',
    videoLink: 'video.mp4',
    categoryId: 'cat1',
    subCategoryId: 1,
    // stock: 10,
    rating: 4.5,
    isNew: true,
    discount: 10,
    originalPrice: '100',
    reviews: 5,
    badge: 'New',
    subtitle: 'Subtitle',
    availability: 'In Stock',
    qty: 1
  } as Product;

    component.addToCart();

    const expectedProduct: Cart = {
      id: 1,
      title: 'Test Product',
      image: 'image.jpg',
      price: 100,
      qty: 1
    };

    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(expectedProduct);
  });

  it('should navigate to product details page when goToItems is called', () => {
    component.goToItems('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../products/details', '123']);
  });

  it('should not call addToCart if product is undefined', () => {
    component.product = undefined as any;
    component.addToCart();
    expect(cartServiceSpy.addToCart).not.toHaveBeenCalled();
  });
});
