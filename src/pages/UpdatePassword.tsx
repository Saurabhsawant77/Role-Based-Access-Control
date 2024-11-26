import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UpdatePassword = () => {
const [message, setMessage] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const navigate = useNavigate();
const location = useLocation();
const token = new URLSearchParams(location.search).get('token');

const { control, handleSubmit, formState: { errors }, setError, watch
} = useForm({
mode: 'onChange'
});

const onSubmit = async (data: any) => {
if (data.newPassword !== data.confirmPassword) {
setMessage('Passwords do not match!');
setError('confirmPassword', {
type: 'manual',
message: 'Passwords do not match!',
});
toast.error('Passwords do not match!');
return;
}

try {
const response = await
fetch('https://user-product-api.vercel.app/api/auth/reset-forget-password',
{
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: ` ${token}`,
},
body: JSON.stringify({ newPassword: data.newPassword }),
});

const result = await response.json();
if (response.ok) {
setMessage('Password updated successfully!');
toast.success('Password updated successfully!');
navigate('/');
} else {
setMessage(result.error || 'Failed to update password.');
toast.error('Failed to update password.');
}
} catch (error) {
setMessage('An error occurred. Please try again.');
toast.error('Please try again.');
}
};

const handleClickShowPassword = () => setShowPassword(!showPassword);
const handleClickShowConfirmPassword = () =>
setShowConfirmPassword(!showConfirmPassword);

return (
<Box sx={{ display: 'flex', justifyContent: 'space-between',
alignItems: 'center', width: '100vw' }}>
<Box
component="form"
onSubmit={handleSubmit(onSubmit)}
sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
marginLeft: '15%', width: '20%' }}
>
<Typography variant="h4" align="center" gutterBottom>
Update Password
</Typography>

<Controller
name="newPassword"
control={control}
rules={{
required: 'New password is required',
minLength: { value: 8, message: 'Password must be minimum 8 characters' },
maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
pattern: {
value: /^\S*$/, // Prevent spaces in password
message: "Password cannot contain spaces"
}
}}
render={({ field }) => (
<TextField
fullWidth
label="New Password *"
type={showPassword ? 'text' : 'password'}
{...field}
margin="normal"
sx={{
'& .MuiInputBase-root': {
borderRadius: 2,
},
}}
error={!!errors.newPassword}
helperText={errors.newPassword?.message as string || ''}
InputProps={{
endAdornment: (
<IconButton
aria-label="toggle password visibility"
onClick={handleClickShowPassword}
edge="end"
>
{showPassword ? <VisibilityOff /> : <Visibility />}
</IconButton>
),
}}
/>
)}
/>

<Controller
name="confirmPassword"
control={control}
rules={{
required: 'Please confirm your password',
validate: (value) =>
value === watch('newPassword') || 'Passwords do not match',
pattern: {
value: /^\S*$/, // Prevent spaces in confirm password
message: "Password cannot contain spaces"
}
}}
render={({ field }) => (
<TextField
fullWidth
label="Confirm Password *"
type={showConfirmPassword ? 'text' : 'password'}
{...field}
margin="normal"
sx={{
'& .MuiInputBase-root': {
borderRadius: 2,
},
}}
error={!!errors.confirmPassword}
helperText={errors.confirmPassword?.message as string || ''}
InputProps={{
endAdornment: (
<IconButton
aria-label="toggle password visibility"
onClick={handleClickShowConfirmPassword}
edge="end"
>
{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
</IconButton>
),
}}
/>
)}
/>


<Button
type="submit"
variant="contained"
sx={{ mt: 2, borderRadius: 2, backgroundColor: '#3A5B22' }}
fullWidth
>
Update Password
</Button>

{message && (
<Typography variant="body2" color="error" sx={{ mt: 2 }}>
{message}
</Typography>
)}
</Box>

<Box
component="img"
src="https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
alt="updatePasswordImage"
sx={{
width: '50vw',
height: '100vh',
objectFit: 'cover',
objectPosition: 'center',
borderTopLeftRadius: '30px',
borderBottomLeftRadius: '30px',
}}
/>
</Box>
);
};

export default UpdatePassword;

