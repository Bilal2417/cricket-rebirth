import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Home, Person, Menu as MenuIcon } from "@mui/icons-material";
import {
  GiHamburgerMenu,
  GiNotebook,
  GiTrophy,
  GiTwoCoins,
} from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ profile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  // 🧱 Navigation items (easy to expand)
  const menuItems = [
    { label: "Battle Log", path: "/battle-log" },
    // Add more like:
    // { label: "Settings", path: "/settings" },
    // { label: "Achievements", path: "/achievements" },
  ];

  const handleNavigate = (path) => {
    setOpenDrawer(false);
    navigate(path);
  };

  return (
    <>
      {/* ✅ Navbar */}
      <AppBar
        position="static"
        sx={{ background: "none", backdropFilter: "blur(3px)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side: Profile/Home + Trophy */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Profile/Home Toggle */}
            <Box
              sx={{
                backgroundColor: "#343c53",
                padding: "5px 20px 0",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                transition: "all 0.3s",
                ":hover": {
                  cursor: "pointer",
                  transform: "scale(1.1)",
                },
                ":active": { transform: "scale(1)" },
              }}
              onClick={() =>
                location.pathname === "/" ? navigate("/profile") : navigate("/")
              }
            >
              {location.pathname === "/" ? (
                <Person sx={{ color: "#FFFFFF" }} />
              ) : (
                <Home sx={{ color: "#FFFFFF" }} />
              )}
            </Box>

            {/* Trophy Display */}
            <Box
              sx={{
                backgroundColor: "#343c53",
                padding: "5px 20px",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "rgb(255 196 107)",
                }}
                variant="body1"
              >
                <GiTrophy size={20} style={{ color: "#DAA520" }} />
                <Box
                  sx={{ minWidth: "30px", textAlign: "center" }}
                  component="span"
                >
                  {Math.max(profile?.trophies, 0) || 0}
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Right Side: Coins + Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GiTwoCoins size={30} style={{ color: "#f6c401" }} />
              <Typography variant="body1">{profile?.coins || "0"}</Typography>
            </Box>

            {/* Drawer Button */}

            <Box
              sx={{
                ml : "20px",
                backgroundColor: "#343c53",
                padding: "5px 20px 0",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                transition: "all 0.3s",
                textAlign: "center",
                ":hover": {
                  cursor: "pointer",
                  transform: "scale(1.1)",
                },
                ":active": { transform: "scale(1)" },
              }}
              onClick={() => setOpenDrawer(true)} 
            >
              <GiHamburgerMenu size={25}
               />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            backgroundColor: "#18171f",
            height: "100%",
            padding: "50px 20px",
          }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    backgroundColor: "#343c53",
                    padding: "5px 20px",
                    border: "2px solid #000000",
                    borderRadius: "4px",
                    boxShadow: "inset 0px -8px 8px -4px #2a3043",
                    transform: "skew(-5deg)",
                    color: "#ffffff",
                    transition: "all 0.3s",
                    textAlign: "center",
                    ":hover": {
                      cursor: "pointer",
                    },
                    ":active": { transform: "scale(1)" },
                  }}
                >
                  <GiNotebook size={30} />
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
