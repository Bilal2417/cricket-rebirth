import { Box, Button, CircularProgress, Fade, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Data from "./data";
import { useNavigate } from "react-router-dom";

export default function ScoreCard24() {
  const storedData = localStorage.getItem("cricketData");
  const [Teams, setTeams] = useState(
    storedData ? JSON.parse(storedData) : Data
  );

  const user = localStorage.getItem("User");
  const ai = localStorage.getItem("Ai");

  const [userTeam, setUserTeam] = useState(null);
  const [aiTeam, setAiTeam] = useState(null);

  // const choice = [
  //   {
  //     value: 0,
  //   },
  //   {
  //     value: 1,
  //   },
  //   {
  //     value: 2,
  //   },
  //   {
  //     value: 3,
  //   },
  //   {
  //     value: 4,
  //   },
  //   {
  //     value: 6,
  //   },
  // ];


  const choice = [
  { value: 0, weight: 0.10 },
  { value: 1, weight: 0.21 },
  { value: 2, weight: 0.20 },
  { value: 3, weight: 0.12 },
  { value: 4, weight: 0.20 },
  { value: 6, weight: 0.17 },
];


  const [over, setOver] = useState(0);
  const [totalOvers, setTotalOvers] = useState(() => {
    const fixedOvers = localStorage.getItem("Overs");
    return fixedOvers ? fixedOvers : 10;
  });
  const [inningsOver, setInningsOver] = useState(false);
  const [overRun, setOverRun] = useState(0);

  const navigate = useNavigate();

  const [ballHistory, setBallHistory] = useState([]);

  const colors = {
    6: "#fa208e",
    W: "#fa208e",
    4: "#15daab",
  };

  const [show, setShow] = useState(0);

  const [batting, setBatting] = useState(null);
  // const [userChoice, setUserChoice] = useState();
  // const [compChoice, setCompChoice] = useState();
  // const [bowlingScore, setBowlingScore] = useState(0);
  // const [bowlingWicket, setBowlingWicket] = useState(0);
  const [battingWicket, setBattingWicket] = useState(0);
  const [firstInnings, setFirstInnings] = useState(() => {
    return Number(localStorage.getItem("FirstInnings")) || 1;
  });

  const [balls, setBalls] = useState(0);
  const [target, setTarget] = useState(0);
  const [partnership, setPartnership] = useState(0);
  const [partnershipBalls, setPartnershipBalls] = useState(0);

  const handleBall = (run, Wkt = false, aiRun) => {
    setBalls((prevBalls) => {
      const isOverComplete = prevBalls === 5;
      const nextBalls = isOverComplete ? 0 : prevBalls + 1;
      const nextOver = isOverComplete ? over + 1 : over;

      setBallHistory((prev) => {
        const newHistory = [...prev, run];

        updateTeam(
          batting ? aiTeam.name : userTeam.name,
          batting ? userTeam.name : aiTeam.name,
          randomBowler,
          Wkt ? 0 : batting ? run : aiRun,
          nextOver, // ✅ pass updated over
          nextBalls, // ✅ pass updated balls
          isOverComplete,
          Wkt
        );

        // strike rotation
        if (!Wkt || (Wkt && isOverComplete)) {
          const currentRun = batting ? run : aiRun;

          if (!(currentRun % 2 === 1 && isOverComplete)) {
            if (currentRun % 2 === 1 || isOverComplete) {
              setStriker((prevS) => {
                const temp = nonStriker;
                setNonStriker(prevS);
                return temp;
              });
            }
          }
        }

        if (isOverComplete) {
          bowlerSelect();
          if (nextOver >= totalOvers) {
            const Inning = localStorage.getItem("Innings");
            const newInning = Inning == "Bat" ? "Ball" : "Bat";
            // localStorage.setItem("Innings", newInning);

            const latestBattingTeam = batting ? userTeam : aiTeam;
            const updatedScore =
              latestBattingTeam?.score + (Wkt ? 0 : batting ? run : aiRun);

            endInnings(updatedScore);
          } else {
            setOver(nextOver);
          }
        }

        const battingTeam = batting ? userTeam : aiTeam;
        const potentialScore =
          battingTeam?.score + (Wkt ? 0 : batting ? run : aiRun);
        const potentialOvers = nextOver;
        const potentialBalls = nextBalls;

        // End innings if chasing target
        if (firstInnings == 2) {
          if (potentialScore >= target) {
            endInnings(potentialScore);
            localStorage.setItem("winner", 2);
            navigate("/score");
            return; // stop further updates
          }

          // End innings if all overs bowled or all out
          if (
            potentialOvers >= totalOvers ||
            battingTeam?.wicket + (Wkt ? 1 : 0) >=
              (totalOvers == 100 ? 1 : totalOvers == 20 ? 10 : totalOvers) //used as total wickets
          ) {
            localStorage.setItem("winner", 1);
            endInnings(potentialScore);
            navigate("/score");
            return;
          }
        }

        return isOverComplete ? [] : newHistory;
      });

      return nextBalls;
    });
  };

  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const endInnings = (finalScore) => {
    setPartnership(0);
    setPartnershipBalls(0);

    setTarget(finalScore + 1);

    setInningsOver(true);

    const change = localStorage.getItem("currentInnings");
    if (change && (change == 1 || change == "1")) {
      setBatting(!batting);
      const correct = localStorage.getItem("Innings");
      localStorage.setItem("Innings", correct === "Bat" ? "Ball" : "Bat");
      localStorage.setItem("currentInnings", "2");
      setFirstInnings(2);
    }
  };

  function weightedRandom(arr) {
    let sum = arr.reduce((acc, obj) => acc + obj.weight, 0);
    let rand = Math.random() * sum;
    let cumulative = 0;

    for (let obj of arr) {
      cumulative += obj.weight;
      if (rand < cumulative) {
        return obj.value;
      }
    }
  }

  const scoreDecision = (userRun) => {
    const aiChoice = weightedRandom(choice);
    // const aiChoice = choice[Math.floor(Math.random() * choice.length)].value;
    console.log(aiChoice)
    const isWicket = userRun == aiChoice;

    if (!isWicket) {
      setPartnership((prev) => prev + (batting ? userRun : aiChoice));
      setPartnershipBalls((prev) => prev + 1);
    }

    handleBall(userRun, isWicket, aiChoice);
  };

  // const updateTeam = (
  //   bowlingTeam,
  //   battingTeam,
  //   randomBowler,
  //   run,
  //   isOverComplete = false
  // ) => {
  //   const updatedTeams = Teams.map((team) => {
  //     if (team.name === bowlingTeam) {
  //       return {
  //         ...team,
  //         players: team.players.map((player) => {
  //           if (player.name === randomBowler?.name) {
  //             return {
  //               ...player,
  //               conceded: player.conceded + run,
  //               overs: isOverComplete ? player.overs + 1 : player.overs,
  //             };
  //           }
  //           return player;
  //         }),
  //       };
  //     }

  //     if (team.name === battingTeam) {
  //       return {
  //         ...team,
  //         score: team.score + run,
  //         players: team.players.map((player) => {
  //           if (player.name === striker.name) {
  //             return {
  //               ...player,
  //               score: player.score + run,
  //               balls: player.balls + 1,
  //             };
  //           }
  //           return player;
  //         }),
  //       };
  //     }
  //     return team;
  //   });

  //   setTeams(updatedTeams);

  //   localStorage.setItem("cricketData", JSON.stringify(updatedTeams));

  //   setUserTeam(updatedTeams.find((t) => t.name === user) || null);
  //   setAiTeam(updatedTeams.find((t) => t.name === ai) || null);

  //   const updatedBowler =
  //     updatedTeams
  //       .find((t) => t.name === bowlingTeam)
  //       ?.players.find((p) => p.name === randomBowler.name) || null;
  //   setRandomBowler(updatedBowler);
  // };

  const updateTeam = (
    bowlingTeam,
    battingTeam,
    randomBowler,
    run,
    overso,
    ballo,
    isOverComplete = false,
    Wicket = false
  ) => {
    const updatedTeams = Teams.map((team) => {
      if (team.name === bowlingTeam) {
        return {
          ...team,
          fow: Wicket
            ? [...(team.fow || []), batting ? userTeam?.score : aiTeam?.score]
            : team.fow,
          players: team.players.map((player) => {
            if (player.name === randomBowler?.name) {
              // update stats first
              const newConceded = player.conceded + run;
              const newOvers = isOverComplete ? player.overs + 1 : player.overs;
              const newBowled = isOverComplete ? 0 : player.bowled + 1;

              const totalBalls = newOvers * 6 + newBowled;
              const oversDecimal = totalBalls / 6;

              return {
                ...player,
                conceded: newConceded,
                overs: newOvers,
                bowled: newBowled,
                wickets: Wicket ? player.wickets + 1 : player.wickets,
                dot: run == 0 ? player.dot + 1 : player.dot,
                economy:
                  oversDecimal > 0
                    ? (newConceded / oversDecimal).toFixed(2)
                    : "0.00",
              };
            }

            return player;
          }),
        };
      }

      if (team.name === battingTeam) {
        return {
          ...team,
          score: team.score + run,
          wicket: Wicket ? team.wicket + 1 : team.wicket,
          Over: overso,
          Ball: ballo,
          ballHistory: Wicket
            ? (team.ballHistory?.length || 0) === 6
              ? ["W"]
              : [...(team.ballHistory || []), "W"]
            : (team.ballHistory?.length || 0) === 6
            ? [run]
            : [...(team.ballHistory || []), run],

          players: team.players.map((player) => {
            if (player.name === striker.name) {
              return {
                ...player,
                score: player.score + run,
                balls: player.balls + 1,
                out: Wicket ? true : false,
                notout: Wicket ? false : true,
                striker: Wicket ? false : player.striker,
                bowler: Wicket ? randomBowler.name : null,
              };
            }
            return player;
          }),
        };
      }
      // console.log("ballso", balls);
      // console.log("overo", over);
      return team;
    });

    setTeams(updatedTeams);
    localStorage.setItem("cricketData", JSON.stringify(updatedTeams));

    // Update userTeam / aiTeam
    const newUserTeam = updatedTeams.find((t) => t.name === user) || null;
    const newAiTeam = updatedTeams.find((t) => t.name === ai) || null;
    setUserTeam(newUserTeam);
    setAiTeam(newAiTeam);

    // **Update striker and non-striker objects** from the updated team
    const teamBatting = batting ? newUserTeam : newAiTeam;
    setStriker(teamBatting.players.find((p) => p.name === striker.name));
    setNonStriker(teamBatting.players.find((p) => p.name === nonStriker.name));

    // Update bowler
    const updatedBowler =
      updatedTeams
        .find((t) => t.name === bowlingTeam)
        ?.players.find((p) => p?.name === randomBowler?.name) || null;
    setRandomBowler(updatedBowler);
    localStorage.setItem("CurrentBowler", updatedBowler.name);

    if (Wicket) {
      const teamBatting = updatedTeams.find((t) => t.name === battingTeam);
      const nextBatterIndex = teamBatting.wicket + 1; // openers = 0 & 1

      setPartnership(0);
      setPartnershipBalls(0);

      // if (teamBatting.players[nextBatterIndex])
      if (
        teamBatting?.wicket + (Wicket ? 1 : 0) <=
        (totalOvers == 100 ? 1 : totalOvers == 20 ? 10 : totalOvers) //used as total wickets
      ) {
        const nextBatter = teamBatting.players[nextBatterIndex];

        // Update striker flags
        const updatedPlayers = teamBatting.players.map((p, i) => ({
          ...p,
          striker: i === nextBatterIndex, // new batter is striker
          notout: i === nextBatterIndex ? true : p.notout && !p.out,
        }));

        setStriker(nextBatter);

        // Save back to teamBatting
        teamBatting.players = updatedPlayers;
      } else {
        const latestBattingTeam = batting ? userTeam : aiTeam;
        const updatedScore = latestBattingTeam?.score + (Wicket ? 0 : run);

        endInnings(updatedScore); // ✅ all out
      }
    }
  };

  const [randomBowler, setRandomBowler] = useState(null);

  const bowlerSelect = () => {
    const bowlersList = !batting
      ? userTeam.players.filter((player) => player.isBowler)
      : aiTeam.players.filter((player) => player.isBowler);

    if (!bowlersList.length) return; // safeguard

    let chosen = null;
    let attempts = 0;

    while (attempts < 10) {
      const candidate =
        bowlersList[Math.floor(Math.random() * bowlersList.length)];

      // ensure not same bowler and overs quota not exceeded
      if (
        candidate.name !== randomBowler?.name &&
        candidate.overs < totalOvers / 5
      ) {
        chosen = candidate;
        break;
      }

      attempts++;
    }

    if (chosen) {
      setRandomBowler(chosen);
      localStorage.setItem("CurrentBowler", chosen.name);
      console.log("Selected Bowler:", chosen);
    } else {
      console.log(
        "⚠️ No valid bowler found, keeping current bowler:",
        randomBowler
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShow((prev) => (prev + 1) % 3);
    }, 3000);

    const Inning = localStorage.getItem("Innings");
    console.log(Inning);
    setBatting(Inning === "Ball" ? false : true);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (batting !== null) {
      const currentBowler = localStorage.getItem("CurrentBowler");

      const bowlingTeam = batting ? aiTeam : userTeam;
      if (currentBowler) {
        const selectBowler = bowlingTeam?.players.find(
          (player) => player.name === currentBowler
        );
        if (selectBowler) {
          setRandomBowler(selectBowler);
        } else {
          bowlerSelect();
        }
      } else {
        bowlerSelect();
      }
    }
  }, [batting]);

  useEffect(() => {
    const latest = localStorage.getItem("cricketData");

    const newTeams = latest ? JSON.parse(latest) : Data;

    console.log("Updated Teams:", newTeams);
    setTeams(newTeams);

    setUserTeam(newTeams.find((team) => team.name === user) || null);
    setAiTeam(newTeams.find((team) => team.name === ai) || null);
  }, [balls, user, ai]);

  useEffect(() => {
    if (!userTeam || !aiTeam) return;

    if (balls === 0 && over === 0) {
      const team = batting ? userTeam : aiTeam;

      const available = team.players.filter((p) => !p.out);

      if (available.length >= 2) {
        setStriker(available[0]);
        setNonStriker(available[1]);
      }
    }
  }, [batting, userTeam, aiTeam, balls, over]);

  useEffect(() => {
    if (userTeam && aiTeam && batting !== null) {
      setBalls(batting ? userTeam?.Ball : aiTeam?.Ball);
      setOver(batting ? userTeam?.Over : aiTeam?.Over);
      setBattingWicket(batting ? userTeam?.wicket : aiTeam?.wicket);
    }
  }, [userTeam, aiTeam, batting]);

  useEffect(() => {
    localStorage.setItem("currentInnings", "1");

    console.log("First innings:", firstInnings);
    console.log("Bat/Ball:", localStorage.getItem("Innings"));
  }, []);

  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#FFFFFF" }} />
        <Typography sx={{ mt: 2, color: "#FFFFFF", fontFamily: "Rubik" }}>
          Loading page...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#faf8fb",
          minHeight: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            padding: "0px 20px",
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
        </Box>

        <Box
          sx={{
            backgroundColor: "#0f0648",
            borderLeft: "10px solid #bd2f7f",
            borderRight: "10px solid #bd2f7f",
            width: "220px",
            minHeight: "40px",
            padding: "10px 15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                textTransform: "uppercase",
                color: "#e4dff9",
                fontSize: "0.9em",
                fontFamily: "Rubik",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "80px",
              }}
              variant="body1"
            >
              <Box
                sx={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "#e7d58d",
                  borderRadius: "50%",
                  marginLeft: "-10px",
                }}
              ></Box>
              {striker?.name}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                width: "50px",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#e7d58d",
                }}
                variant="body1"
              >
                {striker?.score}
              </Typography>
              <Typography
                sx={{
                  color: "#e7d58d",
                  transform: "scale(0.75)",
                }}
                variant="body1"
              >
                {striker?.balls}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                color: "#e4dff9",
                fontSize: "0.9em",
                fontFamily: "Rubik",
                width: "80px",
              }}
              variant="body1"
            >
              {nonStriker?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                width: "50px",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#e7d58d",
                }}
                variant="body1"
              >
                {nonStriker?.score}
              </Typography>
              <Typography
                sx={{
                  color: "#e7d58d",
                  transform: "scale(0.75)",
                }}
                variant="body1"
              >
                {nonStriker?.balls}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f2f0f6",
            padding: " 4px 8px",
            minWidth: "300px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "3px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "5px",
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                }}
                variant="body1"
              >
                {!batting
                  ? getInitials(userTeam?.name)
                  : getInitials(aiTeam?.name)}{" "}
                <Box
                  sx={{
                    transform: "scale(0.7)",
                  }}
                  variant="span"
                >
                  v
                </Box>
              </Box>
              <Typography
                sx={{
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                  transform: "scale(1.1)",
                  fontWeight: 600,
                }}
                variant="h6"
              >
                {!batting
                  ? getInitials(aiTeam?.name)
                  : getInitials(userTeam?.name)}{" "}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "#fa208e",
                borderRadius: "8px",
                padding: "2px 0px",
                width: "100px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#FFFFFF",
                  transform: "scale(0.9)",
                  fontWeight: "600",
                  fontFamily: "Rubik",
                  textAlign: "center",
                }}
              >
                {batting ? userTeam?.score : aiTeam?.score} -{" "}
                {batting ? userTeam?.wicket : aiTeam?.wicket}
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
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: "0.9em",
                  width: "30px",
                  textAlign: "center",
                }}
                variant="body1"
              >
                {/* {over}.{balls}{" "} */}
                {batting ? userTeam?.Over : aiTeam?.Over}.
                {batting ? userTeam?.Ball : aiTeam?.Ball}
              </Typography>
              <Box
                sx={{
                  transform: "scale(0.7)",
                  fontWeight: 400,
                  color: "#0e0a20",
                }}
                component="span"
              >
                overs ({totalOvers == 100 ? "∞" : totalOvers})
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "24px",
            }}
          >
            <Fade in={show == 0} timeout={500}>
              <Typography
                sx={{
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
                }}
                variant="body1"
              >
                run rate{" "}
                {over === 0 && balls === 0
                  ? "0.00"
                  : (
                      (batting ? userTeam?.score : aiTeam?.score) /
                      (over + balls / 6)
                    ).toFixed(2)}
              </Typography>
            </Fade>

            <Fade in={show == 1} timeout={500}>
              <Typography
                sx={{
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
                }}
                variant="body1"
              >
                partnership {partnership}({partnershipBalls})
              </Typography>
            </Fade>

            <Fade in={show == 2} timeout={500}>
              <Typography
                sx={{
                  color: "#0e0a20",
                  fontFamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
                }}
                variant="body1"
              >
                {firstInnings == 2
                  ? `Target : ${target}`
                  : totalOvers !== 100
                  ? `Projected Score : ${(
                      ((batting ? userTeam?.score : aiTeam?.score) /
                        (over + balls / 6)) *
                      totalOvers
                    ).toFixed(0)}`
                  : null}
              </Typography>
            </Fade>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#0f0648",
            borderLeft: "10px solid #bd2f7f",
            borderRight: "10px solid #bd2f7f",
            width: "220px",
            minHeight: "40px",
            padding: "10px 15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                color: "#e4dff9",
                fontSize: "0.9em",
                fontFamily: "Rubik",
              }}
              variant="body1"
            >
              {randomBowler?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <Typography
                sx={{
                  color: "#e7d58d",
                  fontFamily: "Rubik",
                  width: "50px",
                  textAlign: "center",
                }}
                variant="body1"
              >
                {randomBowler?.wickets}-{randomBowler?.conceded}
              </Typography>
              <Typography
                sx={{
                  color: "#e7d58d",
                  transform: "scale(0.75)",
                  fontFamily: "Rubik",
                }}
                variant="body1"
              >
                {randomBowler?.overs}.{randomBowler?.bowled}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "15px",
                  height: "15px",
                  outline: batting
                    ? userTeam?.ballHistory[index] > 3 ||
                      userTeam?.ballHistory[index] == "W"
                      ? `2px solid ${
                          colors[
                            batting
                              ? userTeam?.ballHistory[index]
                              : aiTeam?.ballHistory[index]
                          ]
                        }`
                      : "2px solid #FFFFFF"
                    : aiTeam?.ballHistory[index] > 3 ||
                      aiTeam?.ballHistory[index] == "W"
                    ? `2px solid ${
                        colors[
                          batting
                            ? userTeam?.ballHistory[index]
                            : aiTeam?.ballHistory[index]
                        ]
                      }`
                    : "2px solid #FFFFFF",

                  color: batting
                    ? userTeam?.ballHistory[index] > 3 ||
                      userTeam?.ballHistory[index] == "W"
                      ? "#0f0648"
                      : "#FFFFFF"
                    : aiTeam?.ballHistory[index] > 3 ||
                      aiTeam?.ballHistory[index] == "W"
                    ? "#0f0648"
                    : "#FFFFFF",

                  borderRadius: "50%",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9em",
                  fontWeight: 900,
                  backgroundColor:
                    colors[
                      batting
                        ? userTeam?.ballHistory[index]
                        : aiTeam?.ballHistory[index]
                    ] || "#0f0648",
                }}
              >
                {/* {ballHistory[index] ?? ""} */}
                {batting
                  ? userTeam?.ballHistory[index]
                  : aiTeam?.ballHistory[index]}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            alignContent: "center",
            padding: "0px 20px",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #000000",
            }}
            src={batting ? aiTeam?.flag : userTeam?.flag}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          margin: "50px",
        }}
      >
        {choice.map((opt, index) => {
          return (
            <Button
              sx={{
                backgroundColor: "#0f0648",
                color: "#FFFFFF",
                width: "60px",
                height: "60px",
                padding: "4px 8px",
                borderRadius: "50%",
                fontWeight: 600,
                fontSize: "1em",
                fontFamily: "Rubik",
                borderBottom: " 4px solid #53489a",
                borderRight: "3px solid #53489a",
                ":hover": {
                  backgroundColor: "#0f0648cc",
                  transform: "scale(1.05)",
                  borderBottom: " 4px solid #53489a",
                  borderRight: "3px solid #53489a",
                  transition: "all 0.3s",
                },
                ":focus": {
                  outline: "none",
                },
              }}
              key={index}
              onClick={() => scoreDecision(opt.value)}
            >
              {opt.value}
            </Button>
          );
        })}
      </Box>
    </>
  );
}
