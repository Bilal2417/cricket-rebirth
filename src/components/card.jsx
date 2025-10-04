import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { useNavigate } from "react-router-dom";

const CardPack = ({ title, description, colors, icon, price, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      width: 280,
      height: 380,
      borderRadius: 4,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      color: "#fff",
      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": { transform: "scale(1.05)", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" },
      "&:active": { transform: "scale(0.97)" },
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 160,
        background: "rgba(255,255,255,0.15)",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
      }}
    >
      {icon}
    </Box>
    <CardContent sx={{ textAlign: "center", mb: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        sx={{
          borderRadius: "20px",
          px: 4,
          py: 1,
          background: `linear-gradient(135deg, ${colors[1]}, ${colors[0]})`,
          color: "#000",
          fontWeight: "bold",
        }}
        onClick={onClick}
      >
        {!isNaN(price) ? `Buy for ${price} Coins` : price}
      </Button>
    </CardContent>
  </Card>
);

export default function CardPacksShop() {
  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const cardRefs = useRef([]);

  const allPacks = [
    {
      title: "Starter Pack",
      description: "Begin your journey! Contains 2 basic cards to get started.",
      colors: ["#00b894", "#55efc4"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#00fff0" }} />,
      price: "Free",
      key: "starter",
    },
    {
      title: "Bronze Pack",
      description: "Contains 3 cards with a chance to get Bronze-level players.",
      colors: ["#8d5524", "#d2691e"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FFD39B" }} />,
      price: 100,
      key: "bronze",
    },
    {
      title: "Silver Pack",
      description:
        "Contains 5 cards. Guaranteed Bronze players with a chance to pull Silver players.",
      colors: ["#bdc3c7", "#2c3e50"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#C0C0C0" }} />,
      price: 250,
      key: "silver",
    },
    {
      title: "Gold Pack",
      description:
        "Contains 7 cards. Guaranteed Silver players with a chance to get Gold players.",
      colors: ["#FFD700", "#FF8C00"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FFD700" }} />,
      price: 500,
      key: "gold",
    },
    {
      title: "Legendary Pack",
      description:
        "Contains 10 cards. Guaranteed Gold players with a chance to pull Legendary players.",
      colors: ["#7b4397", "#dc2430"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FF4500" }} />,
      price: 1000,
      key: "legendary",
    },
  ];

  const [packs, setPacks] = useState();

  useEffect(()=>{
    const starter = localStorage.getItem("collectedStarter")
    if(!starter){
      setPacks(()=>allPacks.filter((pack)=>pack.key !== "starter"))
    }
    else{
      setPacks(allPacks)
    }
  },[])

  const navigate = useNavigate()
  const handleClick = (pack ,index) => {
    const rect = cardRefs.current[index].getBoundingClientRect();
    setCardPosition({ top: rect.top, left: rect.left });
    setActiveCard(index);

    navigate(`/open-pack/${pack.key}`);
  };

  const handleClose = () => setActiveCard(null);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 4,
        justifyContent: "center",
        mt: 4,
        p: 2,
        position: "relative",
      }}
    >
      {packs?.map((pack, index) => (
        <Box
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          sx={{
            animation:
              isNaN(pack.price) 
                ? "float 1.5s ease-in-out infinite alternate"
                : null,
            "@keyframes float": {
              "0%": { transform: "translateY(0px)" },
              "100%": { transform: "translateY(-10px)" },
            },
          }}
          onClick={() => handleClick(pack,index)}
        >
          <CardPack {...pack} />
        </Box>
      ))}

      {activeCard !== null && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
          onClick={handleClose}
        >
          <Box
            sx={{
              position: "absolute",
              top: cardPosition.top,
              left: cardPosition.left,
              width: 280,
              transition: "all 0.4s ease-in-out",
              transform: `translate(${
                window.innerWidth / 2 - cardPosition.left - 140
              }px, ${window.innerHeight / 2 - cardPosition.top - 190}px)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardPack {...packs[activeCard]} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
