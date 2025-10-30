import { Box, Grow, Typography } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import Batting from "../components/batting";
import Bowling from "../components/bowling";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";

export default function Scorecard() {
  const storedData = localStorage.getItem("cricketData");

  const [Teams, setTeams] = useState(
    storedData ? JSON.parse(storedData) : Data
  );

  const [userTeam, setUserTeam] = useState(null);
  const [aiTeam, setAiTeam] = useState(null);

  const board = localStorage.getItem("Board");
  const navigate = useNavigate();

  const [batting, setBatting] = useState(null);
  const [battingScore, setBattingScore] = useState(true);
  const [bowlingLeft, setBowlingLeft] = useState(false);

  const [Innings, setInnings] = useState(1);
  const user = localStorage.getItem("User");
  const ai = localStorage.getItem("Ai");

  const colors = {
    // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
    wc19: "#222589  ",
    wc21: "linear-gradient(to bottom , rgb(215 21 73) , rgb(233 25 85) )", 
    wc22: "#d71c59", //de265c
    wc24: "#fa208e",
    ct25: "#02c208",
    wtc: Innings %2 !== 0? userTeam?.secondary : aiTeam?.primary,
  };
  const backColor ={
    wc21: "linear-gradient(to bottom , rgb(113 17 233) , rgb(83 6 189) ) ", //5221ba
  }

  useEffect(() => {
    const Inning = localStorage.getItem("Innings");
    console.log(Inning);
    setBatting(Inning === "Ball" ? false : true);
  }, []);

  useEffect(() => {
    const latest = localStorage.getItem("cricketData");

    const newTeams = latest ? JSON.parse(latest) : Data;
    setTeams(newTeams);

    setUserTeam(newTeams.find((team) => team.name === user) || null);
    setAiTeam(newTeams.find((team) => team.name === ai) || null);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "100vh",
          flexDirection: "column",
          width: { xs: "800px", sm: "1150px", md: "auto" },
          margin: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            width: "100%",
            marginTop: { xs: "50px" },
            paddingBottom: { xs: "50px" },
          }}
        >
          <Box
            sx={{
              // width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: { xs: "4px 16px", md: "8px 16px" },
              background: "#FFFFFF",
              borderRadius: "12px 12px 0 0",
              // overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  // fontfamily: "Rubik",
                  color: Innings % 2 == 1 ? "#0f0648" : "#0f064894",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  setInnings(1);
                }}
                variant="h5"
              >
                {!batting ? userTeam?.name : aiTeam?.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ArrowLeftIcon
                  sx={{
                    color: Innings == 1 ? "#0f0648" : "#0f064894",
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    // setBowlingLeft(false);
                    // setBattingScore(true);
                    setInnings(1);
                  }}
                />
                <ArrowRightIcon
                  sx={{
                    color: Innings == 3 ? "#0f0648" : "#0f064894",
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    // setBowlingLeft(true);
                    // setBattingScore(false);
                    setInnings(3);
                  }}
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{
                background:  backColor[board] || "#0f0648",
                color: "#FFFFFF",
                padding: "9px 16px",
                fontWeight: 900,
                // fontfamily: "Rubik",
                textTransform: "uppercase",
                position: "absolute",
                left: "47%",
              }}
            >
              t20
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ArrowLeftIcon
                  sx={{
                    color: Innings == 2 ? "#0f0648" : "#0f064894",
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    // setBowlingLeft(true);
                    // setBattingScore(false);
                    setInnings(2);
                  }}
                />{" "}
                <ArrowRightIcon
                  sx={{
                    color: Innings == 4 ? "#0f0648" : "#0f064894",
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    // setBowlingLeft(false);
                    // setBattingScore(true);
                    setInnings(4);
                  }}
                />
              </Box>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  // fontfamily: "Rubik",
                  color: Innings % 2 == 0 ? "#0f0648" : "#0f064894",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  setInnings(2);
                }}
                variant="h5"
              >
                {batting ? userTeam?.name : aiTeam?.name}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: { xs: "1px 0px", md: "5px 0px" },
                background:  backColor[board] || "#0f0648",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
                textAlign: "center",
                color: "#FFFFFF",
              }}
              variant="h6"
            >
              Faisalabad
            </Typography>
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
                textAlign: "center",
                color: "#fff",
                position: "absolute",
                top: 5,
                ...(Innings % 2 === 1 ? { left: 16 } : { right: 16 }),
              }}
              variant="h6"
            >
              {Innings < 3 ? "Batting" : "Bowling"}
            </Typography>
          </Box>

          <Box>
            {Innings < 3 ? (
              <Grow key="batting" in={Innings} timeout={1000}>
                <div>
                  <Batting
                    data={
                      Innings == 1
                        ? !batting
                          ? userTeam
                          : aiTeam
                        : Innings == 2
                        ? batting
                          ? userTeam
                          : aiTeam
                        : null
                    }
                  />
                </div>
              </Grow>
            ) : (
              <Grow key="bowling" in={Innings} timeout={1000}>
                <div>
                  <Bowling
                    data={
                      Innings == 3
                        ? !batting
                          ? userTeam
                          : aiTeam
                        : Innings == 4
                        ? batting
                          ? userTeam
                          : aiTeam
                        : null
                    }
                  />
                </div>
              </Grow>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                background:  backColor[board] || "#0f0648",
                borderRadius: "0 0 12px 12px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: { xs: "4px 16px", md: "8px 16px" },
                  width: "85%",
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    // fontfamily: "Rubik",
                    fontWeight: 600,
                    textAlign: "center",
                    color: "#FFFFFF",
                  }}
                  variant="h5"
                >
                  #T20WORLDCUP
                </Typography>
                <Box
                  sx={{
                    // fontfamily: "Rubik",
                    color: "#FFFFFF",
                    background: colors[board] || "rgb(65, 38, 255)",
                    padding: "8px 32px",
                    borderRadius: "8px",
                    position: "absolute",
                    bottom: 5,
                    right: "38%",
                    textTransform: "uppercase",
                    ":hover": {
                      cursor: "pointer",
                      opacity: 0.8,
                      transition: "all 0.3s",
                    },
                  }}
                  onClick={() => navigate("/result")}
                >
                  next
                </Box>
                <Box>
                  <Typography
                    sx={{
                      // fontfamily: "Rubik",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#fff",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                    variant="h5"
                  >
                    {Innings == 1 || Innings == 4
                      ? !batting
                        ? userTeam?.Over
                        : aiTeam?.Over
                      : batting
                      ? userTeam?.Over
                      : aiTeam?.Over}
                    .
                    {Innings == 1 || Innings == 4
                      ? !batting
                        ? userTeam?.Ball
                        : aiTeam?.Ball
                      : batting
                      ? userTeam?.Ball
                      : aiTeam?.Ball}
                    <Box
                      sx={{
                        fontWeight: 400,
                        // transform: "scale(0.7)",
                        fontSize: "0.8em",
                        ml: "10px",
                      }}
                      component="span"
                    >
                      Overs
                    </Box>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  background: colors[board] || "rgb(65, 38, 255)",
                  color: "#FFFFFF",
                  padding: { xs: "4px 16px", md: "8px 16px" },
                  minWidth: "150px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "600",
                    // fontfamily: "Rubik",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                  variant="h6"
                >
                  {Innings == 1 || Innings == 4
                    ? !batting
                      ? userTeam?.score
                      : aiTeam?.score
                    : batting
                    ? userTeam?.score
                    : aiTeam?.score}{" "}
                  <Box
                    sx={{
                      display: (() => {
                        // If innings is 1 or 4
                        if (Innings === 1 || Innings === 4) {
                          if (!batting) {
                            return userTeam?.wicket === 10 ? "none" : "block";
                          } else {
                            return aiTeam?.wicket === 10 ? "none" : "block";
                          }
                        }

                        // Otherwise (innings not 1 or 4)
                        if (batting) {
                          return userTeam?.wicket === 10 ? "none" : "block";
                        } else {
                          return aiTeam?.wicket === 10 ? "none" : "block";
                        }
                      })(),
                    }}
                    component="span"
                  >
                    -{" "}
                    {Innings == 1 || Innings == 4
                      ? !batting
                        ? userTeam?.wicket
                        : aiTeam?.wicket
                      : batting
                      ? userTeam?.wicket
                      : aiTeam?.wicket}
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
