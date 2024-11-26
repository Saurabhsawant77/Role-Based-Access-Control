import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  Typography,
  Box,
  TableHead,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import OrderCartNavbar from "./OrderCartNavbar";
interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface Item {
  name: string;
  price: number;
  image: {
    image: string;
  };
  qty: number;
}

interface Product {
  address: Address;
  items: Item[];
  totalPrice: number;
}

interface Order {
  orderCancel: boolean;
  _id: string;
  products: Product[];
  customer_id: string;
  address_id: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const StyledTableContainer = styled(TableContainer)({
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  margin: "auto",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  whiteSpace: "nowrap",
});

const OrderDetails = () => {
  const [OrderDetails, setOrderDetails] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllOrderDetails = async () => {
    try {
      const response = await axios.get(
        "https://user-product-api.vercel.app/api/customer/order-details",
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setOrderDetails(response.data.getAllOrderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrderDetails();
  }, []);

  return (
    <>
    <OrderCartNavbar/>
    <Box display="flex" justifyContent="center" padding={2} sx={{ width: "100vw", marginTop: "1%" }}>
      <Paper elevation={3}>
        <StyledTableContainer>
          <Typography variant="h4" align="center" gutterBottom>
            Order Details
          </Typography>
          <Table>
            <TableHead sx={{backgroundColor: "#1976D2"  }}>
              <TableRow>
                <StyledTableCell style={{ width: "15%", color:"white" }}>Order ID</StyledTableCell>
                <StyledTableCell style={{ width: "15%", color:"white" }}>Date</StyledTableCell>
                <StyledTableCell style={{ width: "10%", color:"white" }}>Status</StyledTableCell>
                <StyledTableCell style={{ width: "30%", color:"white" }}>Product Name</StyledTableCell>
                <StyledTableCell style={{ width: "10%", color:"white" }}>Quantity</StyledTableCell>
                <StyledTableCell style={{ width: "10%", color:"white" }}>Price</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress /> {/* Show spinner in data row */}
                  </TableCell>
                </TableRow>
              ) : (
                OrderDetails.map((order) =>
                  order.products.map((product, index) => (
                    <React.Fragment key={`${order._id}-${index}`}>
                      <TableRow>
                        <TableCell rowSpan={product.items.length + 1} align="center">
                          {order._id}
                        </TableCell>
                        <TableCell rowSpan={product.items.length + 1} align="center">
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell rowSpan={product.items.length + 1} align="center">
                          Pending
                        </TableCell>
                      </TableRow>
                      {product.items.map((item, i) => (
                        <TableRow key={`${order._id}-${index}-${i}`} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={item.image.image}
                                alt={item.name}
                                variant="rounded"
                                sx={{ width: 50, height: 50, marginRight: 2 }}
                              />
                              <Typography variant="body1" noWrap sx={{ maxWidth: "150px" }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">{item.qty}</TableCell>
                          <TableCell align="center">₹{item.price}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={6} align="right" sx={{ fontWeight: "bold" }}>
                          Total: ₹{product.totalPrice}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </Box>
    </>
  );
};

export default OrderDetails;
