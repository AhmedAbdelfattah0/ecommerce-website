import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from '../../components/features/features.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductsPaginationComponent } from './components/products-pagination/products-pagination.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  imports: [HeroComponent,CommonModule,FeaturesComponent, ProductGridComponent, ProductsPaginationComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  products: Product[] = [];
  paginationConfig: PaginationConfig = {
    itemsPerPage: 12,
    currentPage: 1,
    totalItems: 0
  };
  isGridView = true;
  sortBy = 'price_asc';
  filters = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts({
      page: this.paginationConfig.currentPage,
      perPage: this.paginationConfig.itemsPerPage,
      sort: this.sortBy,
      filters: this.filters
    }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.paginationConfig.totalItems = response.total;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.loadProducts();
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.paginationConfig.currentPage = 1;
    this.loadProducts();
  }

  onItemsPerPageChange(items: number): void {
    this.paginationConfig.itemsPerPage = items;
    this.paginationConfig.currentPage = 1;
    this.loadProducts();
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
