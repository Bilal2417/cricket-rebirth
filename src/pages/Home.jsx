import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  HighlightOff,
  Person,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const keysToClear = ["q1", "q2", "q3", "q4", "s1", "s2", "f", "Teams"];
    keysToClear.forEach((key) => sessionStorage.removeItem(key));

    const keysToClearLocally = [
      "Ai",
      "User",
      "CurrentBowler",
      "FirstInnings",
      "Innings",
      "currentInnings",
      "winner",
    ];
    keysToClearLocally.forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    fetch("/.netlify/functions/getProfile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.profiles) setProfiles(data.profiles);
      })
      .catch((err) => console.error("Error fetching profiles:", err));
  }, []);

  const mode = sessionStorage.getItem("mode");
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "50vh",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#343c53",
            width: "fit-content",
            padding: "5px 20px",
            display: "flex",
            alignContent: "center",
            border: "2px solid #000000",
            borderRadius: "4px",
            boxShadow: "inset 0px -8px 8px -4px #2a3043",
            clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
            color: "#ffffff",
            transition: "all 0.3s",
            ":hover": {
              cursor: "pointer",
              transform: "scale(1.1)",
            },
            ":active": {
              transform: "scale(1)",
            },
          }}
          onClick={() => navigate("/profile")}
        >
          <Person sx={{ color: "#FFFFFF" }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontFamily: "Rubik",
              }}
              variant="h5"
            >
              LeaderBoard
            </Typography>

            <Box
              sx={{
                maxHeight: "500px",
              }}
            >
              {profiles?.map((profile, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#343c53",
                      minWidth: "300px",
                      padding: "5px 20px",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      boxShadow: "inset 0px -8px 8px -4px #2a3043",
                      clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                      color: "#ffffff",
                      transition: "all 0.3s",
                      ":hover": {
                        cursor: "pointer",
                        transform: "scale(1.1)",
                      },
                      ":active": {
                        transform: "scale(1)",
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{profile?.name}</Typography>
                    </Box>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      variant="body1"
                    >
                      <EmojiEventsTwoTone
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fill: "none",
                          },
                          "& path:first-of-type": { fill: "#FFD700" },
                          "& path:last-of-type": { fill: "#DAA520" },
                        }}
                      />
                      {profile?.trophies}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box>
            <Button
              sx={{
                fontFamily: "Rubik",
                backgroundColor: "#343c53",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.1em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #262e40",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => {
                navigate("/modes");
              }}
            >
              {/* <HighlightOff /> */}
              {mode || "SELECT"}
            </Button>

            <Button
              sx={{
                fontFamily: "Rubik",
                backgroundColor: "#f6c401",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.4em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #b7560f",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => {
                navigate("/team");
              }}
            >
              Play
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
