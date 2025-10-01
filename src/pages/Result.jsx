import { Box, Grow, Typography } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import Batting from "../components/batting";
import Bowling from "../components/bowling";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const [winner, setWinner] = useState(null);
  const [winnerFirst, setWinnerFirst] = useState(() => {
    const decide = localStorage.getItem("winner");
    if (decide == 1) {
      return true;
    } else {
      return false;
    }
  });

  const navigate = useNavigate();
  const storedData = localStorage.getItem("cricketData");

  const [Teams, setTeams] = useState(
    storedData ? JSON.parse(storedData) : Data
  );

  const storedProfile = sessionStorage.getItem("Profile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [totalWkts, setTotalWkts] = useState(null);

  useEffect(() => {
    const overs = localStorage.getItem("Overs");
    setTotalWkts(overs ? Number(overs) : 0);
  }, []);

  const incrementTrophies = async (inc = true) => {
    if (!Profile) return;

    const updatedProfile = {
      ...Profile,
      trophies: inc
        ? Profile.trophies +
          (totalWkts !== 100 ? Math.ceil(totalWkts / 2) : 5) * 2
        : Profile.trophies,
    };

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

      navigate("/");
    } catch (err) {
      console.error("Error updating trophies:", err);
    }
  };

  const [userTeam, setUserTeam] = useState(null);
  const [aiTeam, setAiTeam] = useState(null);

  // const data = Data;
  const [batting, setBatting] = useState(() => {
    const Inning = localStorage.getItem("Innings");
    return Inning === "Ball" ? false : true;
  });

  const user = localStorage.getItem("User");
  const ai = localStorage.getItem("Ai");

  useEffect(() => {
    const latest = localStorage.getItem("cricketData");
    const newTeams = latest ? JSON.parse(latest) : Data;
    setTeams(newTeams);

    const foundUserTeam = newTeams.find((team) => team.name === user) || null;
    const foundAiTeam = newTeams.find((team) => team.name === ai) || null;

    setUserTeam(foundUserTeam);
    setAiTeam(foundAiTeam);

    if (foundUserTeam && foundAiTeam) {
      if (foundUserTeam.score > foundAiTeam.score) {
        // const isTournament = sessionStorage.getItem("mode");
        // if (isTournament !== "KNOCKOUT") {
        //   incrementTrophies(true);
        // }
        setWinner(foundUserTeam.name);
      } else if (foundAiTeam.score > foundUserTeam.score) {
        // const isTournament = sessionStorage.getItem("mode");
        // if (isTournament !== "KNOCKOUT") {
        //   incrementTrophies(false);
        // }
        setWinner(foundAiTeam.name);
      } else {
        setWinner("Match Tied");
      }
    }
  }, []);

  const topScorerFirst = (!batting ? userTeam?.players : aiTeam?.players)
    ?.filter((player) => player.balls > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const topScorerSecond = (batting ? userTeam?.players : aiTeam?.players)
    ?.filter((player) => player.balls > 0)
    ?.sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const topWicketFirst = (!batting ? userTeam?.players : aiTeam?.players)
    ?.filter((player) => player.bowled > 0 || player.overs > 0)
    ?.sort((a, b) => {
      if (b.wickets !== a.wickets) {
        return b.wickets - a.wickets;
      }
      return a.conceded - b.conceded;
    })
    .slice(0, 4);

  const topWicketSecond = (batting ? userTeam?.players : aiTeam?.players)
    ?.filter((player) => player.bowled > 0 || player.overs > 0)
    ?.sort((a, b) => {
      if (b.wickets !== a.wickets) {
        return b.wickets - a.wickets;
      }
      return a.conceded - b.conceded;
    })
    .slice(0, 4);

  console.log(topScorerFirst, "oopppo");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          width: { xs: "800px", sm: "1150px", md: "auto" },
          margin: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            alignContent : "center"
          }}
        >
          <Box
            sx={{
              // width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px 100px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontFamily: "Rubik",
                  color: "#0f0648",
                  textAlign: "center",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                variant="h4"
              >
                {!batting ? userTeam?.name : aiTeam?.name}
              </Typography>
              <img
                style={{
                  width: "60px",
                  height: "40px",
                  boxShadow: "3px 3px 8px -2px #000000",
                }}
                src={batting ? aiTeam?.flag : userTeam?.flag}
                alt={batting ? aiTeam?.name : userTeam?.name}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#0f0648",
                color: "#FFFFFF",
                padding: "9px 16px",
                fontWeight: 900,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                position: "absolute",
                left: "47%",
              }}
            >
              vs
            </Typography>
            <Box
              sx={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px 100px",
              }}
            >
              <img
                style={{
                  width: "60px",
                  height: "40px",
                  boxShadow: "3px 3px 8px -2px #000000",
                }}
                src={!batting ? aiTeam?.flag : userTeam?.flag}
                alt={!batting ? aiTeam?.name : userTeam?.name}
              />
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontFamily: "Rubik",
                  color: "#0f0648",
                  textAlign: "center",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                variant="h4"
              >
                {batting ? userTeam?.name : aiTeam?.name}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              padding: "10px 0px",
              backgroundColor: "#0f0648",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontWeight: 600,
                textAlign: "center",
                color: "#FFFFFF",
              }}
              variant="h6"
            >
              Faisalabad
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "50%",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box
                sx={{
                  //   width: "100%",
                  padding: "10px 0px",
                  backgroundColor: "#fa208e",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    padding: "0 16px",
                    color: "#FFFFFF",
                  }}
                  variant="h5"
                >
                  {!batting ? userTeam?.score : aiTeam?.score}
                  <Box
                    sx={{
                      display: (() => {
                        if (!batting) {
                          return userTeam?.wicket === 10 ? "none" : "";
                        } else {
                          return aiTeam?.wicket === 10 ? "none" : "";
                        }
                      })(),
                    }}
                    component="span"
                  >
                    /{!batting ? userTeam?.wicket : aiTeam?.wicket}
                  </Box>
                </Typography>
              </Box>
              {topScorerFirst?.map((data, index) => {
                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#0f0648",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 0px 9px -7px #000000",
                        borderRadius: "0px",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                          }}
                          variant="h6"
                        >
                          {data.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                            boxShadow: "4px -4px 5px -3px #0003",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="h6"
                        >
                          {data.score}
                          {data.notout ? "*" : null}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "10px 20px",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="body1"
                        >
                          {data.balls}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Box>

            <Box
              sx={{
                width: "50%",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  padding: "10px 0px",
                  backgroundColor: "#fa208e",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    padding: "0 16px",
                    color: "#FFFFFF",
                  }}
                  variant="h5"
                >
                  {!batting ? aiTeam?.score : userTeam?.score}
                  <Box
                    sx={{
                      display: (() => {
                        if (!batting) {
                          return aiTeam?.wicket === 10 ? "none" : "";
                        } else {
                          return userTeam?.wicket === 10 ? "none" : "";
                        }
                      })(),
                    }}
                    component="span"
                  >
                    /{!batting ? aiTeam?.wicket : userTeam?.wicket}
                  </Box>
                </Typography>
              </Box>
              {topScorerSecond?.map((data, index) => {
                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#0f0648",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 0px 9px -7px #000000",
                        borderRadius: "0px",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                          }}
                          variant="h6"
                        >
                          {data.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                            boxShadow: "4px -4px 5px -3px #0003",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="h6"
                        >
                          {data.score}
                          {data.notout ? "*" : null}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "10px 20px",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="body1"
                        >
                          {data.balls}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: "50%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  padding: "10px 0px",
                  backgroundColor: "#fa208e",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    padding: "0 16px",
                    color: "#FFFFFF",
                  }}
                  variant="h5"
                >
                  {!batting ? userTeam?.Over : aiTeam?.Over}.
                  {!batting ? userTeam?.Ball : aiTeam?.Ball}
                  <Box
                    sx={{
                      fontWeight: 400,
                      ml: "5px",
                      fontSize: "0.9em",
                      color: "#ffffffd6",
                    }}
                    component="span"
                  >
                    Overs
                  </Box>
                </Typography>
              </Box>
              {topWicketSecond?.map((data, index) => {
                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#0f0648",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 0px 9px -7px #000000",
                        borderRadius: "0px",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                          }}
                          variant="h6"
                        >
                          {data.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "15px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            width: "50px",
                            textAlign: "end",
                            fontWeight: 400,
                          }}
                          variant="h6"
                        >
                          {data.wickets}/{data.conceded}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "0px 16px",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="body1"
                        >
                          {data.overs}.{data.bowled}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Box>

            <Box
              sx={{
                width: "50%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  padding: "10px 0px",
                  backgroundColor: "#fa208e",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    padding: "0 16px",
                    color: "#FFFFFF",
                  }}
                  variant="h5"
                >
                  {!batting ? aiTeam?.Over : userTeam?.Over}.
                  {!batting ? aiTeam?.Ball : userTeam?.Ball}
                  <Box
                    sx={{
                      fontWeight: 400,
                      ml: "5px",
                      fontSize: "0.9em",
                      color: "#ffffffd6",
                    }}
                    component="span"
                  >
                    Overs
                  </Box>
                </Typography>
              </Box>
              {topWicketFirst?.map((data, index) => {
                return (
                  <>
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#0f0648",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 0px 9px -7px #000000",
                        borderRadius: "0px",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "8px 16px",
                          }}
                          variant="h6"
                        >
                          {data.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "15px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            width: "50px",
                            textAlign: "end",
                            fontWeight: 400,
                          }}
                          variant="h6"
                        >
                          {data.wickets}/{data.conceded}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Rubik",
                            textTransform: "uppercase",
                            padding: "0px 16px",
                            width: "25px",
                            textAlign: "center",
                          }}
                          variant="body1"
                        >
                          {data.overs}.{data.bowled}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Box>
          </Box>

            <Box
              sx={{
                backgroundColor: "#0f0648",
                borderRadius: "0 0 12px 12px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
                padding: "10px 20px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Rubik",
                  color: "#FFFFFF",
                  backgroundColor: "#fa208e",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  position: "absolute",
                  top: 7,
                  right: 50,
                  textTransform: "uppercase",
                  ":hover": {
                    cursor: "pointer",
                    backgroundColor: "#db1d7d",
                    transition: "all 0.3s",
                  },
                }}
                onClick={() => {
                  const isTournament = sessionStorage.getItem("mode");
                  if (isTournament == "KNOCKOUT") {
                    const id = sessionStorage.getItem("lastMatchId");
                    if (winner == "Match Tied") {
                      sessionStorage.setItem(id, aiTeam?.name);
                    } else {
                      sessionStorage.setItem(id, winner);
                    }
                    navigate("/fixtures");
                  } else {
                    if (userTeam?.score > aiTeam?.score) {
                      incrementTrophies(true);
                    } else if (aiTeam?.score > userTeam?.score) {
                      incrementTrophies(false);
                    } else {
                      navigate("/");
                    }
                  }
                }}
              >
                next
              </Box>
              <Typography
                sx={{
                  fontFamily: "Rubik",
                  color: "#dece43",
                  textTransform: "uppercase",
                }}
                variant="h5"
              >
                {winner}
                <Box
                  sx={{
                    display: winner == "Match Tied" ? "none" : "",
                  }}
                  component="span"
                >
                  {" "}
                  Won by
                </Box>
              </Typography>
              {winnerFirst ? (
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    color: "#dece43",
                    textTransform: "uppercase",
                    ml: "5px",
                    display: winner == "Match Tied" ? "none" : "",
                  }}
                  variant="h5"
                >
                  {batting
                    ? aiTeam?.score - userTeam?.score
                    : userTeam?.score - aiTeam?.score}{" "}
                  runs
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    color: "#dece43",
                    textTransform: "uppercase",
                    ml: "5px",
                    display: winner == "Match Tied" ? "none" : "",
                  }}
                  variant="h5"
                >
                  {totalWkts == 100
                    ? null
                    : batting
                    ? totalWkts - userTeam?.wicket
                    : totalWkts - aiTeam?.wicket}{" "}
                  {totalWkts == 100
                    ? "1 wicket"
                    : batting
                    ? totalWkts - userTeam?.wicket == 1
                      ? "wicket"
                      : "wickets"
                    : totalWkts - aiTeam?.wicket == 1
                    ? "wicket"
                    : "wickets"}
                </Typography>
              )}
            </Box>
            
        </Box>
      </Box>
    </>
  );
}
