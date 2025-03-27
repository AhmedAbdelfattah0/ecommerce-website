import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../../../models/product';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart/cart.service';
import { Cart } from '../../../../models/cart';
import { AddSpaceAfterCurrencyPipe } from '../../../../common/pipes/add-space-after-currency';
import { FormsModule } from '@angular/forms';
import '@ingka/skeleton-webc';

@Component({
  selector: 'app-product-card-skeleton',
  imports: [BaseComponent.materialModules, CommonModule, RouterModule, FormsModule],
  templateUrl: './product-card-skeleton.component.html',
  styleUrl: './product-card-skeleton.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class ProductCardSkeletonComponent {
  @Input() product!: Product;
  // @Input() isProductsLoading: boolean=false;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  navigate = navigator
  constructor(private router: Router, private _cartService: CartService) { }



}
