import { Box, Grid } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Selection() {
  const [teams] = useState(Data); // teams are fixed
  const navigate = useNavigate();

  // Function to select AI team
  function AiTeamSelection(selectedTeam) {
    // setUserTeam(selectedTeam);

    const availableTeams = teams.filter((t) => t.name !== selectedTeam);
    const aiTeam =
      availableTeams[Math.floor(Math.random() * availableTeams.length)];
    localStorage.setItem("User", selectedTeam);
    localStorage.setItem("Ai", aiTeam.name);
    const page = sessionStorage.getItem("mode")
    if(page == "KNOCKOUT"){
      navigate("/knockout");

    }else{
      navigate("/toss");
    }
  }

  useEffect(() => {
    localStorage.removeItem("cricketData");
  }, []);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {teams.map((team, index) => (
          <Grid
            item
            // xs={6}
            // sm={3}
            // md={12}
            key={index}
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
                width: "90px",
                height: "60px",
                boxShadow: "3px 3px 8px -2px #000000",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
