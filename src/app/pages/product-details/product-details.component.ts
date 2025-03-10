import { Component } from '@angular/core';
import { Product, Product_v2 } from '../../models/product';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductGridComponent } from '../products-list/components/product-grid/product-grid.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QtyStepperComponent } from '../../components/qty-stepper/qty-stepper.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-details',
  imports: [ProductGridComponent, CommonModule,FormsModule, QtyStepperComponent, BreadcrumbComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  product: Product_v2 | null = null;
  selectedImage: string = '';
  selectedTab: string = 'description'; // default active tab
  products: Product[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  qty:number=1;
  constructor(private _productService:ProductService, private route: ActivatedRoute ){
    this.route.paramMap.subscribe({
      next: (value: any) => {
        if (value && value.hasOwnProperty('params') && value['params']) {
          this.getProductById(value.params.id);
        }
      },
    });
  }
  // Example related products (or fetch from service)
  relatedProducts: Product[] = [
    {
      "id":  2 ,
      "title": "WARSAW CHAIR",
      "titleAr": "",
      "description": "The piece shown in the image is an armchair with a modern and comfortable design. The chair features a low profile design with wide armrests that provide optimal comfort and support. The fabric used for the chair is a soft and light-colored fabric, giving it a stylish and modern look. The chair's simple and elegant design makes it suitable for placing in the living room or bedroom to add a touch of elegance and comfort.\n\n",
       "originalPrice": "5000.00",
      "discountedPrice": "4700.00",
      "discount":  14 ,
      "availability": "Out of stock",
      "categoryId": "1",
      "subCategoryId":  1 ,
      "imgOne": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b6272a3.png",
      "imgTwo": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b62a6bf.png",
      "imgThree": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b62e744.png",
      "imgFour": "",
      "videoLink": "",
      rating:1
   },
  {
      "id":  3  ,
      "title": "Tivoli Dining Chair",
      "titleAr": "كرسي طعام تيفولي",
      "description": "The amazing unique colored and highly modern Tivoli Dining Chair is shown here in a Grey Eco Veneer Structure, seat in Eco leather. The Gray Oak Grains recall the naturalness of the product.\n\n",
       "originalPrice": "5000.00",
      "discountedPrice": "4700.00",
      "discount": 0,
      "availability": "In stock",
      "categoryId": "1",
      "subCategoryId": 2,
      "imgOne": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b6322b3.png",
      "imgTwo": "",
      "imgThree": "",
      "imgFour": "",
      "videoLink": "",
      rating:1

   },
  {
      "id": 4,
      "title": "A Whole Bunch Coffee Table",
      "titleAr": "",
      "description": "Here’s a table you can’t help but love. Its deceptively simple design is as modern yet classic as the Hollywood Regency era. A warm Galway finish adds rich tonal color to its radial matched, quartered Paldao veneers while its three legs are finished in Golden Shimmer.\n\n",
       "originalPrice": "5000.00",
      "discountedPrice": "6000.00",
      "discount":  0 ,
      "availability": "In stock",
      "categoryId": "6",
      "subCategoryId":  2 ,
      "imgOne": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b6354d1.png",
      "imgTwo": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b638db7.png",
      "imgThree": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b63c489.png",
      "imgFour": "",
      "videoLink": "",
      rating:1

   },
  {
      "id":  5 ,
      "title": "CARLENE DINING TABLE",
      "titleAr": "",
      "description": "The piece shown in the image is a rectangular dining table with a modern and simple design. The table features a wide wooden top in a light color, giving it a natural and warm appearance. The table legs are made of wood and have a straight and elegant design, providing a strong and stable base for the table. The table's simple and elegant design makes it suitable for placing in the dining room or dining area to add a touch of elegance and functionality.\n\n",
       "originalPrice": "5000.00",
      "discountedPrice": "4700.00",
      "discount":  0 ,
      "availability": "In stock",
      "categoryId": "2",
      "subCategoryId":  1 ,
      "imgOne": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b63fcbe.png",
      "imgTwo": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b643474.png",
      "imgThree": "https://lugarstore.com/uploads/2025-02-17_13-12-22_67b335b6471cc.png",
      "imgFour": "",
      "videoLink": "",
      rating:1

   }
  ];

getProductById(id:any){

  this._productService.getProduct(id).subscribe(res=>{
    this.product= res
    if (this.product && this.product.images.length) {
      this.selectedImage = this.product.images[0];
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
console.log('Added to cart:', this.product?.title);
}

compare() {
// Compare logic
console.log('Compare product:', this.product?.title);
}

}
