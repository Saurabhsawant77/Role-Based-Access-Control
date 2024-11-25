import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  name: string;
  description: string;
  publish: boolean;
  image: FileList | null;
  price: number;
  rating: number;
}

const ProductForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4">
      <Box m="20px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
            <TextField
              fullWidth
              variant="filled"
              label="Product Name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Description"
              {...register("description", { required: "Description is required" })}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Price"
              type="number"
              {...register("price", { required: "Price is required", valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Rating"
              type="number"
              {...register("rating", { required: "Rating is required", valueAsNumber: true })}
              error={!!errors.rating}
              helperText={errors.rating?.message}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Publish"
              {...register("publish")}
              sx={{ gridColumn: "span 4" }}
            />
           <TextField
              fullWidth
              variant="filled"
              label="Upload Image"
              type="file"
              inputProps={{ accept: "image/*" }}
              {...register("image", { required: "Image is required" })}
              error={!!errors.image}
              helperText={errors.image?.message}
              sx={{ gridColumn: "span 4" }}
            /> 
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Create New Product
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default ProductForm;