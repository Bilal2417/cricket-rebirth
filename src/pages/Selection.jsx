import { Box, Grid } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Selection() {
  const [teams] = useState(Data);
  const navigate = useNavigate();

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  function AiTeamSelection(selectedTeam) {
    const availableTeams = teams.filter((t) => t.name !== selectedTeam);
    const aiTeam =
      availableTeams[Math.floor(Math.random() * availableTeams.length)];
    localStorage.setItem("User", selectedTeam);
    localStorage.setItem("Ai", aiTeam.name);

    const page = sessionStorage.getItem("mode");
    if (page === "KNOCKOUT") {
      navigate("/knockout");
    } else if (page === "TOURNAMENT") {
      navigate("/tournament");
    } else {
      navigate("/toss");
    }
  }

  useEffect(() => {
    localStorage.removeItem("cricketData");
  }, []);

  return (
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
      <Grid container spacing={2} justifyContent="center">
        {teams?.map((team, index) => (
          <Grid
            item
            key={index}
            xs={6} // 2 per row on extra small screens
            sm={4} // 3 per row on small screens
            md={3} // 4 per row on medium screens
            lg={2} // 6 per row on large screens
            sx={{
              ":hover": {
                cursor: "pointer",
                transform: "scale(1.1)",
                ":active": { transform: "scale(0.9)" },
                transition: "all 0.3s",
              },
              textAlign: "center",
            }}
            onClick={() => {
              Profile?.unlocked_teams?.includes(team?.name) ? AiTeamSelection(team?.name) : toast.error("Team not unlocked!")
            }}
          >
            <img
              src={team?.flag}
              alt={team?.name}
              style={{
                // width: "100%",
                height: "auto",
                borderRadius: "6px",
                boxShadow: "3px 3px 8px -2px #000000",
                width: "100px",
                objectFit : "cover",
                filter: Profile?.unlocked_teams?.includes(team?.name) ? "none" : "grayscale(100%)",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
