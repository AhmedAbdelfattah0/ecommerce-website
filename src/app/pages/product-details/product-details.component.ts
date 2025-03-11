import { Component } from '@angular/core';
import { Product, Product_v2 } from '../../models/product';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductGridComponent } from '../products-list/components/product-grid/product-grid.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QtyStepperComponent } from '../../components/qty-stepper/qty-stepper.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart/cart.service';
import { Cart } from '../../models/cart';

@Component({
  selector: 'app-product-details',
  imports: [ProductGridComponent, CommonModule, FormsModule, QtyStepperComponent, BreadcrumbComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  product: Product_v2 | null = null;
  selectedImage: string = '';
  selectedTab: string = 'description'; // default active tab
  products: Product[] = [];
  productsDescriptionImage: string[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  qty: number = 1;
  totalProducts: number = 0;
  itemsPerPage: number = 4;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = this.itemsPerPage;
  relatedProducts: Product[] = [];
  filteredRelatedProducts: Product[] = [];
  minQty=1;
  constructor(private _productService: ProductService, private route: ActivatedRoute, private _cartService:CartService) {
    this.route.paramMap.subscribe({
      next: (value: any) => {
        if (value && value.hasOwnProperty('params') && value['params']) {
          this.getProductById(value.params.id);
        }
      },
    });
  }


  getProductById(id: any) {

    this._productService.getProduct(id).subscribe(res => {
      this.product = res
      this.minQty=1;
      if (this.product && this.product.images.length) {
        this.productsDescriptionImage = this.product.images.slice(0, 2);
        this.selectedImage = this.product.images[0];
        this.getProductsByCatigoryId(this.product.categoryId)
      }
    })
  }
  // Set the selectedImage to the first product image


  selectImage(img: string) {
    this.selectedImage = img;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  addToCart() {
    // Add to cart logic
    if (this.product) {

      let productToAdd: Cart = {
        id:this.product.id,
        title:this.product.title,
        image: this.product.images[0] || '',
        price: Number(this.product.originalPrice),
        qty: this.qty
      };

      this._cartService.addToCart(productToAdd);
    }
    console.log('Added to cart:', this.product?.title);
  }

  compare() {
    // Compare logic
    console.log('Compare product:', this.product?.title);
  }


  onPageChanged(): void {
    this.currentPage = this.currentPage + 1;
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = startIndex + this.itemsPerPage;
    this.filteredRelatedProducts = this.relatedProducts.slice(this.startIndex,this.endIndex)

  }



  getProductsByCatigoryId(categoryId:any) {
    this._productService.getProductsByCategory(categoryId).subscribe(res => {
      this.relatedProducts = res
      this.filteredRelatedProducts = this.relatedProducts.slice(this.startIndex,this.endIndex)
    });
  }
}
