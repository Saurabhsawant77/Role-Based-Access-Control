import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { DataGrid, GridColDef, GridSearchIcon } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  isVerified: boolean;
  image?: { image: string };
}

interface NewProduct {
  name: string;
  description: string;
  price: number;
  rating: number;
  isVerified: boolean;
  image: File | null;
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<NewProduct>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      rating: 0,
      isVerified: false,
      image: null,
    },
     mode: 'onChange' ,  
  });
  const token = localStorage.getItem("token");

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>("https://user-product-api.vercel.app/api/partner", {
          headers: { Authorization: token },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      } finally {
        setLoading(false);
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
      formData.append("isVerified", JSON.stringify(product.isVerified));
      formData.append("image", product.image!);

      await axios.post("https://user-product-api-gzwy.onrender.com/api/partner/add-product/", formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Product Created successfully!");
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
      formData.append("isVerified", JSON.stringify(product.isVerified));
      if (product.image) formData.append("image", product.image);

      await axios.put(`https://user-product-api.vercel.app/api/partner/updateProduct/${selectedProductId}`, formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Product Updated successfully!");
      refetch();
      handleClose();
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`https://user-product-api.vercel.app/api/partner/delete-product/${id}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: () => {
      toast.success("Product Deleted successfully!");
      refetch();
    },
  });
  const handleClickOpen = () => {
    // Reset the form when opening for a new product
    reset({
      name: "",
      description: "",
      price: 0,
      rating: 0,
      isVerified: false,
      image: null,
    });
    setOpen(true);
    setIsEditing(false); // Ensures this is for creating a new product
    setSelectedProductId(null); // Reset selected product
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedProductId(null);
  };
  const handleCreateProduct = (data: NewProduct) => {
    createProductMutation.mutate(data);
  };
  const handleEditProduct = (product: Product) => {
    setSelectedProductId(product._id);
    setIsEditing(true); // Set this to true to signify editing mode
    setOpen(true);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      rating: product.rating,
      isVerified: product.isVerified,
      image: null, // Keep image null for editing, as user might not want to upload a new one
    });
  }

  const handleUpdateProduct = (data: NewProduct) => {
    if (selectedProductId) {
      updateProductMutation.mutate(data);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProductIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (productIdToDelete) {
      deleteProductMutation.mutate(productIdToDelete);
    }
    setOpenDeleteDialog(false);
  };

  const cancelDelete = () => {
    setProductIdToDelete(null);
    setOpenDeleteDialog(false);
  };

  // const handleDeleteProduct = (id: number) => {
  //   deleteProductMutation.mutate(id);
  // };

  const handleSearch = () => {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredProducts;
  };

  const columns: GridColDef<Product>[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image?.image}
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
    <div
      className="card shadow border-0 p-3 mt-5 m-4"
      style={{ marginTop: "20px", height: "85vh" }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <Box m="20px">
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          <Box>
            <TextField
              size="small"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Create Product
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(isEditing ? handleUpdateProduct : handleCreateProduct)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Product Name is required",
                  pattern: {
                    value: /^[a-zA-Z0-9 ]*$/,
                    message: "Product Name should not contain special characters",
                  },
                  validate: {
                    noEmptySpaces: (value) =>
                      value.trim() !== "" || "Product Name cannot be empty spaces",
                  },
                  maxLength: { value: 10, message: "Product Name cannot exceed 10 characters" },

                 }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Product Name*"
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required",
                  validate: {
                    noEmptySpaces: (value) =>
                      value.trim() !== "" || "Description cannot be only empty spaces",
                  },
                 }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Description*"
                    {...field}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
              <Controller
                name="price"
                control={control}
                rules={{ required: "Price is required", min: { value: 0, message: "Price must be a positive number" } }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Price*"
                    type="number"
                    {...field}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
              <Controller
                name="rating"
                control={control}
                rules={{
                  required: "Rating is required",
                  min: { value: 0, message: "Rating cannot be negative" },
                  max: { value: 5, message: "Rating cannot exceed 5" },
                }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Rating*"
                    type="number"
                    {...field}
                    error={!!errors.rating}
                    helperText={errors.rating?.message}
                  />
                )}
              />
              <Controller
                name="image"
                control={control}
                rules={{ required: "Image is required" }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Image*"
                    type="file"
                    sx = {{
                      paddingTop : "12px"
                    }}
                    inputProps={{ accept: "image/*" }}
                    // onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0] || null; // Cast to HTMLInputElement
                      field.onChange(file); // Pass the file to the field
                    }}
                    error={!!errors.image}
                    helperText={errors.image?.message}
                  />
                )}
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary" variant="contained" disabled={!isValid}>
                  {isEditing ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>

       {/* Delete Confirmation Dialog */}
       <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this product?</DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
              style={{ height: "70vh" }}
              // rows={products}
              columns={columns}
             rows={handleSearch()}
              // checkboxSelection
              getRowId={(row) => row._id}
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
    </div>
  );
};

export default Dashboard;