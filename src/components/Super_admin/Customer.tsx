import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Customer {
  _id: string;
  username: string;
  email: string;
  phone: number;
  address: string;
  profileImage?: string;
}

const Customer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");

  // Fetch customers from API if token exists
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!token) {
        console.warn("No token found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://user-product-api.vercel.app/api/admin/all-customers", {
          headers: {
            Authorization: token, // Use the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        setCustomers(data); // Assuming the API returns an array of customers
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);


  const columns: GridColDef<Customer>[] = [
    { field: "username", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email ID", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
  ];

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px", height: "85vh" }}>
      <Box m="20px">
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          <Box>
          </Box>
        </Box>

        <Box mt={3} sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={customers}
            columns={columns}
            // checkboxSelection
            getRowId={(row) => row._id}
            loading={loading}
            style={{ height: "70vh" }}
            sx={{      
              "& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions": {
                margin: 0,
              },
              "& .MuiTablePagination-selectLabel": {
                paddingTop: "1rem", 
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Customer;
