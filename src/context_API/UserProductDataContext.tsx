import React, { createContext, useContext } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

type Product = {
  _id: string;
  name: string;
  description: string;
  image: {
    image:string
  };
  price: number;
  rating: number;
};

type UserProductDataContextType = {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

const UserProductDataContext = createContext<UserProductDataContextType | undefined>(undefined);

export const UserProductDataProvider = ({ children }:{children:React.ReactNode}) => {
  
  const { data, isLoading, isError }: UseQueryResult<{ published: Product[] }, Error> = useQuery({
    queryKey: ['userProducts'],
    queryFn: async () => {
      const response = await axios.get<{ published: Product[] }>('https://user-product-api.vercel.app/api/customer/products',{
        headers:{
          Authorization:`${localStorage.getItem("token")}`
        }
      });
      return response.data;
    },
  });


  return (
    <UserProductDataContext.Provider value={{ products: data?.published, isLoading, isError }}>
      {children}
    </UserProductDataContext.Provider>
  );
};

export const useUserProductData = (): UserProductDataContextType => {
  const context = useContext(UserProductDataContext);
  if (!context) {
    throw new Error('useUserProductData must be used within a UserProductDataProvider');
  }
  return context;
};
