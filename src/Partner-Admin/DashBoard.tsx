import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {  useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  published: boolean;
  image?: string;
}

interface NewProduct {
  name: string;
  description: string;
  price: number;
  rating: number;
  published: boolean;
  image: File | null;
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    price: 0,
    rating: 0,
    published: false,
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  console.log(token)

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: async () => {
      try {
        const url = searchTerm
          ? `https://user-product-api.vercel.app/api/products/searchProduct?name=${searchTerm}`
          : `https://user-product-api.vercel.app/api/products`;

        const response = await axios.get<Product[]>(url, {
          headers: {
            Authorization: token,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: NewProduct) => {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("rating", product.rating.toString());
      formData.append("published", JSON.stringify(product.published));
      formData.append("image", product.image!);

      await axios.post("https://user-product-api.vercel.app/api/products/add", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: NewProduct) => {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("rating", product.rating.toString());
      formData.append("published", JSON.stringify(product.published));
      if (product.image) formData.append("image", product.image);

      await axios.put(`https://user-product-api.vercel.app/api/products/${selectedProductId}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://user-product-api.vercel.app/api/products/${id}`, {
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedProductId(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      rating: 0,
      published: false,
      image: null,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : name === "image" && files ? files[0] : value,
    }));
  };

  const handleCreateProduct = () => {
    createProductMutation.mutate(newProduct);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProductId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      rating: product.rating,
      published: product.published,
      image: null,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleUpdateProduct = () => {
    if (selectedProductId) {
      updateProductMutation.mutate(newProduct);
    }
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleSearch = () => {
    refetch();
  };

  const columns: GridColDef<Product>[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "rating", headerName: "Rating", type: "number", flex: 1 },
    { field: "published", headerName: "Published", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditProduct(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(params.row._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{marginTop:"20px"}}>
      <Box m="20px">
      <Box display="flex" alignItems="center" mb={2} justifyContent='space-between'>
        <Box >
          <TextField
            variant="outlined"
            label="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginRight: "8px" }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} style={{ height: "6vh" }}>
            Search
          </Button>
          </Box>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create Product
        </Button>
        </Box>
        
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="dense" variant="filled" label="Product Name" name="name" value={newProduct.name} onChange={handleChange} />
            <TextField fullWidth margin="dense" variant="filled" label="Description" name="description" value={newProduct.description} onChange={handleChange} />
            <TextField fullWidth margin="dense" variant="filled" label="Price" name="price" type="number" value={newProduct.price} onChange={handleChange} />
            <TextField fullWidth margin="dense" variant="filled" label="Rating" name="rating" type="number" value={newProduct.rating} onChange={handleChange} />
            <TextField fullWidth margin="dense" variant="filled" type="file" name="image" onChange={handleChange} />
            <FormControlLabel
              control={<Checkbox checked={newProduct.published} onChange={(e) => setNewProduct({ ...newProduct, published: e.target.checked })} />}
              label="Published"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={isEditing ? handleUpdateProduct : handleCreateProduct} color="primary">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box mt={3} sx={{ height: 400, width: "100%" }}>
          <DataGrid rows={products} columns={columns} checkboxSelection getRowId={(row) => row._id}/>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;

















































// import React from "react";
// import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// const DashBoard: React.FC = () => {
//   const rows = [
//     { id: 1, name: "John Doe", gender: "Male", status: "Active", createdDate: "2024-11-05" },
//     { id: 2, name: "Jane Smith", gender: "Female", status: "Inactive", createdDate: "2024-10-15" },
//     { id: 3, name: "Alice Johnson", gender: "Female", status: "Active", createdDate: "2024-09-22" },
//   ];

//   return (
//     <Box sx={{ width:"100vw", marginLeft:"16%" }}>
//       <TableContainer component={Paper} elevation={3}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Gender</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Created Date</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.gender}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//                 <TableCell>{row.createdDate}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default DashBoard;
