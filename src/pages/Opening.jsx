import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

// Example pulled cards (replace with your real data)
const pulledCards = [
  { name: "Coins", rarity: "Bronze" },
  { name: "More Coins", rarity: "Silver" },
  { name: "Double Trophies", rarity: "Gold" },
  { name: "Team", rarity: "Legendary" },
];

const packData = {
  starter: { title: "Starter Pack", size: 2, colors: ["#00b894", "#55efc4"] },
  bronze: { title: "Bronze Pack", size: 3, colors: ["#8d5524", "#d2691e"] },
  silver: { title: "Silver Pack", size: 5, colors: ["#bdc3c7", "#2c3e50"] },
  gold: { title: "Gold Pack", size: 7, colors: ["#FFD700", "#FF8C00"] },
  legendary: {
    title: "Legendary Pack",
    size: 10,
    colors: ["#7b4397", "#dc2430"],
  },
};

export default function CardOpening({ onFinish }) {
  const { packKey } = useParams();
  const pack = packData[packKey];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rewards, setRewards] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [isAnimation, setIsAnimation] = useState(false);

  const handleNext = () => {
    if(isAnimation)return
    if (currentIndex < pack.size - 1) {
        setIsAnimation(true)
      setCurrentIndex((prev) => prev + 1);
    } else {
      // when last card is reached → show summary
      setShowSummary(true);
    }
  };
  useEffect(() => {
    if (!packKey) return;

    const newRewards = [];

    for (let index = 0; index < pack.size; index++) {
      const randomIndex = Math.floor(Math.random() * pulledCards.length);
      newRewards.push(pulledCards[randomIndex]);
    }

    setRewards(newRewards);
  }, [packKey]);

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

  const nextReward = rewards[currentIndex + 1]?.rarity;

  return (
    <Box
      onClick={!showSummary ? handleNext : undefined}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "none",
        overflow: "hidden",
        cursor: "pointer",
        flexDirection: "column",
        WebkitTapHighlightColor: "transparent", // 🔥 removes mobile tap flash
        userSelect: "none",
      }}
    >
      {!showSummary ? (
        <Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={()=>setIsAnimation(false)}
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
                  background: getCardBackground(rewards[currentIndex]?.rarity),
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                  {rewards[currentIndex]?.name}
                </Typography>
                <Typography variant="h6" sx={{ letterSpacing: 1 }}>
                  {rewards[currentIndex]?.rarity}
                </Typography>
                <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
                  (Tap anywhere to reveal next)
                </Typography>
              </Card>
            </motion.div>
          </AnimatePresence>
          <Box
            sx={{
              backgroundColor: "red",
              borderRadius: "8px",
              padding: "4px 12px",
              color: "#FFFFFF",
              display: rewards.length - currentIndex - 1 > 0 ? "" : "none",
              width: "fit-content",
              margin: "50px 0 0 auto",
              boxShadow:
                nextReward == "Legendary"
                  ? "0 0 15px 5px rgba(255,0,0,0.8), 0 0 30px 10px rgba(255,0,0,0.6)"
                  : "none",
              animation:
                nextReward == "Legendary" ? "pulse 1.3s infinite" : "none",
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 10px 3px rgba(255,0,0,0.6)" },
                "50%": { boxShadow: "0 0 25px 10px rgba(255,0,0,1)" },
                "100%": { boxShadow: "0 0 10px 3px rgba(255,0,0,0.6)" },
              },
            }}
          >
            {rewards.length - currentIndex - 1}
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 3, color: "#fff" }}
          >
            🎉 All Collected Rewards 🎉
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {rewards?.map((card, i) => (
              <Card
                key={i}
                sx={{
                  width: 160,
                  height: 240,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                  color: "#fff",
                  background: getCardBackground(card.rarity),
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
              >
                <Typography variant="h6">{card.name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {card.rarity}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
