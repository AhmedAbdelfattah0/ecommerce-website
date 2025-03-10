import { ProductService } from '../../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from '../../components/features/features.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductsPaginationComponent } from './components/products-pagination/products-pagination.component';
import { Product } from '../../models/product';
import { PaginationConfig } from '../../models/pagination.model';
import { ProductsFilterComponent } from "./components/products-filter/products-filter.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-list',
  imports: [HeroComponent, CommonModule, FeaturesComponent, ProductGridComponent, ProductsPaginationComponent, ProductsFilterComponent, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  // Sample data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  totalProducts: number = 0;
  itemsPerPage: number = 16;
  currentPage: number = 1;
  viewMode: 'grid' | 'list' = 'grid';
  startIndex: number = 0;
  endIndex: number = this.itemsPerPage;
  showProducts: boolean = true
  constructor(private _productService: ProductService, private route: ActivatedRoute) {
    this._productService.getProducts().subscribe((res: any) => {
      this.products = res
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalProducts = this.products.length;
      this.route.queryParams.subscribe(res => {
        console.log(res);
        if (res && res.hasOwnProperty('pros'))
          this.onFilterChanged(res['pros'])

      })
    })


  }

  ngOnInit(): void {
    // Initially, display all products

  }

  onFilterChanged(filterData: any): void {
     if (filterData) {
      this.filteredProducts = this.products.filter(product => product.categoryId == filterData).slice(0, this.itemsPerPage);
      this.totalProducts = this.filteredProducts.length
      this.currentPage = 1;
      return
    } else {
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalProducts = this.products.length
      return

    }

  }

  onSortChanged(sortData: any): void {
    // Apply sorting logic here
    // Example: sort by name or price
    if (sortData === 'priceAsc') {
      this.products.sort((a, b) => Number(a.originalPrice) - Number(b.originalPrice));
    } else if (sortData === 'priceDesc') {
      this.products.sort((a, b) => Number(b.originalPrice) - Number(a.originalPrice));
    }
    // Reset page
    this.currentPage = 1;
    this.filteredProducts = this.products.slice(0, this.itemsPerPage);
  }

  onViewModeChanged(mode: any): void {
    this.viewMode = mode;
  }
  itemsPerPageChanged(items: any): void {

    this.currentPage = 1;
    this.itemsPerPage = items;
    this.filteredProducts = this.products.slice(0, this.itemsPerPage);
    this.totalProducts = this.products.length;
    this.onPageChanged(this.currentPage)

  }

  onPageChanged(event: any): void {
    this.showProducts = false;
    this.currentPage = event;
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.filteredProducts = this.products.slice(this.startIndex, this.endIndex);
    setTimeout(() => {
      this.showProducts = true;
    }, 500)
  }
}
