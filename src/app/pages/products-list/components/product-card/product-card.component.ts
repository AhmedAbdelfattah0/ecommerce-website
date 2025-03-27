import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { bounceIn, fadeIn, flipLeft, zoomIn } from '../../../../shared/animations';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart/cart.service';
import { Cart } from '../../../../models/cart';
import { AddSpaceAfterCurrencyPipe } from '../../../../common/pipes/add-space-after-currency';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [BaseComponent.materialModules, CommonModule, RouterModule, AddSpaceAfterCurrencyPipe, FormsModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  animations: [
    flipLeft,
    bounceIn,
    fadeIn,
    zoomIn,
    trigger('overlayAnimation', [
      state('hidden', style({
        opacity: 0,
        visibility: 'hidden'
      })),
      state('visible', style({
        opacity: 1,
        visibility: 'visible'
      })),
      transition('hidden => visible', [
        animate('300ms ease-in')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-out')
      ])
    ]),
    trigger('buttonHover', [
      state('normal', style({
        transform: 'translateY(0)',
        backgroundColor: '#ffffff',
        color: '#B88E2F'
      })),
      state('hovered', style({
        transform: 'translateY(-3px)',
        backgroundColor: '#B88E2F',
        color: '#ffffff',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> hovered', [
        animate('200ms ease-out')
      ])
    ]),
    trigger('actionAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  overlayState: 'visible' | 'hidden' = 'hidden';
  buttonState: 'normal' | 'hovered' = 'normal';
  navigate = { share: typeof navigator.share !== 'undefined' };

  constructor(private router: Router, private _cartService: CartService) { }

  showOverlay() {
    this.overlayState = 'visible';
  }

  hideOverlay() {
    this.overlayState = 'hidden';
    this.buttonState = 'normal';
  }

  setButtonHover(state: 'normal' | 'hovered') {
    this.buttonState = state;
  }

  addToCart() {
    if (this.product) {
      const productToAdd: Cart = {
        id: this.product.id,
        title: this.product.title,
        image: this.product.imgOne || this.product.imgTwo || this.product.imgThree || this.product.imgFour || '',
        price: Number(this.product.originalPrice),
        qty: 1
      };

      this._cartService.addToCart(productToAdd);
    }
  }

  shareProduct() {
    console.log('Sharing product:', this.product.title);
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: this.product.title,
        text: 'Check out this product!',
        url: `${window.location.origin}/products/details/${this.product.id}`
      });
    }
  }



  addToWishlist() {
    if (this.product && !this.isInWishlist()) {

      let productToAdd: Cart = {
        id: this.product.id,
        title: this.product.title,
        image: this.product.imgOne || this.product.imgTwo || this.product.imgThree || this.product.imgFour || '',
        price: Number(this.product.originalPrice),
        qty: 1
      };

      this._cartService.addToWishlist(productToAdd);
    } else {
      this._cartService.removeFromWishlist(this.product.id)
    }
  }

  isInWishlist(): boolean {
    const currentWishlist = this._cartService.wishlist();
    return currentWishlist.some(wishlistItem => wishlistItem.id === this.product.id);
  }
}
