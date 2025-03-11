import { Injectable, signal } from '@angular/core';
import { Cart } from '../../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  shoppingCart = signal<Cart[]>(this.loadCartFromLocalStorage());

  constructor() { }

  addToCart(item: Cart) {
    const currentCart = this.shoppingCart();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      item.qty = 1;
      currentCart.push(item);
    }

    this.shoppingCart.set(currentCart);
    this.saveCartToLocalStorage(currentCart);
  }

  updateQty(itemId: number, qty: number) {
    const currentCart = this.shoppingCart();
    const item = currentCart.find(cartItem => cartItem.id === itemId);

    if (item) {
      item.qty = qty;
      this.shoppingCart.set(currentCart);
      this.saveCartToLocalStorage(currentCart);
    }
  }

  removeFromCart(itemId: number) {
    const currentCart = this.shoppingCart();
    const updatedCart = currentCart.filter(cartItem => cartItem.id !== itemId);

    this.shoppingCart.set(updatedCart);
    this.saveCartToLocalStorage(updatedCart);
  }

  private saveCartToLocalStorage(cart: Cart[]) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }

  private loadCartFromLocalStorage(): Cart[] {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  }
}
