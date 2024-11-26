import React, { createContext, useContext } from "react";
import axios from "axios";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type SignUpContextType = {
  signUp: UseMutateFunction<any, unknown, SignUpFormData, unknown>;
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

const api = axios.create({
  baseURL: "https://user-product-api.vercel.app/api",
});

export const SignUpProvider = ({ children } :{children:React.ReactNode}) => {
  const navigate = useNavigate();

  const { mutate: signUp } = useMutation<any, unknown, SignUpFormData, unknown>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Signup successful! Please Sign In Again");
      navigate("/");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(`Signup failed: ${message}`);
    },
  });

  return (
    <SignUpContext.Provider value={{ signUp }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
