import { Box, Typography } from "@mui/material";
import MovingBallsBackground from "../components/background";
import Falling from "../components/falling";
import { GiCash, GiCoins, GiCoinsPile, GiTwoCoins } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Coins() {
  const coins = sessionStorage.getItem("Coins");
  const navigate = useNavigate();
  useEffect(() => {
    const check = sessionStorage.getItem("Coins");
    if (!check) navigate("/");
  }, [coins]);
  return (
    <>
      <Box
        onClick={() => {
          navigate("/");
          sessionStorage.removeItem("Coins");
        }}
        sx={{
          height: "100vh",
          alignContent: "center",
        }}
      >
        <Falling
          color={"#e8a208"}
          background={"radial-gradient(circle, #e2e023,  #ee4000 100%)"}
          speed={7}
        />
        <Box
          sx={{
            border: "2px solid #000000",
            outline: "1px solid #ffffff",
            padding: "20px",
            width: "180px",
            // height: "100px",
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
          }}
        >
          {coins < 450 ? (
            <GiTwoCoins
              size={100}
              style={{
                color: "#de5901",
              }}
            />
          ) : coins < 900 ? (
            <GiCash
              size={100}
              style={{
                color: "#de5901",
              }}
            />
          ) : coins < 1350 ? (
            <GiCoins
              size={100}
              style={{
                color: "#de5901",
              }}
            />
          ) : (
            <GiCoinsPile
              size={100}
              style={{
                color: "#de5901",
              }}
            />
          )}
          <Typography
            sx={{
              textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              2px  1.5px 0 #000
            `,
            }}
            variant="h4"
          >
            {coins || 0}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
