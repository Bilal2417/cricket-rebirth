import { Box, Grid } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Selection() {
  const [teams] = useState(Data); // teams are fixed
  const navigate = useNavigate();

  // Function to select AI team
  function AiTeamSelection(selectedTeam) {
    const availableTeams = teams.filter((t) => t.name !== selectedTeam);
    const aiTeam =
      availableTeams[Math.floor(Math.random() * availableTeams.length)];
    localStorage.setItem("User", selectedTeam);
    localStorage.setItem("Ai", aiTeam.name);

    const page = sessionStorage.getItem("mode");
    if (page === "KNOCKOUT") {
      navigate("/knockout");
    } else {
      navigate("/toss");
    }
  }

  useEffect(() => {
    localStorage.removeItem("cricketData");
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {teams.map((team, index) => (
          <Grid
            item
            key={index}
            xs={6}   // 2 per row on extra small screens
            sm={4}   // 3 per row on small screens
            md={3}   // 4 per row on medium screens
            lg={2}   // 6 per row on large screens
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
              AiTeamSelection(team.name);
            }}
          >
            <img
              src={team.flag}
              alt={team.name}
              style={{
                width: "100%",      // responsive scaling
                maxWidth: "120px",  // prevent oversized
                height: "auto",
                borderRadius: "6px",
                boxShadow: "3px 3px 8px -2px #000000",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
