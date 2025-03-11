import { Component, effect, OnInit } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { Cart } from '../../models/cart';
import { QtyStepperComponent } from '../../components/qty-stepper/qty-stepper.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../common/components/base/base.component';
import { CartService } from '../../services/cart/cart.service';
import { FeaturesComponent } from '../../components/features/features.component';

@Component({
  selector: 'app-cart',
  imports: [HeroComponent,QtyStepperComponent,CommonModule,FormsModule, BaseComponent.materialModules,FeaturesComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  subtotal: number = 0;
  total: number = 0;
  constructor(private _cartService:CartService){
    effect(()=>{
      this.cartItems = this._cartService.shoppingCart();
     this.calculateTotals();

    })
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
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    // this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this._cartService.removeFromCart(itemId)
    this.calculateTotals();
  }

  checkout() {
    console.log('Proceeding to checkout...');
    // Your checkout logic
  }
}
