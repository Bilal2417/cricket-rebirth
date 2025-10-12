// Tournament.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Stepper,
  StepLabel,
  Step,
  CircularProgress,
} from "@mui/material";
import Data from "../components/data"; // your Data with flag URLs
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const teamsData = Data;

// Round-robin generator (returns fixtures grouped by round)
function generateRoundRobinRounds(teams) {
  const names = teams.map((t) => ({ name: t.name, flag: t.flag }));
  const n = names.length;
  // if odd, add a bye (shouldn't be needed for 12+ but safe)
  const hasBye = n % 2 === 1;
  const teamList = hasBye
    ? [...names, { name: "Bye", flag: null }]
    : [...names];

  const m = teamList.length;
  const rounds = m - 1;
  const half = m / 2;
  const roundsArr = [];

  // create a rotating array except first element
  const arr = [...teamList];

  for (let r = 0; r < rounds; r++) {
    const roundMatches = [];
    for (let i = 0; i < half; i++) {
      const t1 = arr[i];
      const t2 = arr[m - 1 - i];
      if (t1.name === "Bye" || t2.name === "Bye") continue;
      roundMatches.push({
        id: `${t1.name}-${t2.name}-r${r + 1}`,
        round: r + 1,
        match: `${t1.name} vs ${t2.name}`,
        team1: t1.name,
        team2: t2.name,
        team1Flag: t1.flag,
        team2Flag: t2.flag,
        result: null,
        started: false,
      });
    }
    roundsArr.push(roundMatches);
    // rotate (keep first fixed)
    arr.splice(1, 0, arr.pop());
  }

  return roundsArr;
}

