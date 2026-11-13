export const OFFICIAL_WHATSAPP_NUMBER = '96895234002';
export const OFFICIAL_PHONE_NUMBER = '03449322930';
export const OFFICIAL_EMAIL = 'sanaullah.ccs@gmail.com';
export const OFFICIAL_STORE_NAME = 'SUNNY Dairy';
export const OFFICIAL_STORE_OWNER = 'Sanaullah';

export const OFFICIAL_UBL_BANK_NAME = 'United Bank Limited (UBL)';
export const OFFICIAL_UBL_ACCOUNT_NUMBER = '236525896';
export const OFFICIAL_UBL_ACCOUNT_TITLE = 'Sanaullah and islamuddin';

/**
 * Builds a clean WhatsApp direct order / inquiry message
 */
export function generateWhatsAppOrderMessage(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  deliveryAddress: string;
  city: string;
  area: string;
  deliveryInstructions?: string | null;
  paymentMethod?: string;
  senderName?: string | null;
  transactionReference?: string | null;
  items: Array<{
    productNameSnapshot: string;
    selectedVariant: string;
    quantity: number;
    unitPriceSnapshot?: number | null;
    priceConfirmationRequired?: boolean;
  }>;
  subtotal: number;
  deliveryCharges?: number;
  finalTotal?: number | null;
  priceConfirmationRequired?: boolean;
  storeName?: string;
}): string {
  const storeName = order.storeName || OFFICIAL_STORE_NAME;

  let msg = `*Hello ${storeName}!* 👋\n\n`;
  msg += `I would like to confirm my order: *#${order.orderNumber}*\n\n`;
  msg += `*Customer Details:*\n`;
  msg += `• Name: ${order.customerName}\n`;
  msg += `• Phone: ${order.customerPhone}\n`;
  if (order.customerWhatsapp && order.customerWhatsapp !== order.customerPhone) {
    msg += `• WhatsApp: ${order.customerWhatsapp}\n`;
  }
  msg += `• Address: ${order.deliveryAddress}, ${order.area}, ${order.city}\n`;
  if (order.deliveryInstructions) {
    msg += `• Delivery Note: ${order.deliveryInstructions}\n`;
  }

  msg += `\n*Products:*\n`;
  order.items.forEach((item) => {
    const isUnpriced =
      item.priceConfirmationRequired ||
      item.unitPriceSnapshot === null ||
      item.unitPriceSnapshot === undefined;
    const priceText = isUnpriced
      ? 'Price to be confirmed'
      : `Rs. ${(item.unitPriceSnapshot! * item.quantity).toLocaleString()}`;

    msg += `• ${item.productNameSnapshot} — ${item.selectedVariant} — Qty ${item.quantity} — ${priceText}\n`;
  });

  msg += `\n*Order Summary:*\n`;
  if (order.subtotal > 0) {
    msg += `• Confirmed Subtotal: *Rs. ${order.subtotal.toLocaleString()}*\n`;
  }
  if (order.deliveryCharges && order.deliveryCharges > 0) {
    msg += `• Delivery Fee: *Rs. ${order.deliveryCharges.toLocaleString()}*\n`;
  }
  if (order.finalTotal !== null && order.finalTotal !== undefined) {
    msg += `• Final Total: *Rs. ${order.finalTotal.toLocaleString()}*\n`;
  }
  if (order.priceConfirmationRequired) {
    msg += `• _Includes items requiring morning batch price confirmation_\n`;
  }

  msg += `\n*Payment Information:*\n`;
  if (order.paymentMethod === 'ADVANCE_UBL') {
    msg += `• Method: *Advance Payment (UBL Bank Transfer)*\n`;
    msg += `• Bank: ${OFFICIAL_UBL_BANK_NAME}\n`;
    msg += `• Account: *${OFFICIAL_UBL_ACCOUNT_NUMBER}*\n`;
    if (order.senderName) {
      msg += `• Sender Name: ${order.senderName}\n`;
    }
    if (order.transactionReference) {
      msg += `• Transaction Ref / TID: *${order.transactionReference}*\n`;
    }
    msg += `• Status: _Payment Submitted — Under Manual Verification_\n`;
  } else {
    msg += `• Method: *Direct WhatsApp Order*\n`;
    msg += `• Status: _Awaiting Confirmation on WhatsApp_\n`;
  }

  msg += `\nPlease confirm availability and morning dispatch. Thank you!`;

  return msg;
}

/**
 * Generates the wa.me URL
 */
export function getWhatsAppUrl(message: string, overrideNumber?: string): string {
  const rawNumber = overrideNumber || OFFICIAL_WHATSAPP_NUMBER;
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
