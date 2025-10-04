import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Example pulled cards (replace with your real data)
const pulledCards = [
  { name: "Player 1", rarity: "Bronze" },
  { name: "Player 2", rarity: "Silver" },
  { name: "Player 3", rarity: "Gold" },
  { name: "Player 4", rarity: "Legendary" },
];

export default function CardOpening({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < pulledCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (onFinish) onFinish(); // callback after last card
    }
  };

  // Function to decide card background by rarity
  const getCardBackground = (rarity) => {
    switch (rarity) {
      case "Bronze":
        return "linear-gradient(135deg, #8d5524, #d2691e)";
      case "Silver":
        return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      case "Gold":
        return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Legendary":
        return "linear-gradient(135deg, #7b4397, #dc2430)";
      default:
        return "linear-gradient(135deg, #333, #111)";
    }
  };

  return (
    <Box
      onClick={handleNext}
      sx={{
        height: "100vh",
        // width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #141e30, #243b55)",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              width: 300,
              height: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              color: "#fff",
              background: getCardBackground(pulledCards[currentIndex].rarity),
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              {pulledCards[currentIndex].name}
            </Typography>
            <Typography variant="h6" sx={{ letterSpacing: 1 }}>
              {pulledCards[currentIndex].rarity}
            </Typography>
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
              (Tap anywhere to reveal next)
            </Typography>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
