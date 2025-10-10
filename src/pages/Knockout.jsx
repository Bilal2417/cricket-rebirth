import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const allTeams = [
  "India",
  "Pakistan",
  "Australia",
  "England",
  "South Africa",
  "New Zealand",
  "Sri Lanka",
  "Bangladesh",
  "West Indies",
  "Afghanistan",
];

export default function Knockout() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxTeams = 8;

  const userTeam = localStorage.getItem("User");
  useEffect(() => {
    setTeams([userTeam]);

    const interval = setInterval(() => {
      setLoading(true);

      setTimeout(() => {
        setTeams((prev) => {
          if (prev.length < maxTeams) {
            const available = allTeams.filter((t) => !prev.includes(t));
            const randomTeam =
              available[Math.floor(Math.random() * available.length)];
            return [...prev, randomTeam];
          } else {
            clearInterval(interval);
            setLoading(false);
            return prev;
          }
        });
        // setLoading(false);
      }, 800);
    }, 1000);

    return () => clearInterval(interval);
  }, [userTeam]);

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          // fontfamily: "Rubik",
          color: "#FFFFFF",
          fontWeight: 600,
        }}
        variant="h4"
        gutterBottom
      >
        Tournament Teams
      </Typography>

      <List
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(4, auto)",
        }}
      >
        {teams.map((team, i) => {
          // Determine column and row positions
          const isRightColumn = i >= 4;
          const row = isRightColumn ? 8 - i : i + 1;
          const col = isRightColumn ? 2 : 1;

          return (
            <ListItem
              key={i}
              onClick={() => navigate("/ProfileData", { state: { teams } })}
              sx={{
                // fontfamily: "Rubik",
                color: "#FFFFFF",
                gridColumn: col,
                gridRow: row,
                display: "flex",
                alignItems: "center",
                width: "155px",
                justifyContent: "space-between",
                paddingLeft: i < 4 ? "16px" : "0px",
              }}
            >
              {team}{" "}
              <span style={{ display: i < 4 ? "inline-block" : "none" }}>
                vs
              </span>
            </ListItem>
          );
        })}
      </List>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress sx={{ color: "#FFFFFF" }} size={24} />
        </Box>
      )}
      {!loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            sx={{
              // fontfamily: "Rubik",
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
              // sessionStorage.setItem(("Teams" , JSON.stringify(teams)))
              sessionStorage.setItem("Teams", JSON.stringify(teams));
              navigate("/fixtures");
            }}
          >
            Start
          </Button>
        </Box>
      )}
    </Box>
  );
}
