import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Toss() {
  const [result, setResult] = useState(null);
  const [tossWin, setTossWin] = useState(false);
  const [inningsChoice, setInningsChoice] = useState(null);

  const isTournament = sessionStorage.getItem("mode");

  const board = localStorage.getItem("Board");
  const navigate = useNavigate();

  const colors = {
    // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
    wc19: "#222589  ",
    wc21: "#f83059 ", //f83059
    wc22: "#d71c59", //de265c
    ct25: "#02c208",
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

    const updatedProfile = {
      ...Profile,
      id: Profile?.id,
      trophies:
        Profile.trophies - (totalWkts == 100 ? 5 : Math.ceil(penalty / 2)),
    };

    setProfile(updatedProfile);
    console.log(updatedProfile,"/toss before");

    try {
      const res = await fetch("/.netlify/functions/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        console.log(data.profile,"/toss");
        sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));
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
                    color: "#FFFFFF",
                    backgroundColor: "#0f0648",
                    borderBottom: `4px solid ${colors[board] || "#fa208e"}`,
                    borderRight: `4px solid ${colors[board] || "#fa208e"}`,
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
                    color: "#FFFFFF",
                    backgroundColor: "#0f0648",
                    borderBottom: `4px solid ${colors[board] || "#fa208e"}`,
                    borderRight: `4px solid ${colors[board] || "#fa208e"}`,
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
