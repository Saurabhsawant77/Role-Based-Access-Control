// Sidebar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Button } from "@mui/material";
import { useSignIn } from "../../context_API/SignInContext";
import InventoryIcon from '@mui/icons-material/Inventory';

function Sidebar() {
  const [activeTab, setActiveTab] = useState(0);
  const { roleType } = useSignIn(); // Get the roleType from the context

  return (
    <div className="sidebar" style={{ backgroundColor: "" }}>
      <ul>
        {/* Sidebar items for SUPER_ADMIN */}
        {roleType === "SUPER_ADMIN" && (
          <>
            <li>
              <Link to="/super/admin/products">
                <Button
                  className={`w-100 ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  <span className="icon">
                    <ProductionQuantityLimitsIcon />
                  </span>
                  Products
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/super/admin/user">
                <Button
                  className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => setActiveTab(2)}
                >
                  <span className="icon">
                    <ManageAccountsIcon />
                  </span>
                  User Management
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/super/admin/partner">
                <Button
                  className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                  onClick={() => setActiveTab(3)}
                >
                  <span className="icon">
                    <HandshakeIcon />
                  </span>
                  Partner
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/super/admin/customer">
                <Button
                  className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                  onClick={() => setActiveTab(4)}
                >
                  <span className="icon">
                    <SupportAgentIcon />
                  </span>
                  Customer
                </Button>
              </Link>
            </li>
          </>
        )}

        {/* Sidebar items for Admin */}
        {roleType === "ADMIN" && (
          <>
            <li>
              <Link to="/admin/usermanagement">
                <Button
                  className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                  onClick={() => setActiveTab(0)}
                >
                  <span className="icon">
                    <ManageAccountsIcon />
                  </span>
                  User Management
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/admin/products">
                <Button
                  className={`w-100 ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  <span className="icon">
                    <InventoryIcon />
                  </span>
                   Product Status
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/admin/verifyed/products">
                <Button
                  className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => setActiveTab(2)}
                >
                  <span className="icon">
                    <SupportAgentIcon />
                  </span>
                  verify Products
                </Button>
              </Link>
            </li>
          </>
        )}

        {/* Sidebar items for Partner */}
        {roleType === "PARTNER" && (
          <>
            <li>
              <Link to="/partner/dashboard">
                <Button
                  className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                  onClick={() => setActiveTab(0)}
                >
                  <span className="icon">
                    <ProductionQuantityLimitsIcon />
                  </span>
                  Products
                </Button>
              </Link>
            </li>
          </>
        )}
        {/* Sidebar items for Customer */}
        {roleType === "CUSTOMER" && (
          <li>
            <Link to="/customer">
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
              >
                <span className="icon">
                  <SupportAgentIcon />
                </span>
                Products
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
