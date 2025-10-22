import { Box, Typography } from "@mui/material";
import Wc19 from "../components/wc19";
import Wc24 from "../components/wc24";
import AUS from "../components/aus";
import { useState } from "react";
import { Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import BAN from "../components/ban";
import SRI from "../components/sri";
import Wc21 from "../components/wc21";
import Wc22 from "../components/wc22";
import Ct25 from "../components/ct25";
import NZ from "../components/nz";
import StarterScoreboard from "../components/starter";

export default function ScoreBoards() {
  const [active, setActive] = useState();

  const scoreCards = [
    {
      key: "starter",
      board: <StarterScoreboard />,
    },
    {
      key: "ban",
      board: <BAN />,
    },
    {
      key: "sri",
      board: <SRI />,
    },
    {
      key: "nz",
      board: <NZ />,
    },
    {
      key: "aus",
      board: <AUS />,
    },
    {
      key: "wc19",
      board: <Wc19 />,
    },
    {
      key: "wc21",
      board: <Wc21 />,
    },
    {
      key: "wc22",
      board: <Wc22 />,
    },
    {
      key: "wc24",
      board: <Wc24 />,
    },
    {
      key: "ct25",
      board: <Ct25 />,
    },
  ];

  const Board = localStorage.getItem("Board")
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
                  outline: index == active || Board == score.key ? "8px solid #fff" : null,
                  filter: active == index || Board == score.key ? "grayscale(0%" : "grayscale(100%)",
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
                <br/>
                <br/>
                {score.board}
              </Box>
            </>
          );
        })}
      </Box>
    </>
  );
}
