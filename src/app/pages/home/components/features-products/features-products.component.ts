import { ProductService } from './../../../../services/product/product.service';
import { Component } from '@angular/core';
import { SuCategoriesService } from '../../../../services/sub-categories/su-categories.service';
import { SubCategory } from '../../../../models/sub-category';
import { Product } from '../../../../models/product';
import { ProductGridComponent } from '../../../products-list/components/product-grid/product-grid.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-features-products',
  imports: [ProductGridComponent, FormsModule],
  templateUrl: './features-products.component.html',
  styleUrl: './features-products.component.scss'
})
export class FeaturesProductsComponent {
  subCategoriesList: SubCategory[] = [];
  products: Product[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  totalProducts: number = 0;
  itemsPerPage: number = 8;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = this.itemsPerPage;

  constructor(private _suCategoriesService: SuCategoriesService, public _productService: ProductService) {
    this._suCategoriesService.getSubCatigories().subscribe(res => {
      this.subCategoriesList = res
    })

    this._productService.getProducts().subscribe(res => {
      this.products = res;
      this._productService.isProductsLoading.set(false)
    })


  }

  filterProductsBySubCatigory(id: any) {
     return this.products.filter(product => product.subCategoryId == id).slice(this.startIndex, this.endIndex);
  }

  filterProductsBySubCatigoryWithoutSlice(id: any) {
     return this.products.filter(product => product.subCategoryId == id);
  }



  onPageChanged(id:any): void {
      this.currentPage = this.currentPage + 1;
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = startIndex + this.itemsPerPage;
    this.filterProductsBySubCatigory(id)

  }
}
