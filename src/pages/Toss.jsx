import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Toss() {
  const [result, setResult] = useState(null);
  const [tossWin, setTossWin] = useState(false);
  const [inningsChoice, setInningsChoice] = useState(null);
  const navigate = useNavigate();
  const isTournament = sessionStorage.getItem("mode");

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

  const storedProfile = sessionStorage.getItem("Profile");
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

    const penalty = Number(totalWkts) === 100 ? 5 : Math.ceil(totalWkts / 2);
    // const originalTrophies = Profile.trophies
    const updatedProfile = {
      ...Profile,
      trophies: Math.max(Profile.trophies - Math.ceil(penalty/2), 0),
    };
    // sessionStorage.setItem("original",originalTrophies)
    setProfile(updatedProfile);

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
        sessionStorage.setItem("Profile", JSON.stringify(data.profile));
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
                    borderBottom: "2px solid #fa208e",
                    borderRight: "2px solid #fa208e",
                    borderRadius: "12px",
                    // fontfamily: "Rubik",
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
                    borderBottom: "2px solid #fa208e",
                    borderRight: "2px solid #fa208e",
                    borderRadius: "12px",
                    // fontfamily: "Rubik",
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
