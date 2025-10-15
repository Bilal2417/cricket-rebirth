import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ModePack({
  title,
  value,
  price,
  // unlocked,
  icon,
  gradient,
  description,
}) {
  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const packRefs = useRef([]);

  const handleClick = (index) => {
    const rect = packRefs.current[index].getBoundingClientRect();
    setCardPosition({ top: rect.top, left: rect.left });
    setActiveCard(index);
  };

  const handleClose = () => setActiveCard(null);

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const handleCardClick = async (price, isActive , key ) => {
    const profileId = localStorage.getItem("MyId");
    if (isActive && price <= Profile?.coins) {
      
      const updatedProfile = {
        ...Profile,
        id: profileId || Profile?.id,
        coins: Profile.coins - price,
        unlocked_items: [...currentItems, newItem],
      };
      const currentItems = updatedProfile.unlocked_items || [];
      const newItem = key;
      
      try {
        const res = await fetch("/.netlify/functions/updateProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
          console.log(data.profile);
          sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));

          window.dispatchEvent(new Event("profileUpdated"));
        } else {
          console.error(
            "Failed to update tournaments in database:",
            data.error
          );
        }
      } catch (err) {
        console.error("Error updating tournaments:", err);
      }
    } else if (isActive && (price > Profile?.coins || Profile?.coins == null))
      [toast.error("Not enough coins!")];
  };

  const CardDesign = ({ isActive = false, index }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      style={{
        perspective: 1000,
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
          borderRadius: "24px",
          overflow: "hidden",
          background: gradient,
          color: "#fff",
          boxShadow: Profile?.unlocked_items?.includes(value)
            ? "0 0 25px 5px rgba(21, 218, 171, 0.5)"
            : "0 0 25px 5px rgba(250, 32, 142, 0.4)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          "&:hover": {
            cursor: isActive ? "default" : "cursor",
            boxShadow: Profile?.unlocked_items?.includes(value)
              ? "0 0 35px 10px rgba(21, 218, 171, 0.8)"
              : "0 0 35px 10px rgba(250, 32, 142, 0.8)",
          },
        }}
      >
        {/* Top glow line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: Profile?.unlocked_items?.includes(value)
              ? "linear-gradient(90deg, #15daab, #00ffb7)"
              : "linear-gradient(90deg, #fa208e, #bd2f7f)",
            boxShadow: Profile?.unlocked_items?.includes(value)
              ? "0 0 20px 5px #15daab"
              : "0 0 20px 5px #fa208e",
          }}
        />

        <CardContent sx={{ textAlign: "center", p: 0 }}>
          <Box
            sx={{ p: 3, height: "160px", background: "rgba(255,255,255,0.15)" }}
          >
            <Box
              sx={{
                width: "90px",
                height: "90px",
                background:
                  "radial-gradient(circle at center, #fa208e, #8b0ef0)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: Profile?.unlocked_items?.includes(value)
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
                color: Profile?.unlocked_items?.includes(value) ? "#15daab" : "#fff",
              }}
            >
              {title}
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, px: 2 }}>
              {description}
            </Typography>

            {!Profile?.unlocked_items?.includes(value) ? (
              <Box
                sx={{
                  background:
                    "linear-gradient(90deg, #15daab, #fa208e, #bd2f7f)",
                  borderRadius: "20px",
                  p: "1px",
                  width: "200px",
                  m: "auto",
                  mt: 2,
                }}
              >
                <Button
                  sx={{
                    background: "#0f0648",
                    borderRadius: "20px",
                    px: 4,
                    py: 1,
                    width: "100%",
                    color: "#15daab",
                    fontWeight: 600,
                  }}
                  onClick={() => Profile?.unlocked_items?.includes(value) ? null : handleCardClick(price, isActive ,value)}
                >
                  {price} Coins
                </Button>
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
                ✅ Mode Unlocked
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      {/* Base Pack */}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CardDesign index={0} />
      </Box>

      {/* Popup Overlay */}
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
            <CardDesign index={0} isActive={true} />
          </Box>
        </Box>
      )}
    </>
  );
}
