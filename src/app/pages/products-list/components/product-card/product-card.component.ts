import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../../../models/product';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart/cart.service';
import { Cart } from '../../../../models/cart';
import { AddSpaceAfterCurrencyPipe } from '../../../../common/pipes/add-space-after-currency';

@Component({
  selector: 'app-product-card',
  imports: [BaseComponent.materialModules,CommonModule,RouterModule,AddSpaceAfterCurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent{
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  constructor(private router:Router, private _cartService:CartService){}
  addToCart(){
   if (this.product) {

         let productToAdd: Cart = {
           id:this.product.id,
           title:this.product.title,
           image: this.product.imgOne|| this.product.imgTwo ||this.product.imgThree || this.product.imgFour || '',
           price: Number(this.product.originalPrice),
           qty: 1
         };

         this._cartService.addToCart(productToAdd);
       }
  }

  goToItems(id:any) {
    this.router.navigate(['../products/details',id]);
  }
}
