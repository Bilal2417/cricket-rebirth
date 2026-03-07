import { Box, Button, CircularProgress, Fade, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Data from "./data";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./loading";
import { Howl } from "howler";
import Wc24 from "./wc24";
import AUS from "./aus";
import BAN from "./ban";
import Wc19 from "./wc19";
import SRI from "./sri";
import Wc21 from "./wc21";
import Wc22 from "./wc22";
import Ct25 from "./ct25";
import NZ from "./nz";
import StarterScoreboard from "./starter";
import PAK from "./pak";
import ENG from "./eng";
import WI from "./wi";
import SA from "./sa";
import Wtc from "./wtc";
import { supabase } from "../supabaseClient";

export default function ScoreCardOnline() {
  const storedData = localStorage.getItem("cricketData");
  const [Teams, setTeams] = useState(
    storedData ? JSON.parse(storedData) : Data,
  );
  const teamsRef = useRef(Teams);
  useEffect(() => {
    teamsRef.current = Teams;
  }, [Teams]);

  const user = localStorage.getItem("User");
  const ai = localStorage.getItem("Opponent");

  const [userTeam, setUserTeam] = useState(null);
  const [aiTeam, setAiTeam] = useState(null);
  const userTeamRef = useRef(userTeam);
  const aiTeamRef = useRef(aiTeam);
  useEffect(() => {
    userTeamRef.current = userTeam;
  }, [userTeam]);
  useEffect(() => {
    aiTeamRef.current = aiTeam;
  }, [aiTeam]);

  const [userChoice, setUserChoice] = useState(0);
  const [opponentChoice, setOpponentChoice] = useState(0);
  const board = localStorage.getItem("Board");

  const choice = [
    { value: 0, weight: 0.1 },
    { value: 1, weight: 0.21 },
    { value: 2, weight: 0.2 },
    { value: 3, weight: 0.12 },
    { value: 4, weight: 0.2 },
    { value: 6, weight: 0.17 },
  ];

  const [over, setOver] = useState(0);
  const overRef = useRef(over);
  useEffect(() => {
    overRef.current = over;
  }, [over]);

  const [totalOvers, setTotalOvers] = useState(() => {
    const fixedOvers = localStorage.getItem("Overs");
    return fixedOvers ? Number(fixedOvers) : 10;
  });

  const [inningsOver, setInningsOver] = useState(false);
  const [overRun, setOverRun] = useState(0);

  const navigate = useNavigate();

  const [ballHistory, setBallHistory] = useState([]);
  const [show, setShow] = useState(0);
  const [batting, setBatting] = useState(null);
  const battingRef = useRef(batting);
  useEffect(() => {
    battingRef.current = batting;
  }, [batting]);

  const [battingWicket, setBattingWicket] = useState(0);
  const [firstInnings, setFirstInnings] = useState(() => {
    return Number(localStorage.getItem("currentInnings")) || 1;
  });
  const firstInningsRef = useRef(firstInnings);
  useEffect(() => {
    firstInningsRef.current = firstInnings;
  }, [firstInnings]);

  const [balls, setBalls] = useState(0);
  const [target, setTarget] = useState(() => {
    return Number(localStorage.getItem("target")) || 0;
  });
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const [partnership, setPartnership] = useState(0);
  const [partnershipBalls, setPartnershipBalls] = useState(0);

  const colors = {
    starter: "#FFF",
    aus: "#141517",
    ban: "#005601",
    wc19: "#12174c",
    wc21: "#0f033f",
    wc22: "#0f044a",
    wc24: "#0f0648",
    ct25: "#090533",
    pak: `radial-gradient( #b6b8b4, #929587)`,
    eng: "#019cd2",
    sri: userTeam?.primary,
    nz: batting
      ? `radial-gradient(${userTeam?.secondary || "#000"}, ${userTeam?.primary || "#333"})`
      : `radial-gradient(${aiTeam?.secondary || "#000"}, ${aiTeam?.primary || "#333"})`,
    wi: "#9c1444",
    sa: "#308bcb",
    wtc: "#a99981",
  };

  const borderColors = {
    starter: "#000",
    aus: batting ? userTeam?.primary : aiTeam?.primary,
    ban: "#8b0605",
    wc19: "#8b0605",
    wc21: "#da2c4e",
    wc22: "#d71c59",
    wc24: "#fa208e",
    ct25: "#02c208",
    pak: "#00000060",
    eng: "#005b85",
    sri: "black",
    nz: "#c00050",
    wi: "#e04b7f",
    sa: "#1a528c",
    wtc: "#000",
  };

  const [userProfile, setUserProfile] = useState([]);
  const userProfileRef = useRef(userProfile);
  useEffect(() => {
    userProfileRef.current = userProfile;
  }, [userProfile]);

  const profileId = localStorage.getItem("MyId");
  const opponentId = sessionStorage.getItem("OpponentId");

  useEffect(() => {
    const getUserProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      setUserProfile(data);
      console.log(data, "laa");
    };
    getUserProfile();
  }, []);

  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const strikerRef = useRef(striker);
  const nonStrikerRef = useRef(nonStriker);
  useEffect(() => {
    strikerRef.current = striker;
  }, [striker]);
  useEffect(() => {
    nonStrikerRef.current = nonStriker;
  }, [nonStriker]);

  const [randomBowler, setRandomBowler] = useState(null);
  const randomBowlerRef = useRef(randomBowler);
  useEffect(() => {
    randomBowlerRef.current = randomBowler;
  }, [randomBowler]);

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
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

  const endInnings = (finalScore) => {
    setPartnership(0);
    setPartnershipBalls(0);
    setTarget(finalScore + 1);
    setInningsOver(true);

    const change = localStorage.getItem("currentInnings");
    if (change && (change == 1 || change == "1")) {
      setBatting(!battingRef.current);
      const correct = localStorage.getItem("Innings");
      localStorage.setItem("Innings", correct === "Bat" ? "Ball" : "Bat");
      localStorage.setItem("currentInnings", "2");
      localStorage.setItem("target", finalScore + 1);
      setFirstInnings(2);
    }
  };

  const updateTeam = async (
    bowlingTeam,
    battingTeam,
    bowler,
    run,
    overso,
    ballo,
    isOverComplete = false,
    Wicket = false,
  ) => {
    // use refs for all stale closure values
    const currentBatting = battingRef.current;
    const currentStriker = strikerRef.current;
    const currentNonStriker = nonStrikerRef.current;
    const currentUserTeam = userTeamRef.current;
    const currentAiTeam = aiTeamRef.current;

    if (Number(run) == 0 && !Wicket) {
      const sounds = ["tip", "tip2"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    } else if (Number(run) == 4) {
      const sounds = ["four", "four1"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    } else if (Number(run) == 6) {
      const sounds = ["six", "six1"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    }

    const updatedTeams = teamsRef.current
      .filter((team) => team?.name == battingTeam || team?.name == bowlingTeam)
      .map((team) => {
        if (team?.name === bowlingTeam) {
          return {
            ...team,
            fow: Wicket
              ? [
                  ...(team?.fow || []),
                  currentBatting
                    ? currentUserTeam?.score
                    : currentAiTeam?.score,
                ]
              : team?.fow,
            players: team?.players.map((player) => {
              if (player.name === bowler?.name) {
                const newConceded = player.conceded + Number(run);
                const newOvers = isOverComplete
                  ? player.overs + 1
                  : player.overs;
                const newBowled = isOverComplete ? 0 : player.bowled + 1;
                const totalBalls = newOvers * 6 + newBowled;
                const oversDecimal = totalBalls / 6;
                return {
                  ...player,
                  conceded: newConceded,
                  overs: newOvers,
                  bowled: newBowled,
                  wickets: Wicket ? player.wickets + 1 : player.wickets,
                  dot: Number(run) == 0 ? player.dot + 1 : player.dot,
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

        if (team?.name === battingTeam) {
          return {
            ...team,
            score: team?.score + Number(run),
            wicket: Wicket ? team?.wicket + 1 : team?.wicket,
            Over: overso,
            Ball: ballo,
            ballHistory: Wicket
              ? (team?.ballHistory?.length || 0) === 6
                ? ["W"]
                : [...(team?.ballHistory || []), "W"]
              : (team?.ballHistory?.length || 0) === 6
                ? [Number(run)]
                : [...(team?.ballHistory || []), Number(run)],
            players: team?.players.map((player) => {
              if (player.name === currentStriker?.name) {
                return {
                  ...player,
                  score: player.score + Number(run),
                  balls: player.balls + 1,
                  out: Wicket ? true : player.out,
                  notout: Wicket ? false : true,
                  striker: Wicket ? false : player.striker,
                  bowler: Wicket ? bowler?.name : null,
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

    if (!newUserTeam) {
      console.error("newUserTeam is null, skipping DB save");
    } else {
      setUserTeam(newUserTeam);
      setAiTeam(newAiTeam);

      const { error } = await supabase
        .from("profiles")
        .update({ onlineScore: newUserTeam })
        .eq("id", profileId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update user team data:", error);
      }
    }

    const teamBatting = currentBatting ? newUserTeam : newAiTeam;
    if (teamBatting) {
      setStriker(
        teamBatting.players.find((p) => p.name === currentStriker?.name),
      );
      setNonStriker(
        teamBatting.players.find((p) => p.name === currentNonStriker?.name),
      );
    }

    const updatedBowler =
      updatedTeams
        .find((t) => t.name === bowlingTeam)
        ?.players.find((p) => p?.name === bowler?.name) || null;
    if (updatedBowler) {
      setRandomBowler(updatedBowler);
      localStorage.setItem("CurrentBowler", updatedBowler.name);
    }

    if (Wicket) {
      const teamBattingUpdated = updatedTeams.find(
        (t) => t.name === battingTeam,
      );
      const nextBatterIndex = teamBattingUpdated.wicket + 1;

      setPartnership(0);
      setPartnershipBalls(0);

      const totalWickets =
        totalOvers == 100 ? 1 : totalOvers == 20 ? 10 : totalOvers;

      if (teamBattingUpdated?.wicket + 1 <= totalWickets) {
        const nextBatter = teamBattingUpdated.players[nextBatterIndex];
        setStriker(nextBatter);
      } else {
        const latestBattingTeam = currentBatting ? newUserTeam : newAiTeam;
        const updatedScore =
          latestBattingTeam?.score + (Wicket ? 0 : Number(run));
        endInnings(updatedScore);
      }
    }
  };

  const handleBall = (run, Wkt = false, aiRun) => {
    setBalls((prevBalls) => {
      const isOverComplete = prevBalls === 5;
      const nextBalls = isOverComplete ? 0 : prevBalls + 1;
      const nextOver = isOverComplete ? overRef.current + 1 : overRef.current;

      setBallHistory((prev) => {
        const newHistory = [...prev, run];

        const currentBatting = battingRef.current;
        const currentUserTeam = userTeamRef.current;
        const currentAiTeam = aiTeamRef.current;
        const currentBowler = randomBowlerRef.current;

        updateTeam(
          currentBatting ? currentAiTeam?.name : currentUserTeam?.name,
          currentBatting ? currentUserTeam?.name : currentAiTeam?.name,
          currentBowler,
          Wkt ? 0 : currentBatting ? run : aiRun,
          nextOver,
          nextBalls,
          isOverComplete,
          Wkt,
        );

        // strike rotation
        if (!Wkt || (Wkt && isOverComplete)) {
          const currentRun = currentBatting ? run : aiRun;
          if (!(currentRun % 2 === 1 && isOverComplete)) {
            if (currentRun % 2 === 1 || isOverComplete) {
              setStriker((prevS) => {
                const temp = nonStrikerRef.current;
                setNonStriker(prevS);
                return temp;
              });
            }
          }
        }

        if (isOverComplete) {
          bowlerSelect();
          if (nextOver >= totalOvers) {
            const latestBattingTeam = currentBatting
              ? currentUserTeam
              : currentAiTeam;
            const updatedScore =
              latestBattingTeam?.score +
              (Wkt ? 0 : currentBatting ? run : aiRun);
            endInnings(updatedScore);
          } else {
            setOver(nextOver);
          }
        }

        const battingTeam = currentBatting ? currentUserTeam : currentAiTeam;
        const potentialScore =
          battingTeam?.score + (Wkt ? 0 : currentBatting ? run : aiRun);
        const potentialOvers = nextOver;

        if (firstInningsRef.current == 2) {
          if (potentialScore >= targetRef.current) {
            endInnings(potentialScore);
            localStorage.setItem("winner", 2);
            navigate("/score");
            return;
          }

          if (
            potentialOvers >= totalOvers ||
            battingTeam?.wicket + (Wkt ? 1 : 0) >=
              (totalOvers == 100 ? 1 : totalOvers == 20 ? 10 : totalOvers)
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

  const scoreDecision = (userRun, isWicket, opponentRun) => {
    console.log(userRun, isWicket, opponentRun, "loopoop");
    const currentBatting = battingRef.current;

    if (!isWicket) {
      setPartnership((prev) => prev + (currentBatting ? userRun : opponentRun));
      setPartnershipBalls((prev) => prev + 1);
    } else {
      const sounds = ["bowled", "bowled2", "bowled3"];
      playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    }

    handleBall(userRun, isWicket, opponentRun);
  };

  const checkBothChoices = async (retries = 5, delay = 300) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, choice")
      .eq("code", userProfileRef.current?.code);

    if (error || !data || data.length < 2) return;

    const me = data.find((d) => d.id === profileId);
    const opponent = data.find((d) => d.id !== profileId);

    if (
      me?.choice == null ||
      opponent?.choice == null ||
      isNaN(Number(me.choice)) ||
      isNaN(Number(opponent.choice))
    ) {
      // opponent not ready yet - retry
      if (retries > 0) {
        setTimeout(() => checkBothChoices(retries - 1, delay), delay);
      }
      return;
    }

    const userRun = Number(me.choice);
    const opponentRun = Number(opponent.choice);
    const isWicket = userRun == opponentRun;

    scoreDecision(userRun, isWicket, opponentRun);
    setIsBtnDisabled(false);

    await supabase
      .from("profiles")
      .update({ choice: null })
      .eq("id", profileId);
  };

  useEffect(() => {
    const channel = supabase
      .channel("onlineGameplay")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        async (payload) => {
          if (payload.new.id === profileId) return;
          if (payload.new.code == userProfileRef.current?.code) {
            await checkBothChoices();
          }
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const bowlerSelect = () => {
    const currentBatting = battingRef.current;
    const currentUserTeam = userTeamRef.current;
    const currentAiTeam = aiTeamRef.current;
    const currentBowler = randomBowlerRef.current;

    const bowlersList = !currentBatting
      ? currentUserTeam?.players.filter((player) => player.isBowler)
      : currentAiTeam?.players.filter((player) => player.isBowler);

    if (!bowlersList?.length) return;

    let chosen = null;
    let attempts = 0;

    while (attempts < 10) {
      const candidate =
        bowlersList[Math.floor(Math.random() * bowlersList.length)];
      if (
        candidate.name !== currentBowler?.name &&
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
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShow((prev) => (prev + 1) % 3);
    }, 3000);

    const Inning = localStorage.getItem("Innings");
    setBatting(Inning === "Ball" ? false : true);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (batting !== null) {
      const currentBowler = localStorage.getItem("CurrentBowler");
      const bowlingTeam = batting ? aiTeam : userTeam;
      if (currentBowler) {
        const selectBowler = bowlingTeam?.players.find(
          (player) => player.name === currentBowler,
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
    setTeams(newTeams);
    setUserTeam(newTeams.find((team) => team?.name === user) || null);
    setAiTeam(newTeams.find((team) => team?.name === ai) || null);
  }, [balls, user, ai]);

  useEffect(() => {
    if (!userTeam || !aiTeam) return;
    if (balls === 0 && over === 0) {
      const team = batting ? userTeam : aiTeam;
      const available = team?.players.filter((p) => !p.out);
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

  const [loading, setLoading] = useState(true);
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const boardComponents = {
    wc24: Wc24,
    starter: StarterScoreboard,
    aus: AUS,
    ban: BAN,
    wc19: Wc19,
    sri: SRI,
    eng: ENG,
    nz: NZ,
    sa: SA,
    wi: WI,
    pak: PAK,
    wc21: Wc21,
    wc22: Wc22,
    wtc: Wtc,
    ct25: Ct25,
  };

  const BoardComponent = boardComponents[board] || null;

  const boardProps = {
    batting,
    aiTeam,
    userTeam,
    striker,
    nonStriker,
    totalOvers,
    over,
    balls,
    show,
    partnership,
    partnershipBalls,
    firstInnings,
    target,
    isSix,
    randomBowler,
  };

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
          {BoardComponent && <BoardComponent {...boardProps} />}

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
            {choice.map((opt, index) => (
              <Button
                sx={{
                  background: colors[board],
                  color:
                    board == "starter" || board == "pak" ? "#000" : "#FFFFFF",
                  width: "60px",
                  height: "60px",
                  padding: "4px 8px",
                  borderRadius: "50%",
                  fontWeight: 600,
                  fontSize: "1em",
                  borderBottom: `4px solid ${borderColors[board]}`,
                  borderRight: `4px solid ${borderColors[board]}`,
                  ":hover": {
                    backgroundColor: colors[board],
                    transform: "scale(1.05)",
                    borderBottom: `4px solid ${borderColors[board]}`,
                    borderRight: `3px solid ${borderColors[board]}`,
                    transition: "all 0.3s",
                  },
                  ":focus": { outline: "none" },
                }}
                key={index}
                disabled={isBtnDisabled}
                onClick={async () => {
                  setIsBtnDisabled(true);
                  const { error } = await supabase
                    .from("profiles")
                    .update({ choice: Number(opt.value) })
                    .eq("id", profileId);

                  if (error) {
                    console.error("Failed to update choice:", error);
                    setIsBtnDisabled(false);
                    return;
                  }
                  await checkBothChoices();
                }}
              >
                {opt.value}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
