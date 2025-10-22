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

export default function Shop({ profile }) {
  const [unlocked, setUnlocked] = useState(false);
  const [focused, setFocused] = useState();
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
          price={5000}
          icon={<EmojiEvents sx={{ fontSize: 50, color: "#fff" }} />}
          gradient="linear-gradient(180deg, #0f0648 0%, #1b1063 40%, #fa208e 100%)"
          isFocused={focused === "world"}
          onClick={() => setFocused(focused === "world" ? null : "world")}
          description="Unlock the exclusive World Cup Mode — face 10 teams in the grand tournament."
        />

        <ModePack
          title="KNOCKOUT ACCESS"
          value="knockout"
          price={2500}
          icon={<SportsKabaddiOutlined sx={{ fontSize: 50, color: "#fff" }} />}
          gradient="linear-gradient(180deg, #061c48 0%, #102b63 40%, #20faf0 100%)"
          isFocused={focused === "knockout"}
          onClick={() => setFocused(focused === "knockout" ? null : "knockout")}
          description="Unlock the Knockout Mode — play quarterfinals to finals for massive rewards!"
        />

        {/* <ScoreCardShop/> */}
        score boards coming soon...
      </Box>
    </>
  );
}
