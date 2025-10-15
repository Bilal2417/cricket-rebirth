import React, { useState, useRef } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import { toast } from "react-toastify";

export default function ScoreCardShop() {
  const [owned, setOwned] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const cardRefs = useRef([]);

  const scoreCards = [
    {
      title: "Classic ScoreCard",
      description: "The clean traditional layout for pure cricket vibes.",
      price: 1000,
      gradient: "linear-gradient(135deg, #00b4db, #0083b0)",
      icon: <InsertChartIcon sx={{ fontSize: 80, color: "#00eaff" }} />,
    },
    {
      title: "Modern Glass",
      description: "Futuristic glass look with glowing stats display.",
      price: 2500,
      gradient: "linear-gradient(135deg, #ff6a00, #ee0979)",
      icon: <LeaderboardIcon sx={{ fontSize: 80, color: "#ffe9f3" }} />,
    },
    {
      title: "Golden Elite",
      description: "Premium gold design for the ultimate champion.",
      price: 5000,
      gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
      icon: <BarChartIcon sx={{ fontSize: 80, color: "#fff59d" }} />,
    },
  ];

  const handleClick = (index) => {
    const rect = cardRefs.current[index].getBoundingClientRect();
    setCardPosition({ top: rect.top, left: rect.left });
    setActiveCard(index);
  };

  const handleClose = () => setActiveCard(null);

  const handleBuy = (title, price) => {
    if (owned.includes(title)) {
      toast.info("You already own this scorecard!");
      return;
    }
    toast.success(`Purchased ${title} for ${price} Coins!`);
    setOwned((prev) => [...prev, title]);
    setActiveCard(null);
  };

  const CardView = ({ title, description, price, gradient, icon, owned }) => (
    <Card
      sx={{
        width: 300,
        height: 380,
        borderRadius: "24px",
        overflow: "hidden",
        background: gradient,
        color: "#fff",
        boxShadow: owned
          ? "0 0 25px 5px rgba(21, 218, 171, 0.5)"
          : "0 0 25px 5px rgba(250, 32, 142, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.4s ease",
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 0 }}>
        <Box
          sx={{
            p: 3,
            height: "160px",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "90px",
              height: "90px",
              background: "radial-gradient(circle at center, #fa208e, #8b0ef0)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: owned
                ? "0 0 25px 6px rgba(21, 218, 171, 0.8)"
                : "0 0 25px 6px rgba(250, 32, 142, 0.6)",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              mb: 1,
              color: owned ? "#15daab" : "#fff",
            }}
          >
            {title}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, px: 2 }}>
            {description}
          </Typography>

          {!owned ? (
            <Box
              sx={{
                background: "linear-gradient(90deg, #15daab, #fa208e, #bd2f7f)",
                borderRadius: "20px",
                p: "1px",
                width: "200px",
                m: "auto",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  background: "#0f0648",
                  borderRadius: "20px",
                  px: 4,
                  py: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#15daab" }}>
                  {price} Coins
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "#15daab",
                color: "#0f0648",
                fontWeight: 700,
                borderRadius: "12px",
                py: 1.3,
                mt: 3,
              }}
            >
              ✅ Owned
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return <>
  coming soon...
    {/* <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        // minHeight: "100vh",
        // background: "radial-gradient(circle at center, #0f0648, #05021f)",
        // flexWrap: "wrap",
        // p: 4,
      }}
    >
      {scoreCards.map((card, index) => (
        <motion.div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          onClick={() => handleClick(index)}
        >
          <CardView {...card} owned={owned.includes(card.title)} />
        </motion.div>
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
              width: 300,
              transition: "all 0.4s ease-in-out",
              transform: `translate(${
                window.innerWidth / 2 - cardPosition.left - 150
              }px, ${window.innerHeight / 2 - cardPosition.top - 190}px)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardView {...scoreCards[activeCard]} owned={owned.includes(scoreCards[activeCard].title)} />
            {!owned.includes(scoreCards[activeCard].title) && (
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #15daab, #fa208e, #bd2f7f)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "12px",
                }}
                onClick={() =>
                  handleBuy(
                    scoreCards[activeCard].title,
                    scoreCards[activeCard].price
                  )
                }
              >
                Buy for {scoreCards[activeCard].price} Coins
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box> */}
  </>
}
