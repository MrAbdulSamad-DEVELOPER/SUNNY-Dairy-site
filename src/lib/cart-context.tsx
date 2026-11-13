'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedVariant: string) => void;
  updateQuantity: (productId: string, selectedVariant: string, quantity: number) => void;
  updateVariant: (
    productId: string,
    oldVariant: string,
    newVariant: string,
    newPrice: number | null,
    newPriceType: 'CONFIRMED' | 'ON_REQUEST'
  ) => void;
  clearCart: () => void;
  totalItemCount: number;
  confirmedSubtotal: number;
  hasPendingPriceItems: boolean;
  pendingItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sunny_dairy_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage upon mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cart storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.selectedVariant === newItem.selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, selectedVariant: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const updateQuantity = (productId: string, selectedVariant: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, selectedVariant);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedVariant === selectedVariant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateVariant = (
    productId: string,
    oldVariant: string,
    newVariant: string,
    newPrice: number | null,
    newPriceType: 'CONFIRMED' | 'ON_REQUEST'
  ) => {
    setItems((prev) => {
      // Check if target variant already exists
      const targetExisting = prev.find(
        (i) => i.productId === productId && i.selectedVariant === newVariant
      );
      const currentItem = prev.find(
        (i) => i.productId === productId && i.selectedVariant === oldVariant
      );

      if (!currentItem) return prev;

      if (targetExisting && oldVariant !== newVariant) {
        // Merge quantities and remove old
        return prev
          .filter((i) => !(i.productId === productId && i.selectedVariant === oldVariant))
          .map((i) =>
            i.productId === productId && i.selectedVariant === newVariant
              ? { ...i, quantity: i.quantity + currentItem.quantity }
              : i
          );
      }

      // Just update variant & price
      return prev.map((item) =>
        item.productId === productId && item.selectedVariant === oldVariant
          ? {
              ...item,
              selectedVariant: newVariant,
              price: newPrice,
              priceType: newPriceType,
            }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const confirmedSubtotal = items.reduce((sum, item) => {
    if (item.price !== null && item.priceType === 'CONFIRMED') {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  const pendingItemCount = items.filter(
    (item) => item.price === null || item.priceType === 'ON_REQUEST'
  ).reduce((sum, item) => sum + item.quantity, 0);

  const hasPendingPriceItems = pendingItemCount > 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateVariant,
        clearCart,
        totalItemCount,
        confirmedSubtotal,
        hasPendingPriceItems,
        pendingItemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
