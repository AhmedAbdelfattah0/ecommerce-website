import { ProductService } from '../../services/product/product.service';
import { Component, OnInit, signal } from '@angular/core';
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
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
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
  showProducts: boolean = true;
  currentCategory: string | null = null;

  constructor(
    public _productService: ProductService,
    private route: ActivatedRoute,
    private seoService: SeoService
  ) {
    this.fetchProducts();
  }

  ngOnInit(): void {
    // Initially, display all products
    window.scrollTo(0, 0);
    this.updateSeoMetadata();
  }

  /**
   * Update SEO metadata based on current page and filters
   */
  private updateSeoMetadata(category?: string): void {
    let title = 'Our Furniture Collection';
    let description = 'Browse our extensive collection of high-quality furniture. From sofas to dining tables, find the perfect piece for your home.';
    let keywords = 'furniture, sofas, tables, chairs, bedroom furniture, living room furniture, dining room';

    if (category) {
      title = `${category} Furniture Collection`;
      description = `Browse our extensive collection of ${category.toLowerCase()} furniture. Find the perfect ${category.toLowerCase()} piece for your home.`;
      keywords = `${category.toLowerCase()} furniture, ${category.toLowerCase()}, furniture, home decor`;
    }

    if (this.currentPage > 1) {
      title += ` - Page ${this.currentPage}`;
      description = `Page ${this.currentPage} of our furniture collection. ${description}`;
    }

    this.seoService.updateMetaTags({
      title,
      description,
      keywords,
      url: window.location.href
    });
  }

  onFilterChanged(filterData: any): void {
    if (filterData) {
      this.filteredProducts = this.products.filter(product => product.categoryId == filterData).slice(0, this.itemsPerPage);
      this.totalProducts = this.filteredProducts.length;
      this.currentPage = 1;

      // Find category name for SEO
      const categoryItem = this.filteredProducts.find(item => item.categoryId === filterData);
      if (categoryItem) {
        this.currentCategory = categoryItem.categoryName;
        this.updateSeoMetadata(this.currentCategory);
      }
      return;
    } else {
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalProducts = this.products.length;
      this.currentCategory = null;
      this.updateSeoMetadata();
      return;
    }
  }

  fetchProducts() {
    this._productService.getProducts().subscribe((res: any) => {
      this.products = res;
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalProducts = this.products.length;
      this._productService.isProductsLoading.set(false);

      this.route.queryParams.subscribe(res => {
        if (res && res.hasOwnProperty('pros'))
          this.onFilterChanged(res['pros']);
      });
    });
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
    this.onPageChanged(this.currentPage);
  }

  onPageChanged(event: any): void {
    this.showProducts = false;
    this.currentPage = event;
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.filteredProducts = this.products.slice(this.startIndex, this.endIndex);
    // Update SEO for pagination
    this.updateSeoMetadata(this.currentCategory || undefined);

    setTimeout(() => {
      this.showProducts = true;
    }, 500);
  }
}
