import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../../../models/product';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart/cart.service';
import { Cart } from '../../../../models/cart';
import { AddSpaceAfterCurrencyPipe } from '../../../../common/pipes/add-space-after-currency';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  imports: [BaseComponent.materialModules, CommonModule, RouterModule, AddSpaceAfterCurrencyPipe, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  navigate = navigator
  constructor(private router: Router, private _cartService: CartService) { }


  addToCart() {
    if (this.product) {

      let productToAdd: Cart = {
        id: this.product.id,
        title: this.product.title,
        image: this.product.imgOne || this.product.imgTwo || this.product.imgThree || this.product.imgFour || '',
        price: Number(this.product.originalPrice),
        qty: 1
      };

      this._cartService.addToCart(productToAdd);
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

  goToItems(id: any) {
    this.router.navigate(['../products/details', id]);
  }



  shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: this.product.title,
        text: 'Check out this product!',
        url: `${window.location.origin}/products/details/${this.product.id}`
      }).then(() => {
        console.log('Product shared successfully');
      }).catch((error) => {
        console.error('Error sharing product:', error);
      });
    } else {
      console.warn('Web Share API is not supported in this browser.');
    }
  }

}
