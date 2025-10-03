import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

// Reusable CardPack component
const CardPack = ({ title, description, colors, icon, price }) => {
  return (
    <Card
      sx={{
        width: 280,
        height: 380,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        color: "#fff",
        position: "relative",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.05)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        },
      }}
    >
      {/* Icon */}
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

      {/* Content */}
      <CardContent sx={{ textAlign: "center" }}>
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
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition:
              "transform 0.35s ease, box-shadow 0.35s ease, filter 0.35s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
              filter: "brightness(1.03)",
            },
          }}
          onClick={() => alert(`Opening ${title} (dummy)`)}
        >
          {price ? `Buy for ${price} Coins` : "Open Pack"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Dummy shop with multiple packs
export default function CardPacksShop() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 4,
        justifyContent: "center",
        mt: 4,
        p: 2,
      }}
    >
      <CardPack
        title="Bronze Pack"
        description="Contains 3 dummy cards. Basic level players."
        colors={["#8d5524", "#d2691e"]}
        icon={<SportsCricketIcon sx={{ fontSize: 80, color: "#FFD39B" }} />}
        price={100}
      />

      <CardPack
        title="Silver Pack"
        description="Contains 5 dummy cards. Chance of rare players."
        colors={["#bdc3c7", "#2c3e50"]}
        icon={<SportsCricketIcon sx={{ fontSize: 80, color: "#C0C0C0" }} />}
        price={250}
      />

      <CardPack
        title="Gold Pack"
        description="Contains 7 dummy cards. Higher chance of rare pulls!"
        colors={["#FFD700", "#FF8C00"]}
        icon={<SportsCricketIcon sx={{ fontSize: 80, color: "#FFD700" }} />}
        price={500}
      />

      <CardPack
        title="Legendary Pack"
        description="Contains 10 dummy cards. Guaranteed rare!"
        colors={["#7b4397", "#dc2430"]}
        icon={<SportsCricketIcon sx={{ fontSize: 80, color: "#FF4500" }} />}
        price={1000}
      />
    </Box>
  );
}