export default function Tournament() {
  const [rounds, setRounds] = useState([]); // array of round arrays
  const [flatFixtures, setFlatFixtures] = useState([]); // flattened for easy indexing
  const [standings, setStandings] = useState([]);
  const [stage, setStage] = useState("league"); // league | semis | final | done
  const [semiFinals, setSemiFinals] = useState([]);
  const [finalMatch, setFinalMatch] = useState(null);
  const [winner, setWinner] = useState(null);

  // init: load or create fixtures + standings

  const [userTeam, setUserTeam] = useState(null);

  useEffect(() => {
    const team = localStorage.getItem("User");
    if (team) setUserTeam(team);
    const saved = localStorage.getItem("tournamentData");
    if (saved) {
      const data = JSON.parse(saved);
      setRounds(data.rounds || []);
      setFlatFixtures(data.flatFixtures || []);
      setStandings(data.standings || []);
      setStage(data.stage || "league");
      setSemiFinals(data.semiFinals || []);
      setFinalMatch(data.finalMatch || null);
      setWinner(data.winner || null);
    } else {
      // generate rounds (round-robin)
      const generatedRounds = generateRoundRobinRounds(teamsData);

      // optionally randomize the **order of rounds** (so round 1/2/.. get shuffled once)
      const randomizedRounds = [...generatedRounds].sort(
        () => Math.random() - 0.5
      );

      // flatten
      const flattened = randomizedRounds.flat();

      const initialStandings = teamsData.map((t) => ({
        team: t.name,
        fullName: t.name,
        flag: t.flag,
        points: 0,
        played: 0,
        won: 0,
        lost: 0,
        nrr: 0,
      }));

      const sortedStandings = [...initialStandings].sort((a, b) => {
        if (b.points === a.points) return b.nrr - a.nrr;
        return b.points - a.points;
      });

      setRounds(randomizedRounds);
      setFlatFixtures(flattened);
      setStandings(sortedStandings);

      // Persist initial structure so order is kept
      localStorage.setItem(
        "tournamentData",
        JSON.stringify({
          rounds: randomizedRounds,
          flatFixtures: flattened,
          standings: sortedStandings,
          stage: "league",
          semiFinals: [],
          finalMatch: null,
          winner: null,
        })
      );
    }
  }, []);

  // persist whenever key state changes
  useEffect(() => {
    if (!flatFixtures.length) return;
    const payload = {
      rounds,
      flatFixtures,
      standings,
      stage,
      semiFinals,
      finalMatch,
      winner,
    };
    localStorage.setItem("tournamentData", JSON.stringify(payload));
  }, [rounds, flatFixtures, standings, stage, semiFinals, finalMatch, winner]);

  // helper to update a flat fixture by index and also update rounds copy
  const updateFixture = (index, changeFn) => {
    const updatedFlat = [...flatFixtures];
    updatedFlat[index] = changeFn(updatedFlat[index]);
    setFlatFixtures(updatedFlat);

    // rebuild rounds from flattened while preserving round grouping
    const newRounds = [];
    let cursor = 0;
    // use previous rounds' lengths to split; if rounds is empty, assume  (flat length / (teams/2)) lines
    const prevRoundLengths = rounds.length
      ? rounds.map((r) => r.length)
      : (() => {
          // fallback equal sized rounds
          const perRound = Math.floor(
            flatFixtures.length / (teamsData.length - 1) || 1
          );
          return Array.from({ length: teamsData.length - 1 }, () => perRound);
        })();

    for (let len of prevRoundLengths) {
      newRounds.push(updatedFlat.slice(cursor, cursor + len));
      cursor += len;
    }
    // if something left, push it as additional round
    if (cursor < updatedFlat.length) newRounds.push(updatedFlat.slice(cursor));
    setRounds(newRounds);
  };

  // start a fixture (mark started true)
  //   const handleStartMatch = (index) => {
  //     updateFixture(index, (f) => ({ ...f, started: true }));
  // };

  // register result; index is flatFixtures index

  const navigate = useNavigate();

  const handleResult = (index, Teams) => {
    const f = flatFixtures[index];

    if (!f) return;
    // updateFixture(index, (f) => ({ ...f, started: true }));

    if (Teams.team1 == userTeam || Teams.team2 == userTeam) {
      if (Teams.team1 == userTeam) {
        localStorage.setItem("User", Teams.team1);
        localStorage.setItem("Ai", Teams.team2);
      } else {
        localStorage.setItem("User", Teams.team2);
        localStorage.setItem("Ai", Teams.team1);
      }
      const userMatch = {
        fixtureId: index,
        winner: null,
        loser: null,
      };
      sessionStorage.setItem("latestUserMatch", JSON.stringify(userMatch));
      navigate("/toss");
    } else {
      const winnerTeam = Math.random() < 0.5 ? Teams.team1 : Teams.team2;
      const losingTeam = winnerTeam === Teams.team1 ? Teams.team2 : Teams.team1;
      const nrrChange = (Math.random() * 0.75).toFixed(2);
      // Update the fixture
      updateFixture(index, (fx) => ({
        ...fx,
        result: winnerTeam,
        started: false,
      }));

      // Recalculate standings from all fixtures
      setStandings((prev) => {
        // Update standings first
        const updated = prev.map((s) => {
          if (s.team === winnerTeam) {
            const newPlayed = s.played + 1;
            const newNRR = (s.nrr * s.played + Number(nrrChange)) / newPlayed;

            return {
              ...s,
              played: newPlayed,
              won: s.won + 1,
              points: s.points + 2,
              nrr: parseFloat(newNRR.toFixed(2)),
            };
          }

          if (s.team === losingTeam) {
            const newPlayed = s.played + 1;
            const newNRR = (s.nrr * s.played - Number(nrrChange)) / newPlayed;

            return {
              ...s,
              played: newPlayed,
              lost: s.lost + 1,
              nrr: parseFloat(newNRR.toFixed(2)),
            };
          }

          return s;
        });

        // Then sort by points (desc), and by NRR (desc) if points are equal
        const sorted = [...updated].sort((a, b) => {
          if (b.points === a.points) return b.nrr - a.nrr;
          return b.points - a.points;
        });

        return sorted;
      });
    }
  };

  useEffect(() => {
    const userMatch = JSON.parse(sessionStorage.getItem("latestUserMatch"));
    localStorage.removeItem("cricketData");
    if (!userMatch) return;

    if (stage == "league") {
      const f = flatFixtures[userMatch.fixtureId];
      if (!f) return;

      // Update the fixture with the user result
      updateFixture(userMatch.fixtureId, (fx) => ({
        ...fx,
        result: userMatch.winner,
        started: false,
      }));

      // Update standings for just this match
      const winnerTeam = userMatch.winner;
      const losingTeam = winnerTeam === f.team1 ? f.team2 : f.team1;
      const nrrChange = (Math.random() * 0.75).toFixed(2);

      setStandings((prev) => {
        // Update standings first
        const updated = prev.map((s) => {
          if (s.team === winnerTeam) {
            const newPlayed = s.played + 1;
            const newNRR = (s.nrr * s.played + Number(nrrChange)) / newPlayed;

            return {
              ...s,
              played: newPlayed,
              won: s.won + 1,
              points: s.points + 2,
              nrr: parseFloat(newNRR.toFixed(2)),
            };
          }

          if (s.team === losingTeam) {
            const newPlayed = s.played + 1;
            const newNRR = (s.nrr * s.played - Number(nrrChange)) / newPlayed;

            return {
              ...s,
              played: newPlayed,
              lost: s.lost + 1,
              nrr: parseFloat(newNRR.toFixed(2)),
            };
          }

          return s;
        });

        // Then sort by points (desc), and by NRR (desc) if points are equal
        const sorted = [...updated].sort((a, b) => {
          if (b.points === a.points) return b.nrr - a.nrr;
          return b.points - a.points;
        });

        return sorted;
      });
    } else if (stage == "semis") {
      setSemiFinals((prev) =>
        prev.map((m, idx) =>
          idx === userMatch.fixtureId
            ? {
                ...m,
                result: userMatch.winner,
              }
            : m
        )
      );
    } else if (stage == "final") {
      setFinalMatch({
        ...finalMatch,
        result: userMatch.winner,
      });
    }
    sessionStorage.removeItem("latestUserMatch");
  }, [flatFixtures, stage]);

  // Watch for league end -> semis
  useEffect(() => {
    if (
      stage === "league" &&
      flatFixtures.length &&
      flatFixtures.every((f) => f.result !== null)
    ) {
      const sorted = [...standings].sort((a, b) => b.points - a.points);
      const top4 = sorted.slice(0, 4);
      setSemiFinals([
        {
          team1: top4[0].team,
          team2: top4[3].team,
          team1Flag: top4[0].flag,
          team2Flag: top4[3].flag,
          result: null,
        },
        {
          team1: top4[1].team,
          team2: top4[2].team,
          team1Flag: top4[1].flag,
          team2Flag: top4[2].flag,
          result: null,
        },
      ]);
      setStage("semis");
    }
  }, [flatFixtures, standings]);

  // semis -> final
  useEffect(() => {
    if (
      stage === "semis" &&
      semiFinals.length &&
      semiFinals.every((s) => s.result !== null)
    ) {
      const winners = semiFinals.map((s) => s.result);
      const sf0 = semiFinals[0];
      const sf1 = semiFinals[1];
      setFinalMatch({
        team1: winners[0],
        team2: winners[1],
        team1Flag: sf0.result === sf0.team1 ? sf0.team1Flag : sf0.team2Flag,
        team2Flag: sf1.result === sf1.team1 ? sf1.team1Flag : sf1.team2Flag,
        result: null,
      });
      setStage("final");
    }
  }, [semiFinals]);

  useEffect(() => {
    const team = localStorage.getItem("User");
    if (team) setUserTeam(team);
    if (!semiFinals && !finalMatch) return;

    let includesUserTeam = false;

    if (finalMatch) {
      // 🔹 Check only final if it exists
      includesUserTeam =
        finalMatch.team1 === userTeam || finalMatch.team2 === userTeam;
    } else if (semiFinals) {
      // 🔹 Otherwise check semifinals
      includesUserTeam = semiFinals.some(
        (m) => m.team1 === userTeam || m.team2 === userTeam
      );
    }

    if (includesUserTeam) {
      sessionStorage.setItem("Finalist", true);
      window.dispatchEvent(new Event("finalistUpdated"));
    } else {
      sessionStorage.removeItem("Finalist");
    }
  }, [semiFinals, finalMatch, userTeam]);

  // final -> done
  useEffect(() => {
    if (stage === "final" && finalMatch?.result) {
      setWinner(finalMatch.result);
      setStage("done");
    }
  }, [finalMatch, stage]);

  // compute next match index to enforce "previous match completed"
  // we simply iterate flatFixtures: next locked unless previous result exists

  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const stages = ["League", "Semi-Finals", "Final"];
  const stageIndex = {
    league: 0,
    semis: 1,
    final: 2,
    done: 2,
  };

  const renderMatchCard = (f, flatIndex) => {
    const canStart =
      flatIndex === 0 || flatFixtures[flatIndex - 1]?.result !== null;
    const alreadyPlayed = flatFixtures[flatIndex]?.result !== null;

    const handleClick = () => {
      if (!alreadyPlayed) {
        if (canStart) {
          handleResult(flatIndex, f);
        } else {
          setOpenToast(true);
          setToastMsg("Play previous match first!");
          // toast.error("Play previous match first!", {
          //   position: "top-right",
          //   autoClose: 2000,
          //   theme: "colored",
          // });
        }
      } else {
        setOpenToast(true);
        setToastMsg("Match already played!");
      }
    };

    return (
      <>
        <Card
          key={f.id}
          variant="outlined"
          sx={{
            mb: 1,
            backgroundColor:
              canStart && !alreadyPlayed
                ? "#0f0648"
                : f.team1 == userTeam || f.team2 == userTeam
                ? "#fa208e"
                : "#FFFFFF",
            color:
              canStart && !alreadyPlayed
                ? "#FFFFFF"
                : f.team1 == userTeam || f.team2 == userTeam
                ? "#FFFFFF"
                : "#0f0648",
            transform:
              canStart && !alreadyPlayed ? "scale(1.0)" : "scale(0.97)",
            transition: "all 0.3s linear",
            ":hover": {
              cursor: "pointer",
              transform: "scale(1.0)",
            },
          }}
          onClick={() => handleClick()}
        >
          <CardContent>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} md={3}>
                <Typography fontWeight={600}>Match {flatIndex + 1}</Typography>
              </Grid>

              <Grid item xs={12} md={9} minWidth="350px">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Box
                      component="img"
                      src={f.team1Flag}
                      alt={f.team1}
                      sx={{
                        width: 36,
                        height: 24,
                        borderRadius: "4px",
                        filter:
                          f.result === f.team2 ? "grayscale(100%)" : "none",
                        boxShadow: "3px 3px 8px -2px #000000",
                      }}
                    />
                    <Typography
                      sx={{
                        opacity: f.result === f.team2 ? 0.3 : 1,
                        width: "110px",
                      }}
                      fontWeight={700}
                    >
                      {f.team1}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color:
                        canStart && !alreadyPlayed
                          ? "#FFFFFF"
                          : f.team1 == userTeam || f.team2 == userTeam
                          ? "#FFFFFF"
                          : "#0f0648",
                      width: "50px",
                      textAlign: "center",
                    }}
                  >
                    vs
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        opacity: f.result === f.team1 ? 0.3 : 1,
                        width: "110px",
                        textAlign: "end",
                      }}
                      fontWeight={700}
                    >
                      {f.team2}
                    </Typography>
                    <Box
                      component="img"
                      src={f.team2Flag}
                      alt={f.team2}
                      sx={{
                        width: 36,
                        height: 24,
                        borderRadius: "4px",
                        filter:
                          f.result === f.team1 ? "grayscale(100%)" : "none",
                        boxShadow: "3px 3px 8px -2px #000000",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Snackbar
          open={openToast}
          autoHideDuration={2000}
          onClose={() => setOpenToast(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setOpenToast(false)}
          >
            {toastMsg}
          </Alert>
        </Snackbar>
      </>
    );
  };

  const resetTournament = () => {
    localStorage.removeItem("tournamentData");
    const generatedRounds = generateRoundRobinRounds(teamsData);
    const randomizedRounds = [...generatedRounds].sort(
      () => Math.random() - 0.5
    );
    const flattened = randomizedRounds.flat();
    const initialStandings = teamsData.map((t) => ({
      team: t.name,
      fullName: t.name,
      flag: t.flag,
      points: 0,
      played: 0,
      won: 0,
      lost: 0,
      nrr: 0,
    }));

    const sortedStandings = [...initialStandings].sort((a, b) => {
      if (b.points === a.points) return b.nrr - a.nrr;
      return b.points - a.points;
    });

    setRounds(randomizedRounds);
    setFlatFixtures(flattened);
    setStandings(sortedStandings);
    setStage("league");
    setSemiFinals([]);
    setFinalMatch(null);
    setWinner(null);

    localStorage.setItem(
      "tournamentData",
      JSON.stringify({
        rounds: randomizedRounds,
        flatFixtures: flattened,
        standings: sortedStandings,
        stage: "league",
        semiFinals: [],
        finalMatch: null,
        winner: null,
      })
    );
    navigate("/")
  };

  const [Profile, setProfile] = useState(() => {
    const storedProfile = sessionStorage.getItem("Profile");
    return storedProfile ? JSON.parse(storedProfile) : "";
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveTournament = async (winner) => {
    setButtonDisabled(true);
    setLoading(true);

    const profileId = localStorage.getItem("MyId");

    console.log(profileId, Profile, "all");
    if (!Profile) return;

    let coinsIncrement = 0;
    if (winner == userTeam) {
      coinsIncrement = 3000;
    }
    const updatedProfile = {
      ...Profile,
      id: profileId || Profile?.id,
      // victories: win ? Profile.victories + 1 : Profile.victories,
      coins: Profile.coins + coinsIncrement,
    };

    console.log(updatedProfile, "Profile that is sending");
    setProfile(updatedProfile);

    localStorage.removeItem("tournamentData");
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
    // };
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🏆 Cricket World Cup
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          {teamsData.length} Teams • League + Knockout
        </Typography>
      </Paper>

      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={stageIndex[stage]} alternativeLabel>
          {stages.map((label, index) => (
            <Step
              key={label}
              onClick={() => {
                if (index === 0) setStage("league");
                else if (index === 1) setStage("semis");
                else if (index === 2) setStage("final");
              }}
            >
              <StepLabel>
                <Box
                  sx={{
                    cursor: "pointer",
                    color: "#FFFFFF",
                  }}
                  component="span"
                >
                  {label}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {stage === "league" && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={2} md={8}>
            <Box>
              <Typography variant="h6" gutterBottom>
                📋 League Stage
              </Typography>

              <Box
                sx={{
                  maxHeight: "500px",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                    border: "2px solid #f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },

                  scrollbarWidth: "thin",
                  scrollbarColor: "#888 #f1f1f1",
                }}
              >
                {/* show flat fixtures (in round order preserved) */}
                {flatFixtures.map((f, idx) => renderMatchCard(f, idx))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={4} md={4} sx={{ overflow: "auto" }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Points Table
              </Typography>
              <Table size="small" aria-label="points table">
                <TableHead>
                  <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell align="center">P</TableCell>
                    <TableCell align="center">W</TableCell>
                    <TableCell align="center">L</TableCell>
                    <TableCell align="center">Pts</TableCell>
                    <TableCell align="center">Nrr</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings
                    .slice()
                    .sort((a, b) => b.points - a.points)
                    .map((s, idx) => (
                      <TableRow
                        sx={{
                          backgroundColor:
                            s.team === userTeam ? "#fa208e" : "default",
                          // #e32484
                          "&&:hover": {
                            backgroundColor:
                              s.team === userTeam ? "#e32484" : "default", // Normal hover for non-top4 rows
                          },
                          "&.Mui-selected": {
                            backgroundColor:
                              s.team === userTeam ? "#fa208e" : "default", // Keep same color even when selected
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor:
                              s.team === userTeam ? "#e32484" : "default", // Slightly darker on hover for top 4
                          },
                        }}
                        key={s.team}
                        hover
                        selected={idx < 4}
                      >
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                        >
                          {idx + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={s.flag}
                              alt={s.team}
                              sx={{ width: 28, height: 18 }}
                            />
                            <Typography>{s.team}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                          align="center"
                        >
                          {s.played >= 9 ? 9 : s.played}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                          align="center"
                        >
                          {s.won}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                          align="center"
                        >
                          {s.lost}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                          align="center"
                        >
                          {s.points}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: s.team == userTeam ? "#FFFFFF" : "#0f0648",
                          }}
                          align="center"
                        >
                          {s.nrr}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />
              <Typography variant="caption">
                Top 4 teams qualify for Semi-Finals
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {stage === "semis" && (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">🎯 Semi Finals</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {semiFinals.map((sf, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Card
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      if (!sf.result) {
                        if (sf.team1 == userTeam || sf.team2 == userTeam) {
                          if (sf.team1 == userTeam) {
                            localStorage.setItem("User", sf.team1);
                            localStorage.setItem("Ai", sf.team2);
                          } else {
                            localStorage.setItem("User", sf.team2);
                            localStorage.setItem("Ai", sf.team1);
                          }
                          const userMatch = {
                            fixtureId: i,
                            winner: null,
                            loser: null,
                          };
                          sessionStorage.setItem(
                            "latestUserMatch",
                            JSON.stringify(userMatch)
                          );
                          navigate("/toss");
                        } else {
                          setSemiFinals((prev) =>
                            prev.map((m, idx) =>
                              idx === i
                                ? {
                                    ...m,
                                    result:
                                      Math.random() < 0.5 ? sf.team1 : sf.team2,
                                  }
                                : m
                            )
                          );
                        }
                      } else {
                        setOpenToast(true);
                        setToastMsg("Match already played!");
                      }
                    }}
                    variant="outlined"
                  >
                    <CardContent>
                      <Typography fontWeight={700} gutterBottom>
                        Semi Final {i + 1}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            component="img"
                            src={sf.team1Flag}
                            alt={sf.team1}
                            sx={{
                              width: 28,
                              height: 18,
                              filter:
                                sf.result && sf.result !== sf.team1
                                  ? "grayscale(100%)"
                                  : "none",
                              boxShadow: "3px 3px 8px -2px #000000",
                            }}
                          />
                          <Typography fontWeight={700}>{sf.team1}</Typography>
                        </Stack>
                        <Typography>vs</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={700}>{sf.team2}</Typography>
                          <Box
                            component="img"
                            src={sf.team2Flag}
                            alt={sf.team2}
                            sx={{
                              width: 28,
                              height: 18,
                              filter:
                                sf.result && sf.result !== sf.team2
                                  ? "grayscale(100%)"
                                  : "none",
                              boxShadow: "3px 3px 8px -2px #000000",
                            }}
                          />
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        {sf.result ? (
                          <Typography
                            color="success.main"
                            fontWeight={700}
                            textAlign="center"
                          >
                            ✓ Winner:{" "}
                            <img
                              src={
                                sf.result === sf.team1
                                  ? sf.team1Flag
                                  : sf.team2Flag
                              }
                              alt="sf-winner"
                              style={{
                                width: 20,
                                height: 14,
                                verticalAlign: "middle",
                                marginRight: 6,
                              }}
                            />
                            {sf.result}
                          </Typography>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              sx={{ flex: 1 }}
                              disabled
                            >
                              Waiting
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}

      {stage === "final" && finalMatch && (
        <Paper
          sx={{
            p: 3,
            mb: 2,
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            if (!finalMatch.result) {
              if (
                finalMatch.team1 == userTeam ||
                finalMatch.team2 == userTeam
              ) {
                if (finalMatch.team1 == userTeam) {
                  localStorage.setItem("User", finalMatch.team1);
                  localStorage.setItem("Ai", finalMatch.team2);
                } else {
                  localStorage.setItem("User", finalMatch.team2);
                  localStorage.setItem("Ai", finalMatch.team1);
                }
                const userMatch = {
                  fixtureId: "f",
                  winner: null,
                  loser: null,
                };
                sessionStorage.setItem(
                  "latestUserMatch",
                  JSON.stringify(userMatch)
                );
                navigate("/toss");
              } else {
                setFinalMatch({
                  ...finalMatch,
                  result:
                    Math.random() < 0.5 ? finalMatch.team1 : finalMatch.team2,
                });
              }
            } else {
              setOpenToast(true);
              setToastMsg("Match already played!");
            }
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            🏆 FINAL
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              justifyContent: "center",
              m: "30px",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src={finalMatch.team1Flag}
                alt={finalMatch.team1}
                sx={{ width: 36, height: 24, borderRadius: "4px" }}
              />
              <Typography fontWeight={700}>{finalMatch.team1}</Typography>
            </Stack>
            <Typography>vs</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={700}>{finalMatch.team2}</Typography>
              <Box
                component="img"
                src={finalMatch.team2Flag}
                alt={finalMatch.team2}
                sx={{ width: 36, height: 24, borderRadius: "4px" }}
              />
            </Stack>
          </Box>

          {finalMatch.result ? (
            <Box textAlign="center" sx={{ py: 2 }}>
              <Typography variant="h6" color="success.main">
                🎉 Champion:{" "}
                <img
                  src={
                    finalMatch.result === finalMatch.team1
                      ? finalMatch.team1Flag
                      : finalMatch.team2Flag
                  }
                  alt="champ-flag"
                  style={{
                    width: 22,
                    height: 15,
                    verticalAlign: "middle",
                    marginRight: 8,
                  }}
                />
                {finalMatch.result}
              </Typography>
            </Box>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" sx={{ flex: 1 }} disabled>
                TBD
              </Button>
            </Stack>
          )}
        </Paper>
      )}

      {stage === "done" && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            🏆 WORLD CHAMPION
          </Typography>
          <Box sx={{ mb: 2 }}>
            <img
              src={teamsData.find((t) => t.name === winner)?.flag}
              alt="champion-flag"
              style={{ width: 60, height: 40 }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {winner}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              disabled={buttonDisabled}
              onClick={async () => {
                saveTournament(winner);
                navigate("/");
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Save Progress"
              )}
            </Button>
          </Box>
        </Paper>
      )}

      <Box
        sx={{
          textAlign: "center",
          mt: 2,
          display: stage === "done" ? "none" : "block",
        }}
      >
        <Button variant="contained" color="error" onClick={resetTournament}>
          🔄 Reset Tournament
        </Button>
      </Box>
    </Box>
  );
}
