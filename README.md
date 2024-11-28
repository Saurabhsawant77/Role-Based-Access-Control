# Role-Based-Access-Control

# User-Product API

The Role-Based Access Control (RBAC) UI is a web application designed to manage users, roles, and permissions efficiently. 
It supports four roles: Super Admin, Admin, Partner, and Customer, each with distinct functionalities.

## Features

### Role-Based Functionalities
- **Super Admin:**
  - Can add/edit Admins.
  - Can view all Admins, Partners, and Customers.

- **Admin:**
  - Can add/edit Partners.
  - Can view products added by Partners under their management.
  - Can verify and reject products.

- **Partner:**
  - Can add/edit/delete products.

- **Customer:**
  - Can sign up and sign in.
  - Can view all products.
  - Can add products to the cart and place orders.

### Additional Functionalities
- **Authentication:**
  - Sign up, sign in, forgot password, and reset password.
  
- **Email Notifications:**
  - When a Partner is added by an Admin, an email is sent to the Partner for password setup.
  - When an Admin is added by a Super Admin, an email is sent to the Admin for password setup.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Saurabhsawant77/Role-Based-Access-Control.git
   
2. Navigate to Directory
   ```bash
   cd Role-Based-Access-Control
   
3. Install Node modules
   ```bash
   npm i
4. Run Project
   ```bash
   npm start

## Super Admin Credentials

Use the following credentials to log in as the Super Admin:

- **Email:** `superadmin@gmail.com`
- **Password:** `12345678`

