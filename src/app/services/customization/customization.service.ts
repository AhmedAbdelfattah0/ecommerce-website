import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import {
  MaterialOption,
  AddOnOption,
  CustomOrder,
  CustomOrderItem,
  MeasurementAppointment,
  ApiResponse,
  OrderResponse,
  SavedCustomizationResponse,
  UploadResponse,
  MeasurementAppointmentResponse,
  CustomerInfo
} from '../../models/order-customization';

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {
  private apiUrl = environment.apiUrl;
  private currentOrderSubject = new BehaviorSubject<CustomOrder | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  constructor(private http: HttpClient) {
    // Try to restore current order from localStorage on service initialization
    this.loadOrderFromStorage();
  }

  /**
   * Initialize a new custom order
   */
  initNewOrder(customerInfo?: CustomerInfo): void {
    const newOrder: CustomOrder = {
      customerInfo: customerInfo || {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      items: [],
      deliveryMethod: 'standard',
      deliveryFee: 0,
      totalAmount: 0,
      status: 'draft'
    };

    this.currentOrderSubject.next(newOrder);
    this.saveOrderToStorage();
  }

  /**
   * Update customer information for the current order
   */
  updateCustomerInfo(customerInfo: CustomerInfo): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      currentOrder.customerInfo = customerInfo;
      this.currentOrderSubject.next(currentOrder);
      this.saveOrderToStorage();
    }
  }

  /**
   * Get available material options
   */
  getMaterialOptions(): Observable<MaterialOption[]> {
    return this.http.get<ApiResponse>(`/materials/get_materials.php`)
      .pipe(
        map(response => (response?.data || []) as MaterialOption[]),
        catchError(this.handleError<MaterialOption[]>('getMaterialOptions', [
          {
            id: 1,
            name: 'Oak Wood',
            category: 'wood',
            pricePerUnit: 250,
            unitOfMeasure: 'sq.m',
            color: 'Natural Oak',
            colorHex: '#D4B48C',
            inStock: true,
            thumbnail: 'assets/images/materials/oak.jpg'
          },
          {
            id: 2,
            name: 'Walnut Wood',
            category: 'wood',
            pricePerUnit: 320,
            unitOfMeasure: 'sq.m',
            color: 'Dark Brown',
            colorHex: '#5C4033',
            inStock: true,
            thumbnail: 'assets/images/materials/walnut.jpg'
          },
          {
            id: 3,
            name: 'Italian Leather',
            category: 'leather',
            pricePerUnit: 450,
            unitOfMeasure: 'sq.m',
            color: 'Tan',
            colorHex: '#D2B48C',
            inStock: true,
            thumbnail: 'assets/images/materials/leather-tan.jpg'
          },
          {
            id: 4,
            name: 'Brushed Steel',
            category: 'metal',
            pricePerUnit: 180,
            unitOfMeasure: 'linear m',
            color: 'Silver',
            colorHex: '#C0C0C0',
            inStock: true,
            thumbnail: 'assets/images/materials/steel.jpg'
          },
          {
            id: 5,
            name: 'Tempered Glass',
            category: 'glass',
            pricePerUnit: 200,
            unitOfMeasure: 'sq.m',
            color: 'Clear',
            colorHex: '#FFFFFF',
            inStock: true,
            thumbnail: 'assets/images/materials/glass.jpg'
          }
        ]))
      );
  }

  /**
   * Get available add-on options
   */
  getAddOnOptions(): Observable<AddOnOption[]> {
    return this.http.get<ApiResponse>(`/addons/get_addons.php`)
      .pipe(
        map(response => (response?.data || []) as AddOnOption[]),
        catchError(this.handleError<AddOnOption[]>('getAddOnOptions', [
          {
            id: 1,
            name: 'Extra Drawer',
            description: 'Add a spacious drawer with soft-closing mechanism',
            price: 120,
            category: 'storage',
            inStock: true
          },
          {
            id: 2,
            name: 'LED Lighting',
            description: 'Integrated LED lights with remote control',
            price: 150,
            category: 'lighting',
            inStock: true
          },
          {
            id: 3,
            name: 'Premium Handles',
            description: 'Handcrafted metal handles for a luxury touch',
            price: 80,
            category: 'hardware',
            inStock: true
          },
          {
            id: 4,
            name: 'Glass Shelf',
            description: 'Additional tempered glass shelf',
            price: 95,
            category: 'storage',
            inStock: true
          },
          {
            id: 5,
            name: 'Cable Management',
            description: 'Hidden cable routing system',
            price: 60,
            category: 'utility',
            inStock: true
          }
        ]))
      );
  }

  /**
   * Add a new item to the order
   */
  addOrderItem(item: CustomOrderItem): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      currentOrder.items.push(item);
      this.updateOrderTotals();
      this.currentOrderSubject.next(currentOrder);
      this.saveOrderToStorage();
    }
  }

  /**
   * Remove an item from the order
   */
  removeOrderItem(index: number): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder && index >= 0 && index < currentOrder.items.length) {
      currentOrder.items.splice(index, 1);
      this.updateOrderTotals();
      this.currentOrderSubject.next(currentOrder);
      this.saveOrderToStorage();
    }
  }

  /**
   * Update an existing item
   */
  updateOrderItem(index: number, updatedItem: CustomOrderItem): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder && index >= 0 && index < currentOrder.items.length) {
      currentOrder.items[index] = updatedItem;
      this.updateOrderTotals();
      this.currentOrderSubject.next(currentOrder);
      this.saveOrderToStorage();
    }
  }

  /**
   * Update order totals
   */
  private updateOrderTotals(): void {
    const currentOrder = this.currentOrderSubject.value;
    if (!currentOrder) return;

    let totalAmount = 0;

    // Sum up all item prices
    currentOrder.items.forEach(item => {
      totalAmount += 0;
    });

    // Add delivery fee
    totalAmount += currentOrder.deliveryFee || 0;

    // Update order total
    currentOrder.totalAmount = totalAmount;
  }

  /**
   * Update delivery method and recalculate totals
   */
  updateDeliveryMethod(method: 'standard' | 'express', fee: number): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      currentOrder.deliveryMethod = method;
      currentOrder.deliveryFee = fee;
      this.updateOrderTotals();
      this.currentOrderSubject.next(currentOrder);
      this.saveOrderToStorage();
    }
  }

  /**
   * Schedule a measurement appointment
   */
  scheduleMeasurementAppointment(
    appointment: MeasurementAppointment,
    itemIndex: number
  ): Observable<MeasurementAppointmentResponse> {
    const currentOrder = this.currentOrderSubject.value;
    if (!currentOrder || !currentOrder.items[itemIndex]) {
      return of({
        success: false,
        message: 'Invalid order or item'
      });
    }

    // Update item with appointment details
    currentOrder.items[itemIndex].measurementAppointment = appointment;
    currentOrder.items[itemIndex].hasCustomDimensions = false;

    this.currentOrderSubject.next(currentOrder);
    this.saveOrderToStorage();
    // Make API call to schedule appointment
    return this.http.post<MeasurementAppointmentResponse>(
      `/appointments/schedule.php`,
      {
        orderId: currentOrder.id,
        itemIndex,
        appointment
      },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      catchError(this.handleError<MeasurementAppointmentResponse>('scheduleMeasurementAppointment', {
        success: false,
        message: 'Error scheduling appointment'
      }))
    );
  }

  /**
   * Submit the entire order
   */
  submitOrder(order: CustomOrder): Observable<OrderResponse> {
    const currentOrder = this.currentOrderSubject.value || order;
    if (!currentOrder) {
      return of({
        success: false,
        message: 'No order to submit'
      });
    }

    return this.http.post<OrderResponse>(
      `/orders/create_custom_order.php`,
      currentOrder,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap((response:any) => {
        if (response.success) {
          // Clear the current order
          this.clearCurrentOrder();
        }
      }),
      catchError(this.handleError<OrderResponse>('submitOrder', {
        success: false,
        message: 'Error submitting order'
      }))
    );
  }

  /**
   * Save customization for later
   */
  saveCustomizationForLater(order: CustomOrder): Observable<SavedCustomizationResponse> {
    const currentOrder = this.currentOrderSubject.value || order;
    if (!currentOrder) {
      return of({
        success: false,
        message: 'No customization to save'
      });
    }

    return this.http.post<SavedCustomizationResponse>(
      `/orders/save_customization.php`,
      currentOrder,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap((response:any) => {
        if (response.success && response.data?.saveCode) {
          // Save the code to localStorage
          localStorage.setItem('savedCustomizationCode', response.data.saveCode);
        }
      }),
      catchError(this.handleError<SavedCustomizationResponse>('saveCustomizationForLater', {
        success: false,
        message: 'Error saving customization'
      }))
    );
  }

  /**
   * Load a saved customization
   */
  loadSavedCustomization(saveCode: string): Observable<SavedCustomizationResponse> {
    return this.http.get<SavedCustomizationResponse>(
      `/orders/get_saved_customization.php?code=${saveCode}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap((response: any) => {
        if (response.success && response.data?.orderData) {
          this.currentOrderSubject.next(response.data.orderData);
          this.saveOrderToStorage();
        }
      }),
      catchError(this.handleError<SavedCustomizationResponse>('loadSavedCustomization', {
        success: false,
        message: 'Error loading saved customization'
      }))
    );
  }

  /**
   * Clear the current order
   */
  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
    localStorage.removeItem('currentCustomOrder');
  }

  /**
   * Upload a reference image
   */
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `/uploads/upload_reference_image.php`,
      formData
    ).pipe(
      catchError(this.handleError<UploadResponse>('uploadImage', {
        success: false,
        message: 'Error uploading image'
      }))
    );
  }

  /**
   * Load current order from localStorage
   */
  private loadOrderFromStorage(): void {
    const savedOrder = localStorage.getItem('currentCustomOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        this.currentOrderSubject.next(order);
      } catch (error) {
        console.error('Error loading saved order', error);
        localStorage.removeItem('currentCustomOrder');
      }
    }
  }

  /**
   * Save current order to localStorage
   */
  private saveOrderToStorage(): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      localStorage.setItem('currentCustomOrder', JSON.stringify(currentOrder));
    }
  }

  /**
   * Error handler
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
