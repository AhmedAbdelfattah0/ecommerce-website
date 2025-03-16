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

@Component({
  selector: 'app-favorites',
  imports: [HeroComponent, QtyStepperComponent, CommonModule, FormsModule, BaseComponent.materialModules, FeaturesComponent, RouterModule, AddSpaceAfterCurrencyPipe],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  cartItems: Cart[] = [];
  subtotal: number = 0;
  total: number = 0;

  constructor(private _cartService: CartService) {
    effect(() => {
      this.cartItems = this._cartService.wishlist();
      this.calculateTotals();
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
    this._cartService.updateWishlistQty(item.id, newQty);
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    this._cartService.removeFromWishlist(itemId);
    this.calculateTotals();
  }

  addAllToCart() {
    this._cartService.addAllToCart();
    this.cartItems = [];
    this.calculateTotals();
  }
}
