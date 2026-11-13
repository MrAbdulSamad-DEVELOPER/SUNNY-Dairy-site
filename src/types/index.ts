export type PriceType = 'CONFIRMED' | 'ON_REQUEST';

export interface ProductVariantDTO {
  id: string;
  productId: string;
  size: string;
  price: number | null;
  priceType: PriceType;
  isAvailable: boolean;
  stock?: number;
}

export interface ProductImageDTO {
  id: string;
  productId: string;
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  categoryId: string;
  category?: CategoryDTO;
  imageUrl: string;
  sku?: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  expiryDate?: string | Date | null;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants: ProductVariantDTO[];
  images?: ProductImageDTO[];
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  imageUrl: string;
  selectedVariant: string;
  price: number | null; // null for Price on Request
  priceType: PriceType;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PRICE_CONFIRMATION_REQUIRED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'ADVANCE_UBL'
  | 'DIRECT_WHATSAPP'
  | 'CASH_ON_DELIVERY'
  | 'WHATSAPP_CONFIRMATION';

export type PaymentStatus =
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'PENDING'
  | 'PAID'
  | 'REFUNDED';

export interface PaymentDTO {
  id: string;
  orderId: string;
  order?: OrderDTO;
  paymentMethod: string;
  amount: number;
  senderName?: string | null;
  transactionReference?: string | null;
  receiptImageUrl?: string | null;
  paymentStatus:
    | 'AWAITING_PAYMENT'
    | 'PAYMENT_SUBMITTED'
    | 'UNDER_VERIFICATION'
    | 'VERIFIED'
    | 'REJECTED';
  verificationTimestamp?: string | Date | null;
  verifiedBy?: string | null;
  adminNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItemDTO {
  id: string;
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  selectedVariant: string;
  quantity: number;
  unitPriceSnapshot: number | null;
  confirmedPrice: number | null;
  priceConfirmationRequired: boolean;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
  } | null;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  trackingCode?: string | null;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  city: string;
  area: string;
  deliveryInstructions?: string | null;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryCharges: number;
  discountAmount: number;
  couponCode?: string | null;
  finalTotal: number | null;
  priceConfirmationRequired: boolean;
  estimatedDeliveryTime?: string | null;
  cancellationRequested: boolean;
  cancellationReason?: string | null;
  adminNotes?: string | null;
  items: OrderItemDTO[];
  payments?: PaymentDTO[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DeliveryZoneDTO {
  id: string;
  areaName: string;
  city: string;
  deliveryFee: number;
  minOrderAmount: number;
  freeDeliveryThreshold?: number | null;
  estimatedMinutes: number;
  isActive: boolean;
}

export interface CmsSectionDTO {
  id: string;
  sectionKey: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  isEnabled: boolean;
  metadata?: string | null;
}

export interface ActivityLogDTO {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  adminUsername: string;
  createdAt: string | Date;
}
