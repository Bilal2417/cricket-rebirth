import { Box, Button, CircularProgress, Grow, Typography } from "@mui/material";
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

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [Teams, setTeams] = useState(() => {
    const storedData = localStorage.getItem("cricketData");
    return storedData ? JSON.parse(storedData) : Data;
  });

  const [Profile, setProfile] = useState(() => {
    const storedProfile = sessionStorage.getItem("Profile");
    return storedProfile ? JSON.parse(storedProfile) : "";
  });

  const [totalWkts, setTotalWkts] = useState(null);

  useEffect(() => {
    const overs = localStorage.getItem("Overs");
    setTotalWkts(Number(overs));
    console.log("hehe", overs);
  }, []);

  // const incrementTrophies = async (win, matchType) => {
  //   if (!Profile) return;

  //   const overs = localStorage.getItem("Overs");
  //   const wkts = Number(totalWkts) || Number(overs);

  //   let trophyIncrement = 0;

  //   if (win) {
  //     // Always calculate trophies for the winner
  //     trophyIncrement = wkts === 100 ? 5 : Math.ceil(wkts / 2);

  //     if (matchType === 2) trophyIncrement *= 2; // bonus for full win
  //     if (matchType === 1) trophyIncrement = Math.ceil(trophyIncrement / 2); // tie
  //   }

  //   const updatedProfile = {
  //     ...Profile,
  //     victories: win ? Profile.victories + 1 : Profile.victories,
  //     trophies: Profile.trophies + trophyIncrement,
  //   };

  //   setProfile(updatedProfile);

  //   try {
  //     const res = await fetch("/.netlify/functions/updateProfile", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedProfile),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       setProfile(data.profile);
  //       sessionStorage.setItem("Profile", JSON.stringify(data.profile));
  //     } else {
  //       console.error("Failed to update trophies in database");
  //     }

  //     navigate("/");
  //   } catch (err) {
  //     console.error("Error updating trophies:", err);
  //   }
  // };

  const incrementTrophies = async (win, matchType, isTournament = false) => {
    if (!Profile) return;

    const overs = localStorage.getItem("Overs");
    const wkts = Number(totalWkts) || Number(overs);

    let trophyIncrement = 0;

    if (win && !isTournament) {
      trophyIncrement = wkts === 100 ? 5 : Math.ceil(wkts / 2);
      if (matchType === 2) trophyIncrement *= 2;
      if (matchType === 1) trophyIncrement = Math.ceil(trophyIncrement / 2);
    }

    const updatedProfile = {
      ...Profile,
      victories: win ? Profile.victories + 1 : Profile.victories,
      trophies: Profile.trophies + trophyIncrement,
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
        sessionStorage.setItem("Profile", JSON.stringify(data.profile));
      } else {
        console.error("Failed to update trophies in database");
      }
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

  const isTournament = sessionStorage.getItem("mode");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          // width: { xs: "800px", sm: "1150px", md: "auto" },
          margin: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            width: "100%",
            height: "100%",
            // overflow: "hidden",
            alignContent: "center",
          }}
        >
          <Box
            sx={{
              // width: "100%",
              display: "flex",
              alignItems: "center",
              padding: { xs: "2px 16px", md: "8px 16px" },
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
                padding: "0px 50px",
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
              <Box
                component="img"
                sx={{
                  width: { xs: "45px", md: "60px" },
                  height: { xs: "30px", md: "40px" },
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
                padding: "0px 50px",
              }}
            >
              <Box
                component="img"
                sx={{
                  width: { xs: "45px", md: "60px" },
                  height: { xs: "30px", md: "40px" },
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
              padding: { xs: "1px 0px", md: "5px 0px" },
              backgroundColor: "#0f0648",
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
                  padding: { xs: "5px 0px", md: "10px 0px" },
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
                        // padding : "8px 0"
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
                            padding: "0px 16px",
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
                            padding: { xs: "2px 16px", md: "8px 16px" },
                            boxShadow: "4px -4px 5px -3px #0003",
                            width: "50px",
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
                            padding: "0px 20px",
                            width: "50px",
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
                  padding: { xs: "5px 0px", md: "10px 0px" },
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
                        // padding : "8px 0"
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
                            padding: "0px 16px",
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
                            padding: { xs: "2px 16px", md: "8px 16px" },
                            boxShadow: "4px -4px 5px -3px #0003",
                            width: "50px",
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
                            padding: "0px 20px",
                            width: "50px",
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
                  padding: { xs: "5px 0px", md: "10px 0px" },
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
                        padding: { xs: "2px 0px", md: "8px 0px" },
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
                            padding: "0px 16px",
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
                            width: "50px",
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
                  padding: { xs: "5px 0px", md: "10px 0px" },
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
                        padding: { xs: "2px 0px", md: "8px 0px" },
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
                            padding: "0px 16px",
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
                            width: "50px",
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
              padding: "10px 0px",
              position: "relative",
            }}
          >
            <Button
              sx={{
                fontFamily: "Rubik",
                color: "#FFFFFF",
                backgroundColor: "#fa208e",
                padding: "8px 16px",
                borderRadius: "8px",
                position: "absolute",
                top: 4,
                right: 10,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ":hover": {
                  cursor: buttonDisabled ? "not-allowed" : "pointer",
                  backgroundColor: buttonDisabled ? "#fa208e" : "#db1d7d",
                  transition: "all 0.3s",
                },
              }}
              disabled={buttonDisabled}
              // onClick={async () => {
              //   setButtonDisabled(true);
              //   setLoading(true);

              //   if (isTournament === "KNOCKOUT") {
              //     const id = sessionStorage.getItem("lastMatchId");
              //     if (winner === "Match Tied") {
              //       const tieBreaker =
              //         Math.random() < 0.5 ? userTeam?.name : aiTeam?.name;
              //       sessionStorage.setItem(id, tieBreaker);
              //     } else {
              //       sessionStorage.setItem(id, winner);
              //     }
              //     navigate("/fixtures");
              //   } else {
              //     if (userTeam.score > aiTeam.score) {
              //       await incrementTrophies(true, 2);
              //     } else if (aiTeam.score > userTeam.score) {
              //       await incrementTrophies(false, 0);
              //     } else {
              //       await incrementTrophies(true, 1);
              //     }
              //   }

              //   setLoading(false);
              // }}
              onClick={async () => {
                setButtonDisabled(true);
                setLoading(true);

                const isTournament =
                  sessionStorage.getItem("mode") === "KNOCKOUT";

                const userWon = userTeam.score > aiTeam.score;
                const tie = userTeam.score === aiTeam.score;

                if (isTournament) {
                  // Store winner/tie for tournament fixtures
                  const id = sessionStorage.getItem("lastMatchId");
                  if (tie) {
                    const tieBreaker =
                      Math.random() < 0.5 ? userTeam?.name : aiTeam?.name;
                    sessionStorage.setItem(id, tieBreaker);
                  } else {
                    sessionStorage.setItem(
                      id,
                      userWon ? userTeam?.name : aiTeam?.name
                    );
                  }

                  // Call incrementTrophies but only increment victories
                  await incrementTrophies(userWon, 0, true); // pass "true" for isTournament
                  navigate("/fixtures");
                } else {
                  if (userWon) await incrementTrophies(true, 2, false);
                  else if (aiTeam.score > userTeam.score)
                    await incrementTrophies(false, 0, false);
                  else await incrementTrophies(true, 1, false);
                }

                setLoading(false);
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Next"
              )}
            </Button>

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
                  ? (totalWkts == 20 ? 10 : totalWkts) - userTeam?.wicket
                  : (totalWkts == 20 ? 10 : totalWkts) - aiTeam?.wicket}{" "}
                {totalWkts == 100
                  ? "1 wicket"
                  : batting
                  ? (totalWkts == 20 ? 10 : totalWkts) - userTeam?.wicket == 1
                    ? "wicket"
                    : "wickets"
                  : (totalWkts == 20 ? 10 : totalWkts) - aiTeam?.wicket == 1
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
