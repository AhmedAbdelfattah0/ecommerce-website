import { ToasterService } from './../../services/toatser.service';
import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { CreateOrderRequest } from '../../models/ create-order';
import { Cart } from '../../models/cart';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { AddSpaceAfterCurrencyPipe } from '../../common/pipes/add-space-after-currency';
import { BaseComponent } from '../../common/components/base/base.component';
import { map, Observable, startWith } from 'rxjs';
import { ContriesService } from '../../services/contries/contries.service';
import { toasterCases } from '../../common/constants/app.constants';
import { trigger, state, style, animate, transition, query, stagger, group } from '@angular/animations';

interface CheckoutItem {
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [FormsModule, CommonModule, FeaturesComponent, HeroComponent, BaseComponent.materialModules, ReactiveFormsModule, AddSpaceAfterCurrencyPipe],
  styleUrls: ['./checkout.component.scss'],
  animations: [
    // Container animations
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),

    // Billing details section animation
    trigger('billingAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Form fields staggered animation
    trigger('formFieldsAnimation', [
      transition(':enter', [
        query('mat-form-field', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Order summary animation
    trigger('orderSummaryAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('600ms 400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Order items staggered animation
    trigger('orderItemsAnimation', [
      transition(':enter', [
        query('.order-item', [
          style({ opacity: 0, height: 0, marginBottom: 0 }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, height: '*', marginBottom: '*' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Place order button animation
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Hover animation for the place order button
    trigger('buttonHover', [
      state('normal', style({
        backgroundColor: '#ffffff',
        color: '#000000',
        transform: 'translateY(0)'
      })),
      state('hovered', style({
        backgroundColor: '#ffffff',
        color: '#B88E2F',
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(184, 142, 47, 0.2)'
      })),
      transition('normal <=> hovered', animate('200ms ease-out'))
    ])
  ]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  // Sample arrays for countries & provinces
  countries: any[] = [];
  provinces: any[] = [];

  // Filtered options for autocomplete
  filteredCountries$!: Observable<any[]>;
  filteredProvinces$!: Observable<any[]>;

  // Example cart summary data
  subtotal = 250000;
  total = 250000;
  paymentMethod: 'bank' | 'cod' = 'bank';
  cartItems: Cart[] = []
  selectedCountry: any = null;

  // Button hover state
  buttonState: 'normal' | 'hovered' = 'normal';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private _cartService: CartService,
    private fb: FormBuilder,
    private _contriesService: ContriesService,
    private _toasterService:ToasterService
  ) {

    effect(() => {
      this.cartItems = this._cartService.shoppingCart();
      this.calculateTotals();
    });

    this._contriesService.getContries().subscribe((res => {
      this.countries = res;

      if (this.countries.length) {
        this.filteredCountries$ = this.checkoutForm.get('country')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, this.countries))
        );

      }


    }))

    this.checkoutForm = this.fb.group({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
      streetAddress: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      province: new FormControl('',[Validators.required]),
       phone: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      additionalInfo: new FormControl('')
    });

    // Setup filtered streams for country & province
    this.filteredProvinces$ = this.checkoutForm.get('province')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.provinces[this.selectedCountry] || []))
    );

    this.checkoutForm.get('country')!.valueChanges.subscribe(selectedCountry => {
       this.selectedCountry = selectedCountry;
      this.provinces = this.countries.find(contry=> contry.name.toLowerCase()  == selectedCountry.toLowerCase() )?.states
      this.filteredProvinces$ = this.checkoutForm.get('province')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.provinces || []))
      );
    });
  }

  ngOnInit(): void {
    // Initialize or fetch cart items if needed
  }


  private _filter(value: string, list: any[]): any[] {

    const filterValue = value.toLowerCase();
    if (list.length)
      return list.filter(option => option.name.toLowerCase().includes(filterValue));
    else
      return list
  }

  // Method to set button hover state
  setButtonHover(isHovered: boolean): void {
    this.buttonState = isHovered ? 'hovered' : 'normal';
  }


  placeOrder(): void {
    // Combine the first & last name
    const name = `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`.trim();

    // Merge streetAddress + city as your main address, or adapt as needed
    const fullAddress = `${this.checkoutForm.value.streetAddress}, ${this.checkoutForm.value.city}`.trim();

    // Build the final JSON schema
    const payload = {
      name: name,
      phoneNumber: this.checkoutForm.value.phone,
      address: fullAddress,
      state: this.checkoutForm.value.province,
      statusId: 2,
      date: new Date(),
      email: this.checkoutForm.value.email,
      products:  this.cartItems.map(item=>{
          return {
            ...item,
            productId:item.id
          }
      })
    };

     this.orderService.createOrder(payload).subscribe({
      next:()=>{
        this._toasterService.openToaster(toasterCases.UnDEFAULT);
        this._cartService.shoppingCart.set([]);
        localStorage.clear();
        this.router.navigate(['/home']);
      }
    });
  }


  calculateTotals() {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    // If you have shipping or taxes, add them to get total
    this.total = this.subtotal;
  }
}
