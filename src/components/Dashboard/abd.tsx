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
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const imageBaseUrl = "https://user-product-api.vercel.app/"; // Server's base URL
  const token = localStorage.getItem("token");

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<NewProduct>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      rating: 0,
      isVerified: false,
      image: null,
    },
  });

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>(
          "https://user-product-api.vercel.app/api/partner/",
          { headers: { Authorization: token } }
        );
        return response.data;
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
      if (product.image) formData.append("image", product.image);

      await axios.post(
        "https://user-product-api.vercel.app/api/partner/add-product/",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      formData.append("isVerified", JSON.stringify(product.isVerified));
      if (product.image) formData.append("image", product.image);

      await axios.put(
        `https://user-product-api.vercel.app/api/partner/updateProduct/${selectedProductId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(
        `https://user-product-api.vercel.app/api/partner/delete-product/${id}`,
        {
          headers: { Authorization: token },
        }
      );
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
    reset();
  };

  const onSubmit = (data: NewProduct) => {
    if (isEditing) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProductId(product._id);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("rating", product.rating);
    setValue("isVerified", product.isVerified);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
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
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px", height: "85vh" }}>
      <Box m="20px">
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create Product
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required",
                  max: { value: 20, message: "Rating cannot exceed 5" },
                  pattern: {
                    value: /^[a-zA-Z0-9 ]*$/,
                    message: "Name should not contain special characters",
                  },
                 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Product Name"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
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
                    {...field}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description ? errors.description.message : ""}
                  />
                )}
              />
              <Controller
                name="price"
                control={control}
                rules={{ required: "Price is required", min: { value: 0, message: "Price must be a positive number" } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Price"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price ? errors.price.message : ""}
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
                    {...field}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    label="Rating"
                    type="number"
                    error={!!errors.rating}
                    helperText={errors.rating ? errors.rating.message : ""}
                  />
                )}
              />
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    variant="filled"
                    type="file"
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files && target.files[0];
                      field.onChange(file || null); // Update the field with the selected file or null
                    }}
                    // onChange={(e) => {
                    //   const target = e.target as HTMLInputElement;
                    //   field.onChange(target.files && target.files[0] ? target.files[0] : null);
                    // }}
                    // inputProps={{ accept: "image/*" }}
                    // onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                  />
                )}
              />
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  {isEditing ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Box mt="20px" height="75vh">
          {loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={products}
              columns={columns}
              getRowId={(row) => row._id}
              // pageSize={5}
              // rowsPerPageOptions={[5, 10, 25]}
              // checkboxSelection
            />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
