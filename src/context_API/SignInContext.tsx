import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

type SignInData = { email: string; password: string };
type ResponseData = {
  token: string;
  user: { role: { role_type: string }; username: string };
};

type SignInContextType = {
  loading: boolean;
  signIn: (data: SignInData) => void;
  roleType: string | null;
};

const SignInContext = createContext<SignInContextType | undefined>(undefined);

export const SignInProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [roleType, setRoleType] = useState<string | null>(
    localStorage.getItem("roleType")
  );

  useEffect(() => {
    const storedRoleType = localStorage.getItem("roleType");
    if (storedRoleType) setRoleType(storedRoleType);
  }, []);

  const mutation: UseMutationResult<ResponseData, Error, SignInData> =
    useMutation({
      mutationFn: async (data: SignInData) => {
        const response = await axios.post<ResponseData>(
          "https://user-product-api.vercel.app/api/auth/login",
          data
        );
        return response.data;
      },
      onSuccess: (responseData) => {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("roleType", responseData.user.role.role_type);
        localStorage.setItem("username", responseData.user.username);
        setRoleType(responseData.user.role.role_type);

        // Navigate based on role_type
        
        if (responseData.user.role.role_type === "CUSTOMER") {
          navigate("/user-landing-page");
          window.location.reload();
        } else if (responseData.user.role.role_type === "SUPER_ADMIN") {
          navigate("/super/admin/products");
        } else if (responseData.user.role.role_type === "PARTNER") {
          navigate("/partner/dashboard");
        } else if (responseData.user.role.role_type === "ADMIN") {
          navigate("/admin/usermanagement");
        }

        toast.success("Login successful!");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
        console.error("Error during login:", error);
      },
    });

  const loading = mutation.status === "pending";

  return (
    <SignInContext.Provider
      value={{ loading, signIn: mutation.mutate, roleType }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export const useSignIn = () => {
  const context = useContext(SignInContext);
  if (!context)
    throw new Error("useSignIn must be used within a SignInProvider");
  return context;
};