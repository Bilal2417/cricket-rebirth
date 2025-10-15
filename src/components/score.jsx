import { Box, Button, CircularProgress, Fade, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Data from "./data";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./loading";
import { Howl } from "howler";
import Wc24 from "./wc24";
import AUS from "./aus";

export default function ScoreCard() {
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
    { value: 0, weight: 0.1 },
    { value: 1, weight: 0.21 },
    { value: 2, weight: 0.2 },
    { value: 3, weight: 0.12 },
    { value: 4, weight: 0.2 },
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

  const [show, setShow] = useState(0);

  const [batting, setBatting] = useState(null);

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
          nextOver, //  pass updated over
          nextBalls, //  pass updated balls
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
            // const newInning = Inning == "Bat" ? "Ball" : "Bat";
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

  const [isSix, setIsSix] = useState(() => {
    return Number(localStorage.getItem("Boundary")) || 0;
  });

  let clickSound = null;

  const playSound = (sound) => {
    if (clickSound && clickSound.playing()) {
      clickSound.stop();
    }

    clickSound = new Howl({
      src: [`/sound/${sound}.mp3`],
      volume: 1,
      onend: () => {
        clickSound = null;
      },
    });

    clickSound.play();
  };

  const scoreDecision = (userRun) => {
    if (balls == 5) {
      setIsSix(0);
      sessionStorage.setItem("Boundary", 0);
    }

    console.log(balls);
    let aiChoice;
    let isWicket = false;

    if (batting) {
      for (let i = 0; i <= isSix; i++) {
        aiChoice = weightedRandom(choice);
        if (aiChoice === userRun) {
          isWicket = true;
          break;
        }
        console.log(aiChoice, "aiChoice");
      }
      if ((userRun == 6 || userRun == "6") && !isWicket) {
        setIsSix((prev) => prev + 1);
        sessionStorage.setItem("Boundary", isSix + 1);
      }
    } else {
      setIsSix(0);
      sessionStorage.setItem("Boundary", 0);
      aiChoice = weightedRandom(choice);
      console.log(aiChoice, "aiBatting");
      isWicket = userRun == aiChoice;
    }

    if (!isWicket) {
      setPartnership((prev) => prev + (batting ? userRun : aiChoice));
      setPartnershipBalls((prev) => prev + 1);
    } else {
      const sounds = ["bowled", "bowled2", "bowled3"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    }

    handleBall(userRun, isWicket, aiChoice);
  };

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
    if (run == 0) {
      const sounds = ["tip", "tip2"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    } else if (run == 4) {
      const sounds = ["four", "four1"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    } else if (run == 6) {
      const sounds = ["six", "six1"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    }
    const updatedTeams = Teams.filter((team)=> team.name == battingTeam || team.name == bowlingTeam).map((team) => {
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

      return team;
    });

    setTeams(updatedTeams);
    localStorage.setItem("cricketData", JSON.stringify(updatedTeams));

    const newUserTeam = updatedTeams.find((t) => t.name === user) || null;
    const newAiTeam = updatedTeams.find((t) => t.name === ai) || null;
    setUserTeam(newUserTeam);
    setAiTeam(newAiTeam);

    const teamBatting = batting ? newUserTeam : newAiTeam;
    setStriker(teamBatting.players.find((p) => p.name === striker.name));
    setNonStriker(teamBatting.players.find((p) => p.name === nonStriker.name));

    const updatedBowler =
      updatedTeams
        .find((t) => t.name === bowlingTeam)
        ?.players.find((p) => p?.name === randomBowler?.name) || null;
    setRandomBowler(updatedBowler);
    localStorage.setItem("CurrentBowler", updatedBowler.name);

    if (Wicket) {
      const teamBatting = updatedTeams.find((t) => t.name === battingTeam);
      const nextBatterIndex = teamBatting.wicket + 1;

      setPartnership(0);
      setPartnershipBalls(0);

      if (
        teamBatting?.wicket + (Wicket ? 1 : 0) <=
        (totalOvers == 100 ? 1 : totalOvers == 20 ? 10 : totalOvers) //used as total wickets
      ) {
        const nextBatter = teamBatting.players[nextBatterIndex];

        const updatedPlayers = teamBatting.players.map((p, i) => ({
          ...p,
          striker: i === nextBatterIndex,
          notout: i === nextBatterIndex ? true : p.notout && !p.out,
        }));

        setStriker(nextBatter);

        teamBatting.players = updatedPlayers;
      } else {
        const latestBattingTeam = batting ? userTeam : aiTeam;
        const updatedScore = latestBattingTeam?.score + (Wicket ? 0 : run);

        endInnings(updatedScore); // all out
      }
    }
  };

  const [randomBowler, setRandomBowler] = useState(null);

  const bowlerSelect = () => {
    const bowlersList = !batting
      ? userTeam.players.filter((player) => player.isBowler)
      : aiTeam.players.filter((player) => player.isBowler);

    if (!bowlersList.length) return;

    let chosen = null;
    let attempts = 0;

    while (attempts < 10) {
      const candidate =
        bowlersList[Math.floor(Math.random() * bowlersList.length)];

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
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoadingPage && (
        <LoadingPage
          loading={loading}
          onFinish={() => setShowLoadingPage(false)}
        />
      )}

      {!showLoadingPage && (
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
          {/* <Wc24
            batting={batting}
            aiTeam={aiTeam}
            userTeam={userTeam}
            striker={striker}
            nonStriker={nonStriker}
            getInitials={getInitials}
            totalOvers={totalOvers}
            over={over}
            balls={balls}
            show={show}
            partnership={partnership}
            partnershipBalls={partnershipBalls}
            firstInnings={firstInnings}
            target={target}
            isSix={isSix}
            randomBowler={randomBowler}
            /> */}
          <AUS
            batting={batting}
            aiTeam={aiTeam}
            userTeam={userTeam}
            striker={striker}
            nonStriker={nonStriker}
            totalOvers={totalOvers}
            over={over}
            balls={balls}
            show={show}
            partnership={partnership}
            partnershipBalls={partnershipBalls}
            firstInnings={firstInnings}
            target={target}
            isSix={isSix}
            randomBowler={randomBowler}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
              margin: "50px",
              padding: { xs: "0 600px", md: "0" },
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
                    // fontfamily: "Rubik",
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
        </Box>
      )}
    </>
  );
}
