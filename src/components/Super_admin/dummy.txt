import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridClearIcon, GridColDef, GridSearchIcon } from "@mui/x-data-grid";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  published: boolean;
  image: { image: string };
}


const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  console.log(products)
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const token = localStorage.getItem("token");
  const apiUrl = "https://user-product-api-gzwy.onrender.com/api/admin";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/all-products`, {
        headers: {
          Authorization: token,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


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
  ];

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px", height: "85vh" }}>
      <Box m="20px">
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          <Box>
               {/* <FormControl className={search}> */}
        <TextField
          size="small"
          variant="outlined"
          value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GridSearchIcon />
              </InputAdornment>
            ),
          }}
        />
      {/* </FormControl> */}
          </Box>
        </Box>
         <Box mt={3} sx={{ height: 400, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "70vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid style={{ height: "70vh" }} 
            // rows={products}
            rows={handleSearch()}
            columns={columns}
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
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Products;
