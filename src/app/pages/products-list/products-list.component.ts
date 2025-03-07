import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from '../../components/features/features.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductsPaginationComponent } from './components/products-pagination/products-pagination.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { PaginationConfig } from '../../models/pagination.model';
import { ProductsFilterComponent } from "./components/products-filter/products-filter.component";

@Component({
  selector: 'app-products-list',
  imports: [HeroComponent, CommonModule, FeaturesComponent, ProductGridComponent, ProductsPaginationComponent, ProductsFilterComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
    // Sample data
    products: Product[] = [
      {
        id: 1,
        name: 'Slytherine',
        price: 2500000,
        image: 'assets/images/chair-1.jpg',
        badge: 'Sale',
        category:'chair',
        description:'lorm lorem',
        rating:0
      },
      {
        id: 2,
        name: 'Leviosa',
        price: 2500000,
        image: 'assets/images/chair-2.jpg',
        badge: 'New',
        category:'chair',
        description:'lorm lorem',
        rating:1



      },
      {
        id: 3,
        name: 'Lolito',
        price: 2500000,
        image: 'assets/images/chair-3.jpg',
        category:'chair',
        description:'lorm lorem',
        rating:2



      },
      {
        id: 4,
        name: 'Respira',
        price: 2500000,
        image: 'assets/images/chair-4.jpg',
        category:'chair',
        description:'lorm lorem',
        rating:3



      },
      // Add as many items as you need...
    ];
    filteredProducts: Product[] = [];
    totalProducts: number = 0;
    itemsPerPage: number = 9;
    currentPage: number = 1;
    viewMode: 'grid' | 'list' = 'grid';

    ngOnInit(): void {
      // Initially, display all products
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalProducts = this.products.length;
    }

    onFilterChanged(filterData: any): void {
      // Apply filter logic here
      // For demonstration, we’ll just reassign all products
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.currentPage = 1;
    }

    onSortChanged(sortData: any): void {
      // Apply sorting logic here
      // Example: sort by name or price
      if (sortData === 'priceAsc') {
        this.products.sort((a, b) => a.price - b.price);
      } else if (sortData === 'priceDesc') {
        this.products.sort((a, b) => b.price - a.price);
      }
      // Reset page
      this.currentPage = 1;
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
    }

    onViewModeChanged(mode: any): void {
      this.viewMode = (mode.target as HTMLInputElement).value as 'grid' | 'list';
    }

    onPageChanged(event: any): void {
      this.currentPage = (event.target as HTMLInputElement).valueAsNumber;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.filteredProducts = this.products.slice(startIndex, endIndex);
    }
}
