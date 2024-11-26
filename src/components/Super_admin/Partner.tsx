import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, CircularProgress, TextField } from "@mui/material";

interface Partner {
  _id: string;
  username: string;
  email: string;
  phone: number;
  address: string;
  profileImage: string;
  isActive: boolean;
}

const fetchPartners = async (): Promise<Partner[]> => {

  const token = localStorage.getItem("token");

  const config = token
    ? {
        headers: {
          Authorization: token, 
        },
      }
    : {};

  try {
    const response = await axios.get(
      "https://user-product-api.vercel.app/api/admin/all-partners",
      config
    );
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Unauthorized: Please login to continue.");
    }
    throw error;
  }
};

const Partner = () => {
  const { data, isLoading, error } = useQuery<Partner[], Error>({
    queryKey: ["partners"], 
    queryFn: fetchPartners,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  const rows = data?.map((partner) => ({
    id: partner._id,
    username: partner.username,
    email: partner.email,
    phone: partner.phone,
    address: partner.address,
    profileImage: partner.profileImage,
    isActive: partner.isActive,
  })) || [];

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "isActive", headerName: "Active", width: 100 },
  ];

  return (

    <div className="card shadow border-0 p-3 mt-5 m-4" style={{marginTop:"20px", height : "85vh"}}>
    <Box m="20px">
    <Box display="flex" alignItems="center" mb={2} justifyContent='space-between'>
      <Box >
        </Box>
      </Box>

      <Box mt={3} sx={{ height: 400, width: "100%" }}>
      <DataGrid
      style={{height : "70vh"}}
        rows={rows} 
        columns={columns}
        // checkboxSelection
        getRowId={(row) => row.id}
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

export default Partner;