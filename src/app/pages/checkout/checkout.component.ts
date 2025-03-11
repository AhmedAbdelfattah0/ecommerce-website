import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { CreateOrderRequest } from '../../models/ create-order';
import { Cart } from '../../models/cart';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { AddSpaceAfterCurrencyPipe } from '../../common/pipes/add-space-after-currency';

interface CheckoutItem {
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports:[FormsModule,CommonModule, FeaturesComponent,HeroComponent,AddSpaceAfterCurrencyPipe],
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
// Form fields
name: string = '';
phoneNumber: string = '';
address: string = '';
state: string = '';
email: string = '';
subtotal = 0;
total = 0;
// Example cart items
cartItems: Cart[] = [];

constructor(private orderService: OrderService, private router:Router, private _cartService:CartService) {
  effect(()=>{
    this.cartItems = this._cartService.shoppingCart();
    this.calculateTotals();
  })
}

ngOnInit(): void {
  // Initialize or fetch cart items if needed
}

placeOrder(): void {
  // Build the payload according to the required JSON schema
  const payload: CreateOrderRequest  = {
    name: this.name,
    phoneNumber: this.phoneNumber,
    address: this.address,
    state: this.state,
    statusId: 2,           // fixed or dynamic
    date: '0000-00-00',    // or use new Date().toISOString() if needed
    email: this.email,
    products: this.cartItems.map(item => ({
      productId: item.id,
      qty: item.qty
    }))
  };

  // Call the service to create the order
  this.orderService.createOrder(payload).subscribe({
    next: (response:any) => {
      // Order created successfully
       this.router.navigate(['/home'])
      // Possibly navigate to a confirmation page
    },
    error: (err:any) => {
      console.error('Error creating order:', err);
    }
  });
}


calculateTotals() {
  this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  // If you have shipping or taxes, add them to get total
  this.total = this.subtotal;
}
}
