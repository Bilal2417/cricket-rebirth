import { Box, Typography } from "@mui/material";
import Falling from "../components/falling";
import {
  GiCash,
  GiCoins,
  GiCoinsPile,
  GiTwoCoins,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Coins() {
  const coins = Number(sessionStorage.getItem("Coins")) || 0;
  const navigate = useNavigate();

  useEffect(() => {
    if (!coins) navigate("/");
  }, [coins, navigate]);

  return (
    <Box
      onClick={() => {
        navigate("/");
        sessionStorage.removeItem("Coins");
      }}
      sx={{
        height: "100vh",
        alignContent: "center",
        cursor: "pointer",
      }}
    >
      <Falling
        color={"#e8a208"}
        background={"radial-gradient(circle, #e2e023,  #ee4000 100%)"}
        speed={2}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Box
          sx={{
            border: "2px solid #000000",
            outline: "1px solid #ffffff",
            padding: "20px",
            width: "180px",
            background: "#e9b001",
            boxShadow: `
              inset 0px -8px 8px -4px #ebc206,   
              inset 0px -8px 12px -4px #de5901
            `,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "auto",
            borderRadius: "12px",
          }}
        >
          {coins < 450 ? (
            <GiTwoCoins size={100} color="#de5901" />
          ) : coins < 900 ? (
            <GiCash size={100} color="#de5901" />
          ) : coins < 1350 ? (
            <GiCoins size={100} color="#de5901" />
          ) : (
            <GiCoinsPile size={100} color="#de5901" />
          )}

          <Typography
            sx={{
              color: "white",
              textShadow: `
                -1px -1px 0 #000,
                1px -1px 0 #000,
                -1px 1px 0 #000,
                2px 1.5px 0 #000
              `,
            }}
            variant="h4"
          >
            {coins}
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}
