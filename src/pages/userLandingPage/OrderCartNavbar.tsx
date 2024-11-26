import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Box,
  Badge,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Popper,
  Paper,
  Grow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useUserProductData } from "../../context_API/UserProductDataContext";
import { useCart } from "../../context_API/CartContext";
import { OrbitProgress } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import UserProfile from "./UserProfile";
const OrderCartNavbar = () => {
  const { cart } = useCart();
  const { products, isLoading, isError } = useUserProductData();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm) {
      setAnchorEl(document.getElementById("search-field"));
    } else {
      setAnchorEl(null);
    }
  }, [searchTerm]);

  const handleImageClick = (product: any) => {
    setSearchTerm("");
    navigate("/cart-details", { state: { product } });
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        sx={{ width: "100vw", paddingY: "5px", position: "fixed" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/user-landing-page")}
          >
            <ArrowBackIcon />
          </Typography>

          <IconButton
            color="inherit"
            sx={{ marginRight: "20px", marginLeft: "10px" }}
          >
            <Badge badgeContent={cart.length} color="error" showZero>
              <ShoppingCartIcon onClick={() => navigate("/shopping-cart")} />
            </Badge>
          </IconButton>
          <UserProfile />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default OrderCartNavbar;
