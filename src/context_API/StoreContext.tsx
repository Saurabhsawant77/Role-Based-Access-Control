import React from "react";
import { SignUpProvider } from "./SignUpContext"; 
import { SignInProvider } from "./SignInContext";
import { UserProductDataProvider } from "./UserProductDataContext";
import { CartProvider } from "./CartContext";
type StoreProps = {
  children: React.ReactNode;
};

const Store = ({ children }: StoreProps) => {
  return (
    <SignUpProvider>
      <SignInProvider>
       <UserProductDataProvider>
      <CartProvider>


        {children}
      </CartProvider>

         
       </UserProductDataProvider>
      </SignInProvider>
    </SignUpProvider>
  );
};

export default Store;
