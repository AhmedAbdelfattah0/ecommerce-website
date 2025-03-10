import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../../../models/product';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [BaseComponent.materialModules,CommonModule,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent{
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  constructor(private router:Router){}
  addToCart(){
    console.log('Added To Cart');

  }

  goToItems(id:any) {
    this.router.navigate(['../products/details',id]);
  }
}
