import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: {
    image: string;
  };
  qty: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  incrementQty: (productId: string) => void; 
  decrementQty: (productId: string) => void; 
  clearCart:()=>void
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }]; 
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((product) => product._id !== productId));
  };

  const incrementQty = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product._id === productId ? { ...product, qty: product.qty + 1 } : product
      )
    );
  };

  const decrementQty = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product._id === productId && product.qty > 1
          ? { ...product, qty: product.qty - 1 }
          : product
      )
    );
  };

  const clearCart=()=>{
      setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementQty, decrementQty,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
