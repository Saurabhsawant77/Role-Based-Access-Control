import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

interface Admin {
  _id: string;
  username: string;
  email: string;
  phone: number;
  address: string;
  role: string;
  isActive: boolean;
  profileImage: string;
}

interface AdminFormInputs {
  username: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  profileImage?: string;
}

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const { control, handleSubmit, reset, formState: { errors, isValid }, } = useForm<AdminFormInputs>({ mode: 'onChange' });
  const token = localStorage.getItem("token");
  const apiUrl = "https://user-product-api.vercel.app/api/admin";

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditAdmin(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/all-admins`, {
        headers: {
          Authorization: token,
        },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpen = () => {
    setEditMode(false);
    setSelectedAdmin(null);
    reset({  // Clear fields when creating a new admin
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "ADMIN", 
    });
    setOpen(true);
  };

  const handleClose = () => {
    reset();  // Reset fields on close
    setEditMode(false);
    setSelectedAdmin(null);
    setOpen(false);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditMode(true);
    reset({
      username: admin.username,
      email: admin.email,
      phone: admin.phone.toString(),
      address: admin.address,
      role: "ADMIN",
    });
    setOpen(true);
  };

  const onSubmit: SubmitHandler<AdminFormInputs> = async (data) => {
    const requestData = {
      username: data.username,
      email: data.email,
      phone: data.phone,
      address: data.address,
      // isActive: data.isActive,
      ...(editMode ? {} : { role: "ADMIN" }),
      ...(editMode ? {} : { password: data.password }),
    };
    try {
      if (editMode && selectedAdmin) {
        // Edit mode: Update the existing admin
        const response = await axios.put(
          `${apiUrl}/update-user/${selectedAdmin._id}`,
          requestData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        toast.success("Admin updated successfully!");
        console.log("Admin Updated:", response.data);
      } else {
        // Create : Add a new admin
        const response = await axios.post(
          `${apiUrl}/add`,
          requestData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        toast.success("Admin created successfully!");
        console.log("Admin Created:", response.data);
      }
      fetchAdmins();
      handleClose();
    }catch (error: any) {
      console.error("Error saving admin:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        console.log("Error message:", errorMessage); 
        toast.error(errorMessage); 
      } else {
        toast.error("An unexpected error occurred!");
      }
      }
  };

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ height: "85vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Box m="20px">
           <Box
          display="flex"
          alignItems="center"
          mb={2}
          justifyContent="space-between"
        >
          <Box>
          </Box>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create Admin User
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Edit Admin" : "Create New Admin"}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
            <Controller
  name="username"
  control={control}
  defaultValue=""
  rules={{
    required: "Username is required",
    pattern: {
      value: /^[a-zA-Z0-9]+$/, // Only alphabets and numbers allowed, no spaces
      message: "Only alphabets and numbers are allowed",
    },
    minLength: {
      value: 3,
      message: "Username must be minimum 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Username cannot exceed more than 20 characters",
    },
  }}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      margin="dense"
      variant="filled"
      label="Username*"
      error={!!errors.username}
      helperText={errors.username?.message || ""}
      inputProps={{
        // Prevent spaces from being entered
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
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "Email cannot contain spaces",
                    validEmail: (value) =>
                      /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value) ||
                      "This is not a valid email",
                  },
                }}
                render={({ field }) => (
                  <TextField fullWidth margin="dense" variant="filled" label="Email*" {...field}  error={!!errors.email}
                  helperText={errors.email?.message || ""} />
                )}
              />
              {!editMode && (
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
                    minLength: {
                      value: 8,
                      message: " Password must be minimum 8 character's ",
                    },
                    maxLength: {
                      value: 16,
                      message: "Password cannot exceed more than 16 character's ",
                    },
                  }}
                  render={({ field }) => (
                    <TextField fullWidth margin="dense" variant="filled" label="Password*" type="password" {...field}  error={!!errors.password}
                    helperText={errors.password?.message || ""}/>
                  )}
                />
              )}
              <Controller
  name="phone"
  control={control}
  defaultValue=""
  rules={{
    required: "Phone number is required",
    validate: {
      isTenDigits: (value) =>
        /^[6-9][0-9]{9}$/.test(value) || 
        "Phone number must start with 6-9 and contain exactly 10 digits",
    },
  }}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      margin="dense"
      variant="filled"
      label="Phone*"
      error={!!errors.phone}
      helperText={errors.phone?.message || ""}
      inputProps={{
        maxLength: 10, // Prevents typing more than 10 characters
        onKeyDown: (e) => {
          if (e.key === " " || isNaN(Number(e.key)) && e.key !== "Backspace") {
            e.preventDefault(); // Block spaces and non-numeric inputs
          }
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
                    message: "Address should not contain special character",
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
                  <TextField fullWidth margin="dense" variant="filled" label="Address*" {...field} error={!!errors.address}
                  helperText={errors.address?.message || ""}
                  onChange={(e) => {
                    // Replace multiple spaces with a single space
                    const cleanedValue = e.target.value.replace(/\s{2,}/g, " ");
                    field.onChange(cleanedValue);
                  }}/>
                )}
              />

              <Controller
                name="role"
                control={control}
                defaultValue="ADMIN"
                render={({ field }) => (
                  <TextField fullWidth margin="dense" variant="filled" label="Role" {...field} disabled />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={!isValid}>
                {editMode ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Box mt={3} sx={{ height: 400, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "70vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid style={{ height: "70vh" }} columns={columns} rows={admins}  getRowId={(row) => row._id}
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

export default AdminPage;