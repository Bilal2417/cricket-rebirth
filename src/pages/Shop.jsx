import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import CardPacksShop from "../components/card";
import {
  EmojiEvents,
  EmojiEventsSharp,
  Help,
  SportsKabaddiOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModePack from "../components/modePacks";
import ScoreCardShop from "../components/scoreCardShop";
import { GiTrophy, GiWorld } from "react-icons/gi";

export default function Shop({ profile }) {
  const [unlocked, setUnlocked] = useState(false);
  const [focused, setFocused] = useState();

  localStorage.removeItem("rewards");
  sessionStorage.removeItem("canOpen");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 4,
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          p: 4,
          mt: 4,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        {/* Example Pack Cards */}
        <CardPacksShop />

        {/* World Cup Button */}
        <ModePack
          title="WORLD CUP ACCESS"
          value="worldcup"
          price={10000}
          icon={<GiWorld size={40} style={{ color: "#fff" }} />}
          iconGrad="radial-gradient(circle at center, #00b894, #55efc4)"
          gradient="linear-gradient(135deg, #00b894, #55efc4)"
          isFocused={focused === "world"}
          onClick={() => setFocused(focused === "world" ? null : "world")}
          description="Unlock the exclusive World Cup Mode — face 10 teams in the grand tournament."
        />

        <ModePack
          title="KNOCKOUT ACCESS"
          value="knockout"
          price={5000}
          icon={<GiTrophy size={40} style={{ color: "#fff" }} />}
          iconGrad="radial-gradient(circle at center, #ff6b6b, #f06595)"
          gradient="linear-gradient(135deg, #ff6b6b, #f06595)"
          isFocused={focused === "knockout"}
          onClick={() => setFocused(focused === "knockout" ? null : "knockout")}
          description="Unlock the Knockout Mode — play quarterfinals to finals for massive rewards!"
        />

        <ScoreCardShop />
        {/* score boards coming soon... */}
      </Box>
    </>
  );
}
