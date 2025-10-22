import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { GiCricketBat, GiTrophy, GiWorld } from "react-icons/gi";

export default function ScoreCardShop() {
const modePacks = [
  {
    id: 1,
    title: "Asian ScoreCard",
    value: 100,
    price: 50,
    description:
      "A beginner-friendly scorecard for quick matches and practice. Ideal to get started and track your progress.",
    icon: <GiCricketBat size={40} />,
    color: "#ff6b6b",
    borderColor: "#ff8787",
  },
  {
    id: 2,
    title: "SENA ScoreCard",
    value: 200,
    price: 120,
    description:
      "Advanced scorecard for longer matches and detailed stats. Perfect for competitive players wanting deeper insights.",
    icon: <GiTrophy size={40} />,
    color: "#54a0ff",
    borderColor: "#74c0fc",
  },
  {
    id: 3,
    title: "World Cup ScoreCard",
    value: 300,
    price: 250,
    description:
      "Premium scorecard to record epic tournaments. Track top performances and unlock special achievements globally.",
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

  const handleUnlock = (pack) => {
    if (Profile.unlocked_items.includes(pack.value)) return;

    if (Profile.coins >= pack.price) {
      const updatedProfile = {
        ...Profile,
        coins: Profile.coins - pack.price,
        unlocked_items: [...Profile.unlocked_items, pack.value],
      };
      setProfile(updatedProfile);
      sessionStorage.setItem("UserProfile", JSON.stringify(updatedProfile));
      toast.success(`🎉 ${pack.title} unlocked!`);
    } else {
      toast.error("Not enough coins!");
    }
  };

  const CardDesign = ({ pack }) => {
    const unlocked = Profile.unlocked_items.includes(pack.value);

    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.97 }}
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: 300,
            height: 380,
            borderRadius: "20px",
            backgroundColor: "#fff",
            border: `2px solid ${pack.borderColor}`,
            color: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top Icon */}
          <Box
            sx={{
              height: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pack.color,
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
              {pack.icon}
            </Box>
          </Box>

          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, color: pack.color }}
            >
              {pack.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, mb: 3, color: "#333" }}
            >
              {pack.description}
            </Typography>

            {!unlocked ? (
              <Button
                sx={{
                  backgroundColor: pack.color,
                  color: "#fff",
                  borderRadius: "16px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  width: "100%",
                  "&:hover": { backgroundColor: pack.borderColor },
                }}
                onClick={() => handleUnlock(pack)}
              >
                {pack.price} Coins
              </Button>
            ) : (
              <Box
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "12px",
                  py: 1.3,
                  mt: 2,
                }}
              >
                ✅ Unlocked
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 5,
        justifyContent: "center",
      }}
    >
      {modePacks.map((pack) => (
        <CardDesign key={pack.id} pack={pack} />
      ))}
    </Box>
  );
}
