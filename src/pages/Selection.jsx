import { Box, Grid, Typography } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Person } from "@mui/icons-material";
import { supabase } from "../supabaseClient";

export default function Selection() {
  const mode = sessionStorage.getItem("mode");
  const [teams] = useState(() => {
    if (mode == "TOURNAMENT") {
      return Data.filter(
        (team) => team.category !== "Bronze" && team.name !== "Netherlands",
      );
    } else if (mode == "KNOCKOUT") {
      return Data.filter((team) => team.category !== "Bronze");
    } else {
      return Data;
    }
  });
  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : "",
  );

  const [nextPage, setNextPage] = useState(0);

  const profileId = localStorage.getItem("MyId");
  const AiTeamSelection = async (selectedTeam) => {
    const availableTeams = teams.filter((t) => t.name !== selectedTeam);
    const selectedTeamData = teams.find((t) => t.name == selectedTeam);

    const aiTeam =
      availableTeams[Math.floor(Math.random() * availableTeams.length)];
    localStorage.setItem("User", selectedTeam);
    localStorage.setItem("Ai", aiTeam.name);

    const page = sessionStorage.getItem("mode");

    const savingTeamDb = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          onlineScore: selectedTeamData,
        })
        .eq("id", profileId)
        .select()
        .single();

      setNextPage((prev) => {
        const next = prev + 1;
        if (next == 2) {
          navigate("/toss");
        }
        return next;
      });
      localStorage.setItem("Profile", JSON.stringify(data));
      localStorage.setItem("UserProfile", JSON.stringify(data));
      if (error) {
        console.error("Failed to update trophies:", error);
        return;
      }
    };
    await savingTeamDb();
    if (page === "KNOCKOUT") {
      navigate("/knockout");
    } else if (page === "TOURNAMENT") {
      navigate("/tournament");
    } else if (page !== "ONLINE") {
      navigate("/toss");
    }
  };

  useEffect(() => {
    localStorage.removeItem("cricketData");
    // Object.keys(localStorage).forEach((key) => {
    //   if (key !== "MyId" && key !== "FirstVisit" && key !== "boardData") {
    //     localStorage.removeItem(key);
    //   }
    // });
    // sessionStorage.clear()
  }, []);

  const [opposition, setOpposition] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel("onlineSelection")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to ALL events for testing
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          console.log("🔥 REALTIME EVENT:", payload);

          // update picked players live
          // setPickedNames((prev) => {

          if (payload.new.id === profileId) return;
          if (payload.new.onlineScore) {
            setOpposition(payload.new.onlineScore);
            setNextPage((prev) => {
              const next = prev + 1;
              if (next == 2) {
                navigate("/toss");
              }
              return next;
            });
            console.log(payload);
            // if (payload.new.myid == rowId) {
            //   setPlayerData(payload.new);
            //   localStorage.setItem("MyTeam", JSON.stringify(payload.new));
            //   setAuctioneer((prev) => ({
            //     ...prev,
            //     color: payload.new.color,
            //   }));
            // }
          }
          //  else if (payload.new.myid == "forAuction") {
          //   setAuctioneer(payload.new);
          //   setHighestBidder(payload.new.highest_bidder);
          // } else {
          //   setAuctioneer((prev) => ({
          //     ...prev,
          //     color: payload.new.color,
          //   }));
          // }
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCardBackground = (rarity) => {
    switch (rarity) {
      case "Bronze":
        return "linear-gradient(135deg, #8d5524, #d2691e)";
      case "Silver":
        return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      case "Gold":
        return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Legendary":
        return "linear-gradient(135deg, #7b4397, #dc2430)";
      default:
        return "linear-gradient(135deg, #333, #111)";
    }
  };

  const [isDisable, setIsDisable] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        padding: "20px 0",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {teams?.map((team, index) => (
          <Grid
            item
            key={index}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            sx={{
              ":hover": {
                cursor: "pointer",
                transform: "scale(1.1)",
                ":active": { transform: "scale(1)" },
                transition: "all 0.3s",
              },
              textAlign: "center",
            }}
            onClick={() => {
              if (isDisable) {
                toast.error("Aleady Selected!");
              } else {
                if (opposition.name == team?.name) {
                  toast.error("Opponent select this team already !");
                } else {
                  !Profile?.unlocked_teams?.includes(team?.name)
                    ? AiTeamSelection(team?.name)
                    : toast.error("Unlock team from Packs!");
                }
              }
              setIsDisable(true);
            }}
          >
            <Box
              sx={{
                background: getCardBackground(team?.category),
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Person
                sx={{
                  display: opposition.name == team?.name ? "block" : "none",
                  position: "absolute",
                  width: "150px",
                  height: "150px",
                  zIndex: "2",
                  color: "#000000",
                  right: "10%",
                }}
              />
              <Typography padding="2px 0" variant="body1">
                {team?.category}
              </Typography>
              <Box
                component="img"
                src={team?.flag}
                alt={team?.name}
                title={team?.name}
                sx={{
                  // width: "100%",
                  height: "auto",
                  borderRadius: "6px",
                  boxShadow: "3px 3px 8px -2px #000000",
                  maxWidth: { xs: "100px", md: "195px" },
                  objectFit: "cover",
                  transition: "all 0.3s",
                  filter: Profile?.unlocked_teams?.includes(team?.name)
                    ? "none"
                    : "grayscale(100%)",
                  "&:hover": {
                    filter: "grayscale(0%)",
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
