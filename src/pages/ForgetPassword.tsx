import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
interface ForgetPasswordData {
  email: string;
}

const ForgetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordData>({
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: ForgetPasswordData) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://user-product-api.vercel.app/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log("result", result);
      console.log("result.token", result.token);
      localStorage.setItem("emailToken", result.token);
      console.log(result);
      if (response.ok) {
        toast.success("Email sent Successfull. Please check your inbox");
        console.log("Email sent Successfull. Please check your inbox");
      } else {
        toast.error(result.message || "Email is Not Registred");
        console.log(result.message || "Email is Not Registred");
      }
    } catch (error) {
      toast.error("SomeThing Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
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
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "15%",
          width: "20%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Forget Password
        </Typography>

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            validate: {
              noSpaces: (value) =>
                !/\s/.test(value) || "Email cannot contain spaces", // Prevent spaces
              validEmail: (value) =>
                (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) && // Valid email format
                  !/\.\./.test(value) && // Disallow consecutive periods
                  !/^\.|\.$/.test(value)) || // Disallow starting or ending with a dot
                "This is not a valid email",
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
                // Block space input
                onKeyDown: (e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Block spacebar key
                  }
                },
                // Block pasting if it contains spaces
                onPaste: (e) => {
                  const pastedText = e.clipboardData.getData("text");
                  if (/\s/.test(pastedText)) {
                    e.preventDefault(); // Prevent pasting if there are spaces
                  }
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "blue",
                marginLeft: "10px",
              }}
            >
              Back to Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Box
        component="img"
        src="https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="forgetPasswordImage"
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

export default ForgetPassword;
