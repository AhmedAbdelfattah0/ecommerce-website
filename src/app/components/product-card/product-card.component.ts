import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [BaseComponent.materialModules,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() layout: 'grid' | 'list' = 'grid';
}
