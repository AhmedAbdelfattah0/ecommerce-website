export interface CustomizationOrder {
  productId?: number;
  productTitle?: string;
  materials: string;
  colorHex: string;
  colorName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dimensions: Dimensions;
  engravingText?: string;
  assemblyRequired: boolean;
  additionalAddOns: string[];
  referenceImages: string[];
  customerNotes?: string;
  measurementAppointment?: MeasurementAppointment;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: 'cm' | 'inch';
  notes?: string;
}

export interface MeasurementAppointment {
  date: Date;
  timeSlot: string;
  address: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

export interface MaterialOption {
  id: number;
  name: string;
  category: string;
  pricePerUnit: number;
  unitOfMeasure: string;
  color: string;
  colorHex: string;
  inStock: boolean;
  thumbnail: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hexCode: string;
}

export interface AddOnOption {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface SelectedMaterial {
  materialId: number;
  materialName: string;
  quantity: number;
  colorHex?: string;
}

export interface SelectedAddOn {
  addOnId: number;
  addOnName: string;
  quantity: number;
}

export interface CustomOrderItem {
  id?: number;
  itemName: string;
  itemType: string;
  quantity: number;
  hasCustomDimensions: boolean;
  dimensions?: Dimensions;
  measurementAppointment?: MeasurementAppointment;
  materials: SelectedMaterial[];
  addOns: SelectedAddOn[];
  referenceImageUrl?: string;
  notes?: string;
  engraving?: string;
  itemDescription?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomOrder {
  id?: number;
  customerInfo: CustomerInfo;
  items: CustomOrderItem[];
  deliveryMethod: 'standard' | 'express';
  assemblyOption?: 'self' | 'pre-assembled';
  deliveryFee?: number;
  totalAmount?: number;
  orderDate?: Date;
  status?: 'draft' | 'submitted' | 'processing' | 'completed';
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OrderResponse extends ApiResponse {
  orderId?: number;
  trackingCode?: string;
}

export interface SavedCustomizationResponse extends ApiResponse {
  data?: {
    saveCode?: string;
    orderData?: CustomOrder;
  };
}

export interface UploadResponse extends ApiResponse {
  filePath?: string;
}

export interface MeasurementAppointmentResponse extends ApiResponse {
  data?: {
    appointmentId?: number;
    trackingCode?: string;
  };
}

export interface TrackingInfo {
  trackingCode: string;
  status: string;
  lastUpdated: Date;
  estimatedDelivery?: Date;
  details: {
    date: Date;
    status: string;
    location?: string;
    description: string;
  }[];
}
