import React from 'react';
import { useLocation } from 'react-router-dom'; 
import { Box, Grid, Typography, CardContent, CardMedia,CardActions,Button,Rating } from '@mui/material';
import { useCart } from '../../context_API/CartContext';  
import UserLandingNavbar from './UserLandingNavbar';
import UserFooter from './UserFooter';

const CartDetails = () => {

  const location = useLocation();  
  const { cart, addToCart, removeFromCart } = useCart();  

  const isInCart = (productId: any) => cart.some((item) => item._id === productId);

  const { product } = location.state || {};  
   console.log(product)
  if (!product) {
    return <Typography>No product found.</Typography>;  
  }

  return (
    <>
    <UserLandingNavbar/>
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2,width:"100vw" }}>
      <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>

        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={`${product.image.image}`}

            alt={product.name}
            sx={{height:"90vh",objectFit:"cover",borderRadius:"20px"}}
          />
        </Grid>

       
        <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="primary">
                ₹{product.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <Rating value={product.rating} size="small" readOnly />

              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                {product.description}
              </Typography>
              <CardActions>
                {isInCart(product._id) ? (
                  <Button
                    size="medium"
                    color="error"
                    variant="contained"
                    onClick={() => removeFromCart(product._id)} 
                    sx={{ width: "285px" , paddingY:"6px"}} 
                  >
                    Remove from Cart
                  </Button>
                ) : (
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() => addToCart(product)} 
                    sx={{ width: "285px",paddingY:"6px" }} 
                  >
                    Add to Cart
                  </Button>
                )}
              </CardActions>
            </CardContent>
          
        </Grid>
      </Grid>
    </Box>
    <UserFooter/>
    </>
  );
};

export default CartDetails;
