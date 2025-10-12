import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ CardPack should RETURN JSX (you forgot 'return')

export default function CardPacksShop({ profile }) {
  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const cardRefs = useRef([]);
  const navigate = useNavigate();

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const allPacks = [
    {
      title: "Starter Pack",
      description: "Begin your journey! Contains 2 basic cards to get started.",
      colors: ["#00b894", "#55efc4"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#00fff0" }} />,
      price: "Free",
      packKey: "Starter",
    },
    {
      title: "Bronze Pack",
      description: "Contains 3 cards with a chance to get Bronze-level Teams.",
      colors: ["#8d5524", "#d2691e"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FFD39B" }} />,
      price: 1000,
      packKey: "Bronze",
    },
    {
      title: "Silver Pack",
      description:
        "Contains 5 cards. Guaranteed Bronze Teams with a chance to pull Silver Teams.",
      colors: ["#bdc3c7", "#2c3e50"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#C0C0C0" }} />,
      price: 2500,
      packKey: "Silver",
    },
    {
      title: "Gold Pack",
      description:
        "Contains 7 cards. Guaranteed Silver Teams with a chance to get Gold Teams.",
      colors: ["#FFD700", "#FF8C00"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FFD700" }} />,
      price: 5000,
      packKey: "Gold",
    },
    {
      title: "Legendary Pack",
      description:
        "Contains 10 cards. Guaranteed Gold Teams with a chance to pull Legendary Teams.",
      colors: ["#7b4397", "#dc2430"],
      icon: <SportsCricketIcon sx={{ fontSize: 80, color: "#FF4500" }} />,
      price: 10000,
      packKey: "Legendary",
    },
  ];

  const [packs, setPacks] = useState([]);
  const [starter, setStarter] = useState(localStorage.getItem("collectedStarter"));

  useEffect(() => {
    // const starter = ;
    if (!starter) {
      setPacks(allPacks.filter((pack) => pack.packKey !== "Starter"));
    } else {
      setPacks(allPacks);    
    }
  }, [starter]);

  const handleClick = (pack, index) => {
    const rect = cardRefs.current[index].getBoundingClientRect();
    setCardPosition({ top: rect.top, left: rect.left });
    // if (activeCard !== null) navigate(`/open-pack/${pack.packKey}`);
    setActiveCard(index);

    // You don’t need this check — navigate right away
  };

  const handleClose = () => setActiveCard(null);

  const CardPack = ({
    title,
    description,
    colors,
    icon,
    price,
    packKey,
    isActive,
  }) => {
    const navigate = useNavigate();

    const profileId = localStorage.getItem("MyId");

    const handleCardClick = async () => {
      if (isActive && (price <= Profile.coins || price == "Free") ) {
        sessionStorage.setItem("canOpen", true);

        const updatedProfile = {
          ...Profile,
          id: profileId || Profile?.id,
          coins: Profile.coins - price,
        };

        setProfile(updatedProfile);
        console.log(updatedProfile)
        sessionStorage.setItem("UserProfile",JSON.stringify(updatedProfile))


        navigate(`/open-pack/${packKey}`);
        localStorage.removeItem("collectedStarter")
        setStarter(false)
      } else if (isActive && price > Profile.coins) [toast.error("Not enough coins!")];
    };

    return (
      <Card
        // onClick={handleCardClick}
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
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            cursor: isActive ? "default" : "cursor",
          },
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
            onClick={handleCardClick}
          >
            {!isNaN(price) ? `Buy for ${price} Coins` : price}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: { xs : 2 , lg : 2},
        justifyContent: "center",
        mt: 4,
        p: 2,
        position: "relative",
      }}
    >
      {packs.map((pack, index) => (
        <Box
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          sx={{
            animation: isNaN(pack.price)
              ? "float 1.5s ease-in-out infinite alternate"
              : null,
            "@keyframes float": {
              "0%": { transform: "translateY(0px)" },
              "100%": { transform: "translateY(-10px)" },
            },
          }}
          onClick={() => handleClick(pack, index)}
        >
          <CardPack
            {...pack}
            isActive={false}
            onClick={() => setActiveCard(index)}
          />
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
            <CardPack
              isActive={true}
              starter={true}
              coins={profile?.coins}
              {...packs[activeCard]}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
