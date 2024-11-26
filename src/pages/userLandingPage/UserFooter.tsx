import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";

const UserFooter = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#172337",
        color: "#fff",
        width: "100vw",
        marginBottom:0,
        padding: "20px",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Link color="inherit" underline="hover">
            Contact Us
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            About Us
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Careers
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Imagine Stories
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Press
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Help
          </Typography>
          <Link color="inherit" underline="hover">
            Payments
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Shipping
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Cancellation & Returns
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            FAQ
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Report Infringement
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Policy
          </Typography>
          <Link color="inherit" underline="hover">
            Return Policy
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Terms Of Use
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Security
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Privacy
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Sitemap
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Social
          </Typography>
          <Link color="inherit" underline="hover">
            Facebook
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Twitter
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            YouTube
          </Link>
          <br />
          <Link color="inherit" underline="hover">
            Instagram
          </Link>
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography variant="body2" color="inherit">
          © 2024 Imagine Clone. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserFooter;
