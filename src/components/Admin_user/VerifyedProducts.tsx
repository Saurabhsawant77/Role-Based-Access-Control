import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Height } from "@mui/icons-material";

interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  isVerified: boolean;
  published: boolean;
  image?: string;
  email?: string;
  phone_number?: string;
  address?: string;
}

const Admin_Verifying_Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const token = localStorage.getItem("token");
  const apiUrl = "https://user-product-api.vercel.app/api/admin";

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image_details?.image}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "rating", headerName: "Rating", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={2} marginTop="5px">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenVerifyDialog(params.row._id)}
          >
            Verify
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "darkred" },
            }}
            onClick={() => handleOpenRejectDialog(params.row._id)}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/verfyingproducts/`, {
        headers: {
          Authorization: token,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleVerifyProduct = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/verify-product/${selectedProductId}`,
        { isVerified: true },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Product verified:", response.data.data);
      fetchProducts();
      toast.success("Product successfully verified!");
      handleCloseDialogs();
    } catch (error) {
      console.error("Error verifying product:", error);
      toast.error("Failed to verify product.");
    }
  };

  const handleRejectProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/verify-product/${selectedProductId}`,
        { isDenied: true },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Product rejected:", response.data);
      fetchProducts();
      toast.success("Product rejected!");
      handleCloseDialogs();
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error("Failed to reject product.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerifyDialog = (productId: number) => {
    setSelectedProductId(productId);
    setIsVerifyDialogOpen(true);
  };

  const handleOpenRejectDialog = (productId: number) => {
    setSelectedProductId(productId);
    setIsRejectDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setSelectedProductId(null);
    setIsVerifyDialogOpen(false);
    setIsRejectDialogOpen(false);
  };

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px",height:"85vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Box m="20px">
        <Box mt={3} sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            sx={{
              "& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions": {
                margin: 0,
              },
              "& .MuiTablePagination-selectLabel": {
                paddingTop: "1rem", 
              },
            }}
            loading={loading}
            style={{height:"70vh"}}
          />
        </Box>
      </Box>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Verify Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to verify this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleVerifyProduct}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Reject Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to reject this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }} onClick={handleRejectProduct}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin_Verifying_Products;















// import React, { useEffect, useState } from "react";
// import { Box, Button, TextField } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface Product {
//   _id: number;
//   name: string;
//   description: string;
//   price: number;
//   rating: number;
//   isVerified: boolean;
//   published: boolean;
//   image?: string;
//   email?: string;
//   phone_number?: string;
//   address?: string;
// }

// const Admin_Verifying_Products = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
//   const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
//   const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
//   console.log(products)
 
//   const [loading, setLoading] = useState<boolean>(true);
//   const token = localStorage.getItem("token");
//   const apiUrl = "https://user-product-api.vercel.app/api/admin"; 

 
//   const columns: GridColDef[] = [
//     {
//       field: "image",
//       headerName: "Image",
//       width: 100,
//       renderCell: (params) => (
//         <img
//           src={params.row.image_details?.image}
//           alt={params.row.name}
//           style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "4px" }}
//         />
//       ),
//     },
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "price", headerName: "Price", type: "number", flex: 1 },
//     { field: "rating", headerName: "Rating", type: "number", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 200,
//       renderCell: (params) => (
//         <Box display="flex" gap={2} marginTop="5px">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleVerifyProduct(params.row._id)}
//           >
//             Verify
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "red", color: "white", "&:hover": { backgroundColor: "darkred" } }}
//             onClick={() => handleRejectProduct(params.row._id)}
//           >
//             Reject
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   // Fetch products from the API
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${apiUrl}/verfyingproducts/`, {
//         headers: {
//           Authorization: token,
//         },
//       });
//       setProducts(response.data.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleVerifyProduct = async (productId: number) => {
//     try {
//       const response = await axios.put(
//         `${apiUrl}/verify-product/${productId}`,
//         {isVerified: true},
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       console.log("Product verified:", response.data.data);
//       fetchProducts();
//       toast.success("Product successfully verified!");
//     } catch (error) {
//       console.error("Error verifying product:", error);
//       toast.error("Failed to verify product.");
//     }
//   };

//     // Function to handle rejecting the product
//     const handleRejectProduct = async (productId: string) => {
//       setLoading(true); 
//       try {
//         const response = await axios.put(
//           `${apiUrl}/verify-product/${productId}`,
//           {isDenied: true},
//           {
//             headers: {
//               Authorization: token,
//             },
//           }
//         );
//         console.log("Product rejected:", response.data);
//         fetchProducts();
//         toast.success("Product rejected!");
//       } catch (error) {
//         console.error("Error rejecting product:", error);
//         toast.error("Failed to reject product.");

//       } finally {
//         setLoading(false);
//       }
//     };

//   return (
//     <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px" }}>
//       <Box m="20px">
//         <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
//           <Box>
//           </Box>
//         </Box>

//         <Box mt={3} sx={{ height: 400, width: "100%" }}>
//           <DataGrid
//             rows={products}
//             columns={columns}
//             // checkboxSelection
//             getRowId={(row) => row._id}
//             loading={loading}
//             sx={{
//               "& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions": {
//                 margin: 0,
//               },
//               "& .MuiTablePagination-selectLabel": {
//                 paddingTop: "1rem", 
//               },
//             }}
//           />
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default Admin_Verifying_Products;