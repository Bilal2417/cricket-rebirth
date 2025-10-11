import React, {useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { ArrowBackIosNew, Person } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar( {profile} ) {
  const [coins] = useState(1200); // Example coin balance

  const navigate = useNavigate()
  const location = useLocation()

  


  return (
    <AppBar
      position="static"
      sx={{ background: "none", px: 2 , backdropFilter : "blur(3px)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Profile Button */}
        <Box
          sx={{
            backgroundColor: "#343c53",
            width: "fit-content",
            padding: "5px 20px",
            display: "flex",
            alignContent: "center",
            border: "2px solid #000000",
            borderRadius: "4px",
            boxShadow: "inset 0px -8px 8px -4px #2a3043",
            clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
            color: "#ffffff",
            transition: "all 0.3s",
            ":hover": {
              cursor: "pointer",
              transform: "scale(1.1)",
            },
            ":active": {
              transform: "scale(1)",
            },
          }}
          onClick={() => location.pathname == "/" ?  navigate("/profile") : navigate("/")}
        >
          {location.pathname == "/" ?<Person sx={{ color: "#FFFFFF" }} /> : <ArrowBackIosNew sx={{ color: "#FFFFFF" }} />}
        </Box>

        {/* Right: Coins display */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MonetizationOnIcon sx={{ color : '#f6c401'}}/>
          <Typography variant="body1">{profile?.coins}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
