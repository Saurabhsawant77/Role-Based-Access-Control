import React from "react";
import UserHome from "./UserHome";
import UserLandingNavbar from "./UserLandingNavbar";
import UserFooter from "./UserFooter";
import { Box } from "@mui/material";

const UserLandingPage = () => {
  return (
    <>
      <UserLandingNavbar />
      <UserHome />
      <UserFooter />
    </>
  );
};

export default UserLandingPage;
