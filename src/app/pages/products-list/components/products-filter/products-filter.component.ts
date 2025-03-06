import { Component } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';

@Component({
  selector: 'app-products-filter',
  imports: [BaseComponent.materialModules],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss'
})
export class ProductsFilterComponent {
  selectedSort: any;
  itemsPerPage: any;
  isGridView: any;


  updateSort(option: any) { }
  updateItemsCount(count: any) { }
  toggleView() { }
}
