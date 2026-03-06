import { Box, Button, Grid, Typography } from "@mui/material";
import { colors } from "../App";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const board = localStorage.getItem("Board");

  const profileId = localStorage.getItem("MyId");
  const backColor = {
    wc21: "linear-gradient(to bottom , rgb(113 17 233) , rgb(83 6 189) ) ", //5221ba
    wc22: "linear-gradient(to bottom , rgb(15 185 217) , rgb(17 143 166) ) ", //5221ba
    wtc: "linear-gradient(to bottom , #a99981 , #ece5d3 , #a99981)", //5221ba
  };

  const [created, setCreated] = useState(false);
  const [createdCode, setCreatedCode] = useState(0);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState(0);
  const [storedCode, setStoredCode] = useState([]);
  const navigate = useNavigate();

  const createJoinCode = () => {
    setCreated(true);

    let newCode;
    do {
      newCode = Math.ceil(Math.random() * 1000000);
    } while (newCode < 100000);

    setCreatedCode(newCode);
    saveJoinCode(newCode, 1);
  };

  const saveJoinCode = async (newCode, playerNum) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        code: newCode,
        player: playerNum,
      })
      .eq("id", profileId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update code:", error);
      return;
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("onlineConnection")
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
          if (payload.new.player == 2) {
            navigate("/team");
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStoredCode = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("code,id")
      .neq("code", 0)
      .not("code", "is", null);

    if (!error) {
      setStoredCode(data);
      console.log(data);
    }
  };

  const checkCodeStatus = () => {
    const matches = storedCode?.filter(
      (item) => String(item.code) === String(joinCode),
    );
    console.log(matches, "l");
    if (matches?.length !== 1) {
      toast.error("Invalid Code");
    } else if (matches[0].id === profileId) {
      toast.error("Cannot join your own room");
    } else {
      toast.success("Room Joined");
      saveJoinCode(joinCode, 2);
      navigate("/team");
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
        {!created && !showJoin ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {["Create", "Join"].map((choice, index) => (
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
                  onClick={() => {
                    if (choice == "Create") {
                      createJoinCode();
                    } else {
                      getStoredCode();
                      setShowJoin(true);
                    }
                  }}
                >
                  {choice}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : showJoin ? (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "260px",
              height: "260px",
              "@keyframes spin1": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "@keyframes spin2": {
                "0%": { transform: "rotate(360deg)" },
                "100%": { transform: "rotate(0deg)" },
              },
              "@keyframes spin3": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "@keyframes glow": {
                "0%, 100%": { opacity: 0.6 },
                "50%": { opacity: 1 },
              },
            }}
          >
            {/* Outer ring */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#bd2f7f",
                borderRightColor: "#bd2f7f",
                animation: "spin1 1.4s linear infinite",
                boxShadow: "0 0 20px #bd2f7f55",
              }}
            />

            {/* Middle ring */}
            <Box
              sx={{
                position: "absolute",
                inset: "20px",
                borderRadius: "50%",
                border: "3px solid transparent",
                borderBottomColor: "#e7d58d",
                borderLeftColor: "#e7d58d",
                animation: "spin2 1s linear infinite",
              }}
            />

            {/* Inner ring */}
            <Box
              sx={{
                position: "absolute",
                inset: "40px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#bd2f7f88",
                borderRightColor: "#bd2f7f88",
                animation: "spin3 0.7s linear infinite",
              }}
            />

            {/* Center input */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                animation: "glow 2s ease-in-out infinite",
              }}
            >
              <Typography
                sx={{
                  color: "#e7d58d",
                  fontSize: "0.7em",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Enter Code
              </Typography>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                maxLength={6}
                placeholder="000000"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #bd2f7f",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "1.6em",
                  fontWeight: 700,
                  letterSpacing: "6px",
                  textAlign: "center",
                  width: "120px",
                  caretColor: "#e7d58d",
                }}
              />
              <Button
                onClick={() => checkCodeStatus()}
                sx={{
                  mt: "4px",
                  color: "#0f0648",
                  background: "#e7d58d",
                  fontWeight: 700,
                  fontSize: "0.7em",
                  letterSpacing: "2px",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  minWidth: "unset",
                  ":hover": { background: "#bd2f7f", color: "#fff" },
                }}
              >
                JOIN
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "300px",
              "@keyframes spin1": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "@keyframes spin2": {
                "0%": { transform: "rotate(360deg)" },
                "100%": { transform: "rotate(0deg)" },
              },
              "@keyframes spin3": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "@keyframes glow": {
                "0%, 100%": { opacity: 0.4 },
                "50%": { opacity: 1 },
              },
            }}
          >
            {/* Outer ring */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#bd2f7f",
                borderRightColor: "#bd2f7f",
                animation: "spin1 1.4s linear infinite",
                boxShadow: "0 0 20px #bd2f7f55",
              }}
            />

            {/* Middle ring */}
            <Box
              sx={{
                position: "absolute",
                inset: "20px",
                borderRadius: "50%",
                border: "3px solid transparent",
                borderBottomColor: "#e7d58d",
                borderLeftColor: "#e7d58d",
                animation: "spin2 1s linear infinite",
              }}
            />

            {/* Inner ring */}
            <Box
              sx={{
                position: "absolute",
                inset: "40px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#bd2f7f88",
                borderRightColor: "#bd2f7f88",
                animation: "spin3 0.7s linear infinite",
              }}
            />

            {/* Center content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                animation: "glow 2s ease-in-out infinite",
              }}
            >
              <Typography
                sx={{
                  color: "#e7d58d",
                  fontSize: "1em",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Join Code
              </Typography>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "3em",
                  fontWeight: 700,
                  letterSpacing: "4px",
                }}
              >
                {createdCode}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
