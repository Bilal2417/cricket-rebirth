import { Box, Button, CircularProgress, Grow, Typography } from "@mui/material";
import Data from "../components/data";
import { useEffect, useState } from "react";
import Batting from "../components/batting";
import Bowling from "../components/bowling";
import { useNavigate } from "react-router-dom";
import { EmojiEventsTwoTone } from "@mui/icons-material";
import { GiTrophy, GiTwoCoins } from "react-icons/gi";

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

  const board = localStorage.getItem("Board");
  const navigate = useNavigate();

  const colors = {
    // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
    wc19: "#222589  ",
    wc21: "#f83059 ", //f83059
    wc22: "#d71c59", //de265c
    wc24: "#fa208e",
    ct25: "#02c208",
  };

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [Teams, setTeams] = useState(() => {
    const storedData = localStorage.getItem("cricketData");
    return storedData ? JSON.parse(storedData) : Data;
  });

  const [Profile, setProfile] = useState(() => {
    const storedProfile = sessionStorage.getItem("UserProfile");
    return storedProfile ? JSON.parse(storedProfile) : "";
  });

  const [totalWkts, setTotalWkts] = useState(null);

  useEffect(() => {
    const overs = localStorage.getItem("Overs");
    setTotalWkts(Number(overs));
    console.log("hehe", overs);
  }, []);

  const incrementTrophies = async (win, matchType, isKO = false) => {
    const profileId = localStorage.getItem("MyId");

    console.log(profileId, Profile, "all");
    if (!Profile) return;

    const overs = localStorage.getItem("Overs");
    const wkts = Number(totalWkts) || Number(overs);

    let trophyIncrement = 0;
    let coinsIncrement = 0;

    const trophyMap = {
      1: 1, // 15 :10 : 5
      3: 3, //45 :30 : 15
      5: 5, //75 :50 : 25
      10: 10, //150 :100 : 50
      20: 15, //225 :150 : 75
      100: 5, //15 : 10 : 5
    };

    if (win && !isKO) {
      trophyIncrement = trophyMap[wkts];
      // trophyIncrement = wkts === 100 ? 5 : Math.ceil(wkts / 2);
      if (matchType === 2) {
        trophyIncrement *= wkts === 100 ? 2 : 1.5;
        coinsIncrement =
          wkts === 100 ? trophyMap[wkts] * 3 : trophyMap[wkts] * 15;
      }
      if (matchType === 1) {
        trophyIncrement = Math.ceil(trophyMap[wkts] / 2);
        coinsIncrement =
          wkts === 100 ? trophyMap[wkts] * 2 : trophyMap[wkts] * 10;
      }
    } else if (!win && !isKO) {
      coinsIncrement = wkts === 100 ? trophyMap[wkts] * 1 : trophyMap[wkts] * 5;
    }

    const updatedProfile = {
      ...Profile,
      id: profileId || Profile?.id,
      victories: win ? Profile.victories + 1 : Profile.victories,
      trophies: Profile.trophies + trophyIncrement,
      coins: Profile.coins + coinsIncrement,
    };

    console.log(updatedProfile, "Profile that is sending");
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
        sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));

        console.log("It runs in result");
        window.dispatchEvent(new Event("profileUpdated"));
        localStorage.setItem("refreshProfiles", "true");
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
        setWinner(foundUserTeam.name);
      } else if (foundAiTeam.score > foundUserTeam.score) {
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

  const currentMode = sessionStorage.getItem("mode");

  const trophyMap = {
    1: 1, // 15 :10 : 5
    3: 3, //45 :30 : 15
    5: 5, //75 :50 : 25
    10: 10, //150 :100 : 50
    20: 15, //225 :150 : 75
    100: 5, //15 : 10 : 5
  };

  let trophyInc = trophyMap[totalWkts];
  let coinsInc = 0;
  if (currentMode !== "KNOCKOUT" && currentMode !== "TOURNAMENT") {
    if (winner == userTeam?.name) {
      coinsInc =
        totalWkts === 100
          ? trophyMap[totalWkts] * 3
          : trophyMap[totalWkts] * 15;
    } else if (winner == aiTeam?.name) {
      trophyInc /= 2;
      coinsInc =
        totalWkts === 100 ? trophyMap[totalWkts] * 1 : trophyMap[totalWkts] * 5;
    } else {
      coinsInc =
        totalWkts === 100
          ? trophyMap[totalWkts] * 2
          : trophyMap[totalWkts] * 10;
      trophyInc = 0;
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          // width: { xs: "800px", sm: "1150px", md: "auto" },
          margin: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            width: "100%",
            // overflow: "hidden",
            alignContent: "center",
            marginTop: { xs: "50px" },
            paddingBottom: { xs: "50px" },
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
                  // fontfamily: "Rubik",
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
                // fontfamily: "Rubik",
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
                  // fontfamily: "Rubik",
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
                display:
                  currentMode == "KNOCKOUT" || currentMode == "TOURNAMENT"
                    ? "none"
                    : "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 600,
                padding: "15px 30px",
                clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
                justifyContent: "center",
                color: "rgb(255 196 107)",
                position: "absolute",
                right: 90,
                top: -10,
              }}
              variant="body1"
            >
              +
              <GiTwoCoins size={30} style={{ color: "#f6c401" }} />
              {coinsInc} |
            </Typography>
            <Typography
              sx={{
                display:
                  currentMode == "KNOCKOUT" || currentMode == "TOURNAMENT"
                    ? "none"
                    : "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 600,
                padding: "15px 30px",
                clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
                justifyContent: "center",
                color: "rgb(255 196 107)",
                position: "absolute",
                right: 10,
                top: -10,
              }}
              variant="body1"
            >
              {winner == aiTeam?.name ? "-" : "+"}
              <GiTrophy size={30} style={{ color: "#f6c401" }} />
              {Math.ceil(trophyInc)}
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
                  background: colors[board] || "rgb(65, 38, 255)",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                  background: colors[board] || "rgb(65, 38, 255)",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                  background: colors[board] || "rgb(65, 38, 255)",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                  background: colors[board] || "rgb(65, 38, 255)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                            // fontfamily: "Rubik",
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
                // fontfamily: "Rubik",
                color: "#FFFFFF",
                background: colors[board] || "rgb(65, 38, 255)",
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
                  opacity: 0.8,
                  transition: "all 0.3s",
                },
              }}
              disabled={buttonDisabled}
              onClick={async () => {
                setButtonDisabled(true);
                setLoading(true);

                localStorage.setItem("currentInnings", 1);

                const isKO = sessionStorage.getItem("mode") === "KNOCKOUT";
                const isTour = sessionStorage.getItem("mode") === "TOURNAMENT";

                const userWon = userTeam.score > aiTeam.score;
                const tie = userTeam.score === aiTeam.score;

                if (isTour) {
                  const tieBreaker =
                    Math.random() < 0.5 ? userTeam?.name : aiTeam?.name;
                  const looser =
                    tieBreaker == userTeam?.name
                      ? aiTeam?.name
                      : userTeam?.name;
                  const storedMatch =
                    JSON.parse(sessionStorage.getItem("latestUserMatch")) || {};

                  const updatedMatch = {
                    ...storedMatch,
                    winner: tie
                      ? tieBreaker
                      : userWon
                      ? userTeam.name
                      : aiTeam.name,
                    loser: tie ? looser : userWon ? aiTeam.name : userTeam.name,
                  };
                  sessionStorage.setItem(
                    "latestUserMatch",
                    JSON.stringify(updatedMatch)
                  );

                  navigate("/tournament");
                } else if (isKO) {
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
                  navigate("/fixtures");

                  await incrementTrophies(userWon, 0, true);
                } else {
                  if (userWon) await incrementTrophies(true, 2, false);
                  else if (aiTeam.score > userTeam.score)
                    await incrementTrophies(false, 0, false);
                  else await incrementTrophies(true, 1, false);
                  navigate("/");
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
                // fontfamily: "Rubik",
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
                  // fontfamily: "Rubik",
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
                  // fontfamily: "Rubik",
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
