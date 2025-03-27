import { Component, effect, OnInit } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { Cart } from '../../models/cart';
import { QtyStepperComponent } from '../../components/qty-stepper/qty-stepper.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../common/components/base/base.component';
import { CartService } from '../../services/cart/cart.service';
import { FeaturesComponent } from '../../components/features/features.component';
import { RouterModule } from '@angular/router';
import { AddSpaceAfterCurrencyPipe } from '../../common/pipes/add-space-after-currency';
import { trigger, state, style, animate, transition, query, stagger, group } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeroComponent, QtyStepperComponent, CommonModule, FormsModule, BaseComponent.materialModules, FeaturesComponent, RouterModule, AddSpaceAfterCurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  animations: [
    // Container animation
    trigger('cartContainerAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),

    // Cart items section animation
    trigger('cartItemsAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Table header animation
    trigger('tableHeaderAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        animate('400ms 300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Cart items row animation with stagger
    trigger('cartItemsRowAnimation', [
      transition(':enter', [
        query('tr', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Item removal animation
    trigger('itemRemovalAnimation', [
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        group([
          animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(30px)' })),
          animate('500ms ease-out', style({ height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }))
        ])
      ])
    ]),

    // Cart totals animation
    trigger('cartTotalsAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms 400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Totals line animation
    trigger('totalsLineAnimation', [
      transition(':enter', [
        query('.totals-line', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(150, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Checkout button animation
    trigger('checkoutButtonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('400ms 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          style({ opacity: 1, transform: 'scaleY(1)' }))
      ])
    ]),

    // Button hover animation
    trigger('buttonHover', [
      state('normal', style({
        backgroundColor: '#F9F1E7',
        color: '#333',
        transform: 'translateY(0)'
      })),
      state('hovered', style({
        backgroundColor: '#B88E2F',
        color: '#FFF',
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(184, 142, 47, 0.2)'
      })),
      transition('normal <=> hovered', animate('200ms ease-out'))
    ])
  ]
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  subtotal: number = 0;
  total: number = 0;
  buttonState: 'normal' | 'hovered' = 'normal';

  constructor(private _cartService: CartService) {
    effect(() => {
      this.cartItems = this._cartService.shoppingCart();
      this.calculateTotals();
    });
  }

  ngOnInit(): void {
    // Example data; in real usage, fetch from a service or local storage
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((acc, item) => {
      return acc + item.price * item.qty;
    }, 0);

    // If you have shipping or tax, add them to get total
    this.total = this.subtotal; // for now, total = subtotal
  }

  onQtyChange(item: Cart, newQty: number) {
    item.qty = newQty;
    this._cartService.updateQty(item.id, newQty);
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    this._cartService.removeFromCart(itemId);
    this.calculateTotals();
  }

  // Method to set button hover state
  setButtonHover(isHovered: boolean): void {
    this.buttonState = isHovered ? 'hovered' : 'normal';
  }
}
