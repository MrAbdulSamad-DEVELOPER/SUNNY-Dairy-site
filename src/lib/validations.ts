import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  customerPhone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+\s\-()]{10,20}$/, 'Invalid phone number format'),
  customerWhatsapp: z
    .string()
    .min(10, 'Please enter a valid WhatsApp number')
    .max(20, 'WhatsApp number is too long')
    .regex(/^[0-9+\s\-()]{10,20}$/, 'Invalid WhatsApp number format'),
  deliveryAddress: z
    .string()
    .min(5, 'Delivery address must be at least 5 characters')
    .max(300, 'Delivery address is too long'),
  city: z
    .string()
    .min(2, 'City is required')
    .max(50, 'City name is too long'),
  area: z
    .string()
    .min(2, 'Area / Neighbourhood is required')
    .max(100, 'Area name is too long'),
  deliveryInstructions: z
    .string()
    .max(500, 'Instructions too long')
    .optional()
    .nullable(),
  paymentMethod: z.enum([
    'ADVANCE_UBL',
    'DIRECT_WHATSAPP',
    'CASH_ON_DELIVERY',
    'WHATSAPP_CONFIRMATION',
  ]),
  senderName: z.string().max(150).optional().nullable(),
  transactionReference: z.string().max(150).optional().nullable(),
  receiptImageUrl: z.string().max(500).optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product is required'),
        selectedVariant: z.string().min(1, 'Size is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Your cart is empty. Please add items before checking out.'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const adminSetupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type AdminSetupFormValues = z.infer<typeof adminSetupSchema>;

export const orderStatusUpdateSchema = z.object({
  orderStatus: z.enum([
    'PENDING',
    'PRICE_CONFIRMATION_REQUIRED',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  paymentStatus: z.enum(['PENDING', 'PAID', 'REFUNDED']).optional(),
  adminNotes: z.string().optional().nullable(),
  itemPrices: z.record(z.string(), z.number().nullable().optional()).optional(),
  deliveryCharges: z.number().min(0).optional(),
});
