import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Data from "../components/data";

export default function Toss() {
  const [result, setResult] = useState(null);
  const [tossWin, setTossWin] = useState(false);
  const [inningsChoice, setInningsChoice] = useState(null);

  const isTournament = sessionStorage.getItem("mode");

  const board = localStorage.getItem("Board");
  const navigate = useNavigate();
  const Teams = Data;

  const colors = {
    // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
    wc19: "#222589  ",
    wc21: "#f83059 ", //f83059
    wc22: "#d71c59", //de265c
    wc24: "#fa208e",
    ct25: "#02c208",
    wtc: "#000",
  };

  const backColor = {
    wc21: "linear-gradient(to bottom , rgb(113 17 233) , rgb(83 6 189) ) ", //5221ba
    wc22: "linear-gradient(to bottom , rgb(15 185 217) , rgb(17 143 166) ) ", //5221ba
    wtc: "linear-gradient(to bottom , #a99981 , #ece5d3 , #a99981)", //5221ba
  };

  const handleToss = (choice) => {
    const coinFlip = Math.random() < 0.5 ? "Heads" : "Tails";
    const winner = coinFlip === choice ? "user" : "ai";

    if (isTournament !== "KNOCKOUT") {
      decrementTrophies();
    }

    setResult(winner);
    console.log(`Coin: ${coinFlip}, Winner: ${winner}`);

    if (winner === "ai") {
      const innings = Math.random() < 0.5 ? "Bat" : "Ball";
      localStorage.setItem("Innings", innings);
      localStorage.setItem("currentInnings", 1);
      setInningsChoice(innings);
      navigate("/gamePlay");
    } else {
      setTossWin(true);
    }
  };

  const handleInnings = (choice) => {
    localStorage.setItem("Innings", choice);
    localStorage.setItem("currentInnings", 1);
    navigate("/gamePlay");
    // window.location.reload();
  };

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [totalWkts, setTotalWkts] = useState(null);

  useEffect(() => {
    const overs = localStorage.getItem("Overs");
    setTotalWkts(overs ? Number(overs) : 0);
  }, []);

  const decrementTrophies = async () => {
    const userMatch = JSON.parse(sessionStorage.getItem("latestUserMatch"));
    const ai = localStorage.getItem("Ai");
    const user = localStorage.getItem("User");

    if (userMatch) {
      const updatedMatch = {
        ...userMatch,
        winner: ai,
        loser: user,
      };
      sessionStorage.setItem("latestUserMatch", JSON.stringify(updatedMatch));
    }
    if (!Profile) return;

    const trophyMap = {
      1: 1,
      3: 3,
      5: 5,
      10: 10,
      20: 15,
      100: 5,
    };

    const penalty = trophyMap[totalWkts];
    const givenMode = sessionStorage.getItem("mode");
    const userTeam = Data.find((team) => team.name == user);
    const aiTeam = Data.find((team) => team.name == ai);
    const battleLog = {
      team1: {
        name: userTeam?.name,
        runs: userTeam?.score,
        wickets: userTeam?.wicket,
        overs: userTeam?.Over,
        balls: userTeam?.Ball,
        flags: userTeam?.flag,
      },
      team2: {
        name: aiTeam?.name,
        runs: aiTeam?.score,
        wickets: aiTeam?.wicket,
        overs: aiTeam?.Over,
        balls: aiTeam?.Ball,
        flags: aiTeam?.flag,
      },
      result: "Defeat",
      trophies:
        givenMode == "CONTEST" ||
        givenMode == "TOURNAMENT" ||
        givenMode == "KNOCKOUT"
          ? 0
          : totalWkts == 100
          ? 5
          : Math.ceil(penalty / 2),
      mode: givenMode,
      time: new Date().toISOString(),
    };

    const updatedProfile = {
      ...Profile,
      id: Profile?.id,
      trophies:
        givenMode == "CONTEST" ||
        givenMode == "TOURNAMENT" ||
        givenMode == "KNOCKOUT"
          ? Profile.trophies
          : Profile.trophies - (totalWkts == 100 ? 5 : Math.ceil(penalty / 2)),
      tickets:
        givenMode == "CONTEST"
          ? Math.max(0, Number(Profile.tickets || 0) - 1)
          : Number(Profile.tickets || 0),
      battle_log: battleLog,
      // points: null,
    };

    setProfile(updatedProfile);
    console.log(updatedProfile, "/toss before");

    try {
      const res = await fetch("/.netlify/functions/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedProfile,
          source: "toss", // 👈 Add this line
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile((prev) => {
          const merged = { ...prev, ...data.profile };
          sessionStorage.setItem("UserProfile", JSON.stringify(merged));
          console.log(merged, "merged toss");
          return merged;
        });

        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        console.error("Failed to update trophies in database");
      }
    } catch (err) {
      console.error("Error updating trophies:", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        {!tossWin ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {["Heads", "Tails"].map((choice, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  fullWidth
                  sx={{
                    color: board == "wtc" ? "#000000" : "#FFFFFF",
                    background: backColor[board] || "#0f0648",
                    borderBottom: `4px solid ${
                      colors[board] || "rgb(65, 38, 255)"
                    }`,
                    borderRight: `4px solid ${
                      colors[board] || "rgb(65, 38, 255)"
                    }`,
                    borderRadius: "12px",
                    transform: "skew(-5deg)",
                    width: "120px",
                    fontWeight: 600,
                    padding: "12px 16px",
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    ":hover": {
                      transform: "scale(1.05)",
                      transition: "all 0.3s",
                    },
                  }}
                  onClick={() => handleToss(choice)}
                >
                  {choice}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {["Bat", "Ball"].map((choice, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  fullWidth
                  sx={{
                    color: board == "wtc" ? "#000000" : "#FFFFFF",
                    background: backColor[board] || "#0f0648",
                    borderBottom: `4px solid ${
                      colors[board] || "rgb(65, 38, 255)"
                    }`,
                    borderRight: `4px solid ${
                      colors[board] || "rgb(65, 38, 255)"
                    }`,
                    borderRadius: "12px",
                    width: "120px",
                    transform: "skew(-5deg)",
                    fontWeight: 600,
                    padding: "12px 16px",
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    ":hover": {
                      transform: "scale(1.05)",
                      transition: "all 0.3s",
                    },
                  }}
                  onClick={() => handleInnings(choice)}
                >
                  {choice}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}
