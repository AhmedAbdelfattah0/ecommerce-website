import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import '@ingka/skeleton-webc';
import { ProductCardSkeletonComponent } from '../product-card-skeleton/product-card-skeleton.component';

@Component({
  selector: 'app-product-grid',
  imports: [BaseComponent.materialModules,ProductCardComponent,ProductCardSkeletonComponent,CommonModule,FormsModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
 })
export class ProductGridComponent  {
  @Input() products: Product[] = [];
   @Input() viewMode: 'grid' | 'list' = 'list';
   @Input() isProductsLoading : boolean = false;
  constructor() {
}

}
