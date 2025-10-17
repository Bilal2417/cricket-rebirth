import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  Home,
  Person,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ profile }) {
  const [coins] = useState(1200); // Example coin balance

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="static"
      sx={{ background: "none",  backdropFilter: "blur(3px)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Profile Button */}
        <Box sx={{
            display : "flex",
            alignItems : "center",
            gap : "20px"
        }}>

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
          onClick={() =>
            location.pathname == "/" ? navigate("/profile") : navigate("/")
          }
        >
          {location.pathname == "/"  ? <Person sx={{ color: "#FFFFFF" }} /> :  <Home sx={{ color: "#FFFFFF" }}/>}
        </Box>

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
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              // fontfamily: "Rubik",
              fontWeight: 600,
              clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
              justifyContent: "center",
              color: "rgb(255 196 107)",
            }}
            variant="body1"
          >
            <EmojiEventsTwoTone
              sx={{
                "& .MuiSvgIcon-root": {
                  fill: "none",
                },
                "& path:first-of-type": {
                  fill: "#FFD700",
                },
                "& path:last-of-type": {
                  fill: "#DAA520",
                },
              }}
            />
            <Box
              sx={{ minWidth: "30px", textAlign: "center" }}
              component="span"
            >
              {Math.max(profile?.trophies, 0) || 0}
            </Box>
          </Typography>
        </Box>
        </Box>

        {/* Right: Coins display */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MonetizationOnIcon sx={{ color: "#f6c401" }} />
          <Typography variant="body1">{profile?.coins || "0"}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
