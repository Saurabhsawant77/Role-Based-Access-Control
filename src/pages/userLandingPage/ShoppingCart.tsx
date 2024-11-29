import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { useCart } from "../../context_API/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useNavigate } from "react-router-dom";
import OrderCartNavbar from "./OrderCartNavbar";
const ShoppingCart = () => {
  const { cart, removeFromCart, incrementQty, decrementQty, clearCart } =
    useCart();
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    const addressData = {
      street: data.street,
      city: data.city,
      state: data.state,
      pinCode: data.pincode,
      country: data.country,
    };
    const orderData = [
      {
        address: addressData,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          qty: item.qty,
        })),
        totalPrice,
      },
    ];

    try {
      const addressResponse = await fetch(
        "https://user-product-api.vercel.app/api/customer/add-address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      if (!addressResponse.ok) throw new Error("Failed to add address.");

      const purchaseResponse = await fetch(
        "https://user-product-api.vercel.app/api/customer/purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ products: orderData }),
        }
      );

      if (!purchaseResponse.ok) throw new Error("Failed to place order.");
      if (purchaseResponse.ok) {
        toast.success(
          "Order placed successfully! You Can Check Your Order From Your Profile"
        );
        clearCart();
        handleClose();
        navigate("/order-details");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order.");
    }
  };

  return (
    <>
    <OrderCartNavbar/>
      <Box
        sx={{
          padding: "20px",
          width: "75%",
          margin: "auto 22%",
          marginTop: "2%",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Table sx={{ width: "800px" }}>
                <TableHead
                  sx={{
                    backgroundColor: "#1976D2",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Image</TableCell>
                    <TableCell sx={{ color: "white" }}>Product</TableCell>
                    <TableCell sx={{ color: "white" }}>Price</TableCell>
                    <TableCell sx={{ color: "white" }}>Quantity</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.image.image}
                          alt={product.name}
                          sx={{
                            borderRadius: "20px",
                            width: 80,
                            height: 100,
                            objectFit: "contain",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">{product.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">
                          ₹{product.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <RemoveCircleOutlineIcon
                            onClick={() => decrementQty(product._id)}
                            style={{ cursor: "pointer" }}
                          />
                          <Typography variant="h6">{product.qty}</Typography>
                          <AddCircleOutlineIcon
                            onClick={() => incrementQty(product._id)}
                            style={{ cursor: "pointer" }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => removeFromCart(product._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h5">
                Total: ₹{totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                Checkout
              </Button>
            </Box>

            {/* Checkout Dialog */}
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{ "& .MuiDialog-paper": { width: "600px" } }}
            >
              <DialogTitle>Fill the Address For the Order</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Address Fields */}
                  <Controller
                    name="street"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Street is required",
                      minLength: {
                        value: 3,
                        message: "Street must be at least 3 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Street must be at most 100 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9, ]+$/,
                        message: "No special characters allowed",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Street"
                        variant="outlined"
                        fullWidth
                        type="text"
                        error={!!errors.street}
                        helperText={
                          (errors.street &&
                            (errors.street.message as string)) ||
                          ""
                        }
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "City is required",
                      minLength: {
                        value: 3,
                        message: "City must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "City must be at most 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "City name can only contain letters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        variant="outlined"
                        fullWidth
                        type="text"
                        error={!!errors.city}
                        helperText={
                          (errors.city && (errors.city.message as string)) || ""
                        }
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  <Controller
                    name="state"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "State is required",
                      minLength: {
                        value: 3,
                        message: "State must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "State must be at most 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "State name can only contain letters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        variant="outlined"
                        fullWidth
                        type="text"
                        error={!!errors.state}
                        helperText={
                          (errors.state && (errors.state.message as string)) ||
                          ""
                        }
                        sx={{ mb: 2 }}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value
                            .replace(/\s+/g, " ")
                            .trim(); // Replace multiple spaces with a single space and remove leading/trailing spaces
                          field.onChange(sanitizedValue); // Update the field value with the sanitized input
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="pincode"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Pin code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message:
                          "Pin code must be exactly 6 digits and no spaces",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pin Code"
                        variant="outlined"
                        fullWidth
                        type="number"
                        error={!!errors.pincode}
                        helperText={
                          (errors.pincode &&
                            (errors.pincode.message as string)) ||
                          ""
                        }
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Country is required",
                      minLength: {
                        value: 3,
                        message: "Country must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Country must be at most 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message:
                          "Country name can only contain letters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Country"
                        variant="outlined"
                        type="text"
                        fullWidth
                        error={!!errors.country}
                        helperText={
                          (errors.country &&
                            (errors.country.message as string)) ||
                          ""
                        }
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Submit Order
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    </>
  );
};

export default ShoppingCart;
