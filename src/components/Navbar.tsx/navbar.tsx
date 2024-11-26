import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import profile from "../../assets/profile.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../assets/img.png";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const context = useContext(MyContext);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setName(storedName || "Guest");
    }
  }, []);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setName("");
    navigate("/");
    handleClose();
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-2 part-1">
              {/* <img src={logo} alt="Logo" style={{ width: "60%" }} /> */}
              {/* <h1>imagine</h1> */}
              <Button
                className="rounded-circle mr-3"
                variant="contained"
                onClick={() =>
                  context?.setIsToggleSidebar(!context.isToggleSidebar)
                }
              >
                {context?.isToggleSidebar ? < ArrowForwardIosIcon/> : <MenuIcon />}
              </Button>
            </div>
            <div className="col-xs-3 d-flex align-items-center part-2 pl-4xss">
            </div>
            <div className="col-sm-9 d-flex align-items-center justify-content-end part-3 pl-4">
              <div className="myAccWrapper">
                <Button
                  className="myAcc d-flex align-items-center"
                  onClick={handleClick}
                >
                  <div className="userImg">
                    <span className="rounded-circle">
                      <img src={profile} alt="User Profile" />
                    </span>
                  </div>
                  <div className="userInfo">
                    <h4>{name || "Guest"}</h4>
                  </div>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {isLoggedIn ? (
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  ) : (
                    <>
                      <MenuItem onClick={() => navigate("/")}>
                        SignIn
                      </MenuItem>
                      <MenuItem onClick={() => navigate("/signup")}>
                        SignUp
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
