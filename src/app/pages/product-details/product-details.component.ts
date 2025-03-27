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
import { AddSpaceAfterCurrencyPipe } from '../../common/pipes/add-space-after-currency';
import { BaseComponent } from '../../common/components/base/base.component';
import { SeoService } from '../../services/seo/seo.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    ProductGridComponent,
    CommonModule,
    FormsModule,
    QtyStepperComponent,
    BreadcrumbComponent,
    AddSpaceAfterCurrencyPipe,
    BaseComponent.materialModules,
    NgOptimizedImage
  ],
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

  constructor(
    private _productService: ProductService,
    private route: ActivatedRoute,
    private _cartService: CartService,
    private seoService: SeoService
  ) {
    window.scrollTo(0, 0);
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
      this.product = res;
      this.minQty=1;

      if (this.product && this.product.images.length) {
        this.productsDescriptionImage = this.product.images.slice(0, 2);
        this.selectedImage = this.product.images[0];
        this.getProductsByCatigoryId(this.product.categoryId);

        // Update SEO meta tags for this product
        this.updateProductSeo();
      }
    });
  }

  // Update SEO meta tags for this product
  private updateProductSeo() {
    if (this.product) {
      // Create an optimized product SEO object
      const productSeo = {
        title: this.product.title,
        description: this.truncateDescription(this.product.description, 160),
        image: this.product.images[0] || '',
        price: this.product.originalPrice,
        availability: this.product.availability ? 'in stock' : 'out of stock',
        categoryName: this.product.categoryName
      };

      // Update meta tags for this product
      this.seoService.updateProductMetaTags(productSeo);
    }
  }

  // Truncate description to specified length for meta tags
  private truncateDescription(description: string, maxLength: number): string {
    if (description && description.length > maxLength) {
      return description.substring(0, maxLength - 3) + '...';
    }
    return description;
  }

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
  }

  onPageChanged(): void {
    this.currentPage = this.currentPage + 1;
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = startIndex + this.itemsPerPage;
    this.filteredRelatedProducts = this.relatedProducts
      .slice(this.startIndex, this.endIndex)
      .filter(product => product.id !== this.product?.id);
  }

  getProductsByCatigoryId(categoryId: any) {
    this._productService.getProductsByCategory(categoryId).subscribe(res => {
      this.relatedProducts = res;
      this.filteredRelatedProducts = this.relatedProducts
        .slice(this.startIndex, this.endIndex)
        .filter(product => product.id !== this.product?.id);
    });
  }
}
