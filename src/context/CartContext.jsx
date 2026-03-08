'use client'; // Required for Client-side hooks and localStorage

import React, { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Add item logic
const addToCart = (product, quantity) => {
  let alreadyExists = false;

  setCartItems(prevItems => {
    const isExist = prevItems.find(item => item._id === product._id);
    if (isExist) {
      alreadyExists = true;
      return prevItems.map(item => 
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    }
    alreadyExists = false;
    return [...prevItems, { ...product, quantity }];
  });

  if (alreadyExists) {
    toast.success(`Increased ${product.name} quantity`, { id: product._id });
  } else {
    toast.success(`${product.name} added to cart`, { id: product._id });
  }
};

  // Remove item logic
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter((item) => item._id !== id));
    toast.error("Removed from cart");
  };

  // Clear cart logic
  const clearCart = useCallback(() => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};