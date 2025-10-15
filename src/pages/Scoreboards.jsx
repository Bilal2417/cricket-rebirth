import { Box, Typography } from "@mui/material";
import Wc19 from "../components/wc19";
import Wc24 from "../components/wc24";
import AUS from "../components/aus";
import { useState } from "react";
import { Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import BAN from "../components/ban";

export default function ScoreBoards() {
  const [active, setActive] = useState();

  const scoreCards = [
    {
      key: "ban",
      board: <BAN />,
    },
    {
      key: "wc19",
      board: <Wc19 />,
    },
    {
      key: "wc24",
      board: <Wc24 />,
    },
    {
      key: "aus",
      board: <AUS />,
    },
  ];

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px",
          mt: "100px",
        }}
      >
        <Typography variant="h2">SCOREBOARDS</Typography>
        {scoreCards.map((score, index) => {
          return (
            <>
              <Box
                key={index}
                sx={{
                  width: "100%",
                  p: 2,
                  backdropFilter: "blur(10px)",
                  borderRadius: "24px",
                  outline: index == active ? "8px solid #fff" : null,
                  filter: active == index ? "grayscale(0%" : "grayscale(100%)",
                  transition: "all 0.3s",
                  textTransform: "uppercase",
                  pt : "100px",
                  ":hover": {
                    transition: "all 0.3s",
                    filter: "grayscale(0%)",
                    cursor: "pointer",
                    boxShadow: `0 0 60px 7px black`,
                  },
                }}
                onClick={() => {
                  if (Profile?.unlocked_items?.includes(score.key)) {
                    setActive(index);
                    localStorage.setItem("Board", score.key);
                  } else {
                    toast.error("Unlock from Shop!");
                  }
                }}
              >
                {!Profile?.unlocked_items?.includes(score.key) && (
                  <Lock
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: 50,
                      color: "#000",
                    }}
                  />
                )}
                {score.key}
                {score.board}
              </Box>
            </>
          );
        })}
      </Box>
    </>
  );
}
