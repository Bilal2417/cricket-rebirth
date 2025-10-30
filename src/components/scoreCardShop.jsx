import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { GiCricketBat, GiTrophy, GiWorld } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export default function ScoreCardShop() {
  const modePacks = [
    {
      id: 1,
      title: "Asian ScoreCard",
      value: 100,
      price: 2500,
      description:
        // "A beginner-friendly scorecard for quick matches and practice. Ideal to get started and track your progress.",
        "Covers teams— Pakistan, India, Bangladesh, Sri Lanka and West Indies. You can open detailed scorecards for these teams and track every ball.",
      icon: <GiCricketBat size={40} />,
      color: "#ff6b6b",
      borderColor: "#ff8787",
    },
    {
      id: 2,
      title: "SENA ScoreCard",
      value: 200,
      price: 4000,
      description:
        // "Advanced scorecard for longer matches and detailed stats. Perfect for competitive players wanting deeper insights.",
        "Includes teams from SENA countries — South Africa, New Zealand, England, and Australia. Detailed scorecards available for these matches.",

      icon: <GiTrophy size={40} />,
      color: "#54a0ff",
      borderColor: "#74c0fc",
    },
    {
      id: 3,
      title: "World Cup ScoreCard",
      value: 300,
      price: 7500,
      description:
        // "Premium scorecard to record epic tournaments. Track top performances and unlock special achievements globally.",
        "World Cup mode — unlock advance ICC tournament scorecards for global tournaments and relive legendary match moments in full details.",
      icon: <GiWorld size={40} />,
      color: "#00b894",
      borderColor: "#55efc4",
    },
  ];

  const [Profile, setProfile] = useState(() => {
    const storedProfile = sessionStorage.getItem("UserProfile");
    return storedProfile
      ? JSON.parse(storedProfile)
      : { coins: 500, unlocked_items: [] };
  });

  const navigate = useNavigate();
  const handleUnlock = (pack) => {
    if (!Profile) return;

    if (Profile.coins >= pack.price) {
      sessionStorage.setItem("value", pack?.value);
      navigate("/scoreBoardOpening");
    } else {
      toast.error("Not enough coins!");
    }
  };

  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const packRefs = useRef([]);

  const handleClick = (index) => {
    const rect = packRefs.current[index].getBoundingClientRect();
    setCardPosition({ top: rect.top, left: rect.left });
    setActiveCard(index);
  };

  const handleClose = () => setActiveCard(null);

  const CardDesign = ({ pack, index, isActive = false }) => (
    <motion.div
      whileHover={!isActive ? { scale: 1.03, y: -5 } : {}}
      whileTap={!isActive ? { scale: 0.97 } : {}}
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={(el) => (packRefs.current[index] = el)}
      onClick={() => !isActive && handleClick(index)}
    >
      <Card
        sx={{
          width: 300,
          height: 380,
          borderRadius: "20px",
          backgroundColor: "#fff",
          border: `2px solid ${pack?.borderColor}`,
          color: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          overflow: "hidden",
          position: "relative",
          transform: isActive ? "scale(1.05)" : "none",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Top Icon */}
        <Box
          sx={{
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pack?.color,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pack?.icon}
          </Box>
        </Box>

        <CardContent sx={{ textAlign: "center", p: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: pack?.color }}
          >
            {pack?.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.9, mb: 3, color: "#333" }}
          >
            {pack?.description}
          </Typography>

          <Button
            sx={{
              backgroundColor: pack?.color,
              color: "#fff",
              borderRadius: "16px",
              px: 3,
              py: 1,
              fontWeight: 600,
              width: "100%",
              "&:hover": { backgroundColor: pack?.borderColor },
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive) {
                handleUnlock(pack);
              } else {
                handleClick(index);
              }
            }}
          >
            {pack?.price} Coins
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  useEffect(() => {
    if (!localStorage.getItem("packs")) {
      localStorage.setItem("packs", JSON.stringify([]));
    }
  }, []);

  const boardData = JSON.parse(localStorage.getItem("boardData")) || [];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
        }}
      >
        {modePacks
          .filter((f) => !boardData?.values?.includes(f.value))
          .map((pack, index) => (
            <CardDesign key={pack.id} pack={pack} index={index} />
          ))}
      </Box>

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
            <CardDesign
              pack={modePacks[activeCard]}
              index={activeCard}
              isActive={true}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
