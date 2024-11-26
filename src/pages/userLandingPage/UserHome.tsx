import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Grid,
  Box,
  Stack,
  Rating,
} from "@mui/material";
import { useUserProductData } from "../../context_API/UserProductDataContext";
import { useCart } from "../../context_API/CartContext";
import { OrbitProgress } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const { products, isLoading, isError } = useUserProductData();
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "5%" ,  width: "100vw",
        height: "100vh", }}>
        <OrbitProgress color="blue" size="medium" text="" />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading products</Typography>;
  }

  if (!Array.isArray(products)) {
    return <Typography>No products available</Typography>;
  }

  const isInCart = (productId: any) =>
    cart.some((item) => item._id === productId);

  const handleImageClick = (product: any) => {
    navigate("/cart-details", { state: { product } });
  };

  return (
    <>
    
      <Grid
        container
        spacing={1}
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          gap: "2px",
          justifyContent: "center",
          marginTop: "2%",
          marginBottom:"2%",
          overflowY : "auto"
        }}
      >
        {products.map((product) => (
          <Grid item key={product._id}>
            <Card sx={{ width: "285px", height: "370px", marginTop: "5px" }}>
              <CardMedia
                component="img"
                height="200"
                image={`${product.image.image}`}
                alt={product.name}
                sx={{ objectFit: "cover", width: "100%", cursor: "pointer" }}
                onClick={() => handleImageClick(product)}
              />
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="h6" component="div">
                      {product.name.slice(0, 18)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{product.price}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Rating value={product.rating} size="small" readOnly />
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                {isInCart(product._id) ? (
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => removeFromCart(product._id)}
                    sx={{ width: "185px", paddingY: "6px" }}
                  >
                    Remove from Cart
                  </Button>
                ) : (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      addToCart({
                        ...product,
                        qty: 1,
                      })
                    }
                    sx={{ width: "185px", paddingY: "6px" }}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UserHome;
// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   CardActions,
//   Button,
//   Grid,
//   Box,
//   Stack,
//   Rating,
// } from "@mui/material";
// import { useUserProductData } from "../../context_API/UserProductDataContext";
// import { useCart } from "../../context_API/CartContext";
// import { OrbitProgress } from "react-loading-indicators";
// import { useNavigate } from "react-router-dom";

// const UserHome = () => {
//   const { products, isLoading, isError } = useUserProductData();
//   const { cart, addToCart, removeFromCart } = useCart();
//   const navigate = useNavigate();

//   if (isLoading) {
//     return (
//       <Box
//         sx={{
//           textAlign: "center",
//           marginTop: "5%",
//           width: "100vw",
//           height: "100vh",
//         }}
//       >
//         <OrbitProgress color="blue" size="medium" text="" />
//       </Box>
//     );
//   }

//   if (isError) {
//     return <Typography>Error loading products</Typography>;
//   }

//   if (!Array.isArray(products)) {
//     return <Typography>No products available</Typography>;
//   }

//   const isInCart = (productId: any) =>
//     cart.some((item) => item._id === productId);

//   const handleImageClick = (product: any) => {
//     navigate("/cart-details", { state: { product } });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//       }}
//     >
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           paddingX: "10px",
//         }}
//       >
//         <Grid
//           container
//           spacing={2}
//           sx={{
//             width: "100%",
//             marginTop: "2%",
//             justifyContent: "center",
//             paddingBottom: "20px", // Ensure space at the bottom
//           }}
//         >
//           {products.map((product) => (
//             <Grid item key={product._id}>
//               <Card sx={{ width: "285px", height: "370px", marginTop: "5px" }}>
//                 <CardMedia
//                   component="img"
//                   height="200"
//                   image={`${product.image.image}`}
//                   alt={product.name}
//                   sx={{ objectFit: "cover", width: "100%", cursor: "pointer" }}
//                   onClick={() => handleImageClick(product)}
//                 />
//                 <CardContent>
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <Stack direction="column" spacing={0.5}>
//                       <Typography variant="h6" component="div">
//                         {product.name.slice(0, 18)}...
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         ₹{product.price}
//                       </Typography>
//                       <Stack direction="row" spacing={1}>
//                         <Rating value={product.rating} size="small" readOnly />
//                       </Stack>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//                 <CardActions sx={{ display: "flex", justifyContent: "center" }}>
//                   {isInCart(product._id) ? (
//                     <Button
//                       size="small"
//                       color="error"
//                       variant="contained"
//                       onClick={() => removeFromCart(product._id)}
//                       sx={{ width: "185px", paddingY: "6px" }}
//                     >
//                       Remove from Cart
//                     </Button>
//                   ) : (
//                     <Button
//                       size="small"
//                       color="primary"
//                       variant="contained"
//                       onClick={() =>
//                         addToCart({
//                           ...product,
//                           qty: 1,
//                         })
//                       }
//                       sx={{ width: "185px", paddingY: "6px" }}
//                     >
//                       Add to Cart
//                     </Button>
//                   )}
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default UserHome;
