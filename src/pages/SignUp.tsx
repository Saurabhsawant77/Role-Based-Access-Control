import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-toastify/dist/ReactToastify.css";
import { useSignUp } from "../context_API/SignUpContext";
type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useSignUp();
  console.log(
    "process.env.REACT_APP_BACKEND_URL",
    process.env.REACT_APP_BACKEND_URL
  );
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      await signUp(data);
    } catch (error) {
      toast.error("Error during signup");
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        marginTop: "-4%",
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginLeft: "15%",
          width: "20%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <Controller
          name="username"
          control={control}
          defaultValue=""
          rules={{
            required: "Name is required",
            pattern: {
              value: /^[a-zA-Z]+( [a-zA-Z]+)*$/, // Only allows alphabets with single spaces
              message: "Only alphabets are allowed",
            },
            maxLength: {
              value: 20,
              message: "Name cannot exceed 20 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Name *"
              margin="normal"
              onChange={(e) => {
                const cleanedValue = e.target.value.replace(/\s{2,}/g, " "); // Remove multiple spaces
                field.onChange(cleanedValue); // Update the field value
              }}
              error={!!errors.username}
              helperText={errors.username?.message || ""}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Matches valid email format
              message: "This is not a valid email",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email *"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message || ""}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
              inputProps={{
                // Prevent spaces from being entered at all
                onKeyDown: (e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Block the spacebar key
                  }
                },
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "Password is required",
            pattern: {
              value: /^\S*$/,
              message: "Password cannot contain spaces",
            },
            maxLength: {
              value: 20,
              message: "Password cannot exceed more than 20 characterslong!",
            },
            minLength: {
              value: 8,
              message: " Password must be minimum 8 characters ",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password *"
              type={showPassword ? "text" : "password"}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message || ""}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: "Phone number is required",
            validate: {
              noSpaces: (value) =>
                !/\s/.test(value) || "Phone number cannot contain spaces",
              noAlphabets: (value) =>
                /^[0-9]*$/.test(value) ||
                "Phone number cannot contain alphabets",
              startsFromSix: (value) =>
                /^[6-9]/.test(value) ||
                "Phone number should start from 6 or above",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Only numbers are allowed",
            },
            maxLength: {
              value: 10,
              message: "Phone number cannot exceed more than 10 digits",
            },
            minLength: {
              value: 10,
              message: "Phone number must be more than 10 digits",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Phone Number*"
              type="number"
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone?.message || ""}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{
            required: "Address is required",
            pattern: {
              value: /^(?!\d+$)(?!.*\s{2,})(?!\s)[a-zA-Z0-9\s,./-]{4,50}$/,
              message: "Address should not start from sapce",
            },
            minLength: {
              value: 4,
              message: "Address must be more than 4 characters",
            },
            maxLength: {
              value: 50,
              message: "Address cannot exceed 50 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Address *"
              margin="normal"
              onChange={(e) => {
                // Replace multiple spaces with a single space
                const cleanedValue = e.target.value.replace(/\s{2,}/g, " ");
                field.onChange(cleanedValue);
              }}
              error={!!errors.address}
              helperText={errors.address?.message || ""}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, borderRadius: 2, backgroundColor: "#3A5B22" }}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            Already have an account?
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "blue",
                marginLeft: "10px",
              }}
            />
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "blue",
                marginLeft: "10px",
              }}
            >
              Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="signUPImage"
        sx={{
          width: "50vw",
          height: "100vh",
          objectFit: "cover",
          objectPosition: "center",
          borderTopLeftRadius: "30px",
          borderBottomLeftRadius: "30px",
        }}
      />
    </Box>
  );
};

export default SignUp;
