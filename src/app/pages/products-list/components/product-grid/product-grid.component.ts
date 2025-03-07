import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-product-grid',
  imports: [BaseComponent.materialModules,CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() viewMode: 'grid' | 'list' = 'grid';
  constructor() { }
}
