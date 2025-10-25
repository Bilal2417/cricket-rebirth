import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Data from "../components/data";
import { useNavigate } from "react-router-dom";

export default function Fixtures() {
  const [userTeam, setUserTeam] = useState(null);
  const [teams, setTeams] = useState(null);

  const tourTeams = JSON.parse(sessionStorage.getItem("Teams"));

  useEffect(() => {
    const latest = localStorage.getItem("cricketData");

    const newTeams = latest ? JSON.parse(latest) : Data;

    console.log("Updated Teams:", newTeams);
    setTeams(newTeams);

    setUserTeam(newTeams.find((team) => team.name === tourTeams[0]) || null);
    // setAiTeam(newTeams.find((team) => team.name === ai) || null);
  }, []);

  const [quater1, setQuater1] = useState(sessionStorage.getItem("q1") || null);
  const [quater2, setQuater2] = useState(sessionStorage.getItem("q2") || null);
  const [quater3, setQuater3] = useState(sessionStorage.getItem("q3") || null);
  const [quater4, setQuater4] = useState(sessionStorage.getItem("q4") || null);

  const [semi1, setSemi1] = useState(sessionStorage.getItem("s1") || null);
  const [semi2, setSemi2] = useState(sessionStorage.getItem("s2") || null);

  const [final, setFinal] = useState(sessionStorage.getItem("f") || null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("cricketData");
  }, []);

  useEffect(() => {
    if (!semi1) return;
    if (semi1 == userTeam?.name) {
      sessionStorage.setItem("Finalist", true);
      window.dispatchEvent(new Event("finalistUpdated"));
    }
    console.log(semi1, userTeam?.name, "see");
  }, [userTeam, semi2]);

  useEffect(() => {
    // const lastWinner = sessionStorage.getItem("lastMatchWinner");
    // const lastMatchId = sessionStorage.getItem("lastMatchId");

    // if (lastWinner && lastMatchId) {
    //   const setters = {
    //     q1: setQuater1,
    //     q2: setQuater2,
    //     q3: setQuater3,
    //     q4: setQuater4,
    //     s1: setSemi1,
    //     s2: setSemi2,
    //     f: setFinal,
    //   };

    //   if (setters[lastMatchId]) {
    //     setters[lastMatchId](lastWinner);
    //   }

    //   sessionStorage.removeItem("lastMatchWinner");
    sessionStorage.removeItem("lastMatchId");
    // }
  }, []);

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [totalWkts, setTotalWkts] = useState(null);

  useEffect(() => {
    const overs = localStorage.getItem("Overs");
    setTotalWkts(overs ? Number(overs) : 0);
  }, []);

  const manageTournaments = async () => {
    if (!Profile) return;

    sessionStorage.removeItem("Finalist");

    const profileId = localStorage.getItem("MyId");

    const newTitles = [...(Profile.titles || [])];

    if (userTeam?.name) {
      // Find if the team already exists by name
      const existingIndex = newTitles.findIndex(
        (t) => t.name === userTeam.name
      );

      if (existingIndex !== -1) {
        // If exists → increment its value
        if (newTitles[existingIndex].value < 10) {
          newTitles[existingIndex].value += 1;
        }
      } else {
        // If not exists → add with value 1
        newTitles.push({ value: 1, name: userTeam.name });
      }
    }
    const uniqueTitles = [];
    newTitles.forEach((t) => {
      const existing = uniqueTitles.find((u) => u.name === t.name);
      if (!existing) {
        uniqueTitles.push(t);
      } else {
        existing.value = Math.max(existing.value, t.value);
      }
    });

    const updatedProfile = {
      ...Profile,
      id: profileId || Profile?.id,
      // knockOut: (Profile.knockout || 0) + 1,
      titles: uniqueTitles,
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
        sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        console.error("Failed to update tournaments in database:", data.error);
      }
    } catch (err) {
      console.error("Error updating tournaments:", err);
    }
  };

  const matchWinner = (teamA, teamB, e) => {
    const matchId = e.currentTarget.value;
    if (teamA !== userTeam?.name && teamB !== userTeam?.name) {
      const checkWinner = Math.random() < 0.5 ? teamA : teamB;

      const setters = {
        q1: setQuater1,
        q2: setQuater2,
        q3: setQuater3,
        q4: setQuater4,
        s1: setSemi1,
        s2: setSemi2,
        f: setFinal,
      };

      if (setters[matchId]) {
        setters[matchId](checkWinner);
        sessionStorage.setItem(matchId, checkWinner);
      }
    } else {
      if (teamA == userTeam?.name) {
        localStorage.setItem("User", teamA);
        localStorage.setItem("Ai", teamB);
      } else {
        localStorage.setItem("User", teamB);
        localStorage.setItem("Ai", teamA);
      }
      sessionStorage.setItem("lastMatchId", matchId);
      navigate("/toss");
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          py: 8,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "50px",
            }}
          >
            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                // fontfamily: "Rubik",
                backgroundColor: "#343c53",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.1em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #262e40",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              value="q1"
              onClick={(e) => {
                if (!quater1) {
                  matchWinner(tourTeams[0], tourTeams[7], e);
                }
              }}
            >
              <Box component="span">Q Final 1</Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater1 && quater1 !== tourTeams[0]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[0])?.flag}
                  alt="TBD"
                />{" "}
                VS{" "}
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater1 && quater1 !== tourTeams[7]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[7])?.flag}
                  alt="TBD"
                />
              </Box>
            </Button>

            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                // fontfamily: "Rubik",
                backgroundColor: "#343c53",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.1em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #262e40",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              value="q2"
              onClick={(e) => {
                if (!quater2) {
                  matchWinner(tourTeams[1], tourTeams[6], e);
                }
              }}
              disabled={!quater1}
            >
              <Box component="span">Q Final 2</Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater2 && quater2 !== tourTeams[1]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[1])?.flag}
                  alt="TBD"
                />{" "}
                VS{" "}
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater2 && quater2 !== tourTeams[6]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[6])?.flag}
                  alt="TBD"
                />
              </Box>
            </Button>
          </Box>

          <Button
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              // fontfamily: "Rubik",
              backgroundColor: "#343c53",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "1.1em",
              position: "relative",
              px: 4,
              py: 1.5,
              overflow: "hidden",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              boxShadow: "inset 0px -8px 8px -4px #262e40",
              borderRadius: "4px",
              transition: "all 0.3s",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "2px solid black",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                pointerEvents: "none",
              },
              ":hover": {
                transform: "scale(1.02)",
              },
            }}
            value="s1"
            onClick={(e) => {
              if (!semi1) {
                matchWinner(quater1, quater2, e);
              }
            }}
            disabled={!(quater1 && quater2 && quater3 && quater4)}
          >
            <Box component="span">Semi Final 1</Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                style={{
                  width: "45px",
                  height: "30px",
                  boxShadow: "3px 3px 8px -2px #000000",
                  filter:
                    semi1 && semi1 !== quater1 ? "grayscale(100%)" : "none",
                }}
                src={teams?.find((team) => team.name == quater1)?.flag}
                alt="TBD"
              />{" "}
              VS{" "}
              <img
                style={{
                  width: "45px",
                  height: "30px",
                  boxShadow: "3px 3px 8px -2px #000000",
                  filter:
                    semi1 && semi1 !== quater2 ? "grayscale(100%)" : "none",
                }}
                src={teams?.find((team) => team.name == quater2)?.flag}
                alt="TBD"
              />
            </Box>
          </Button>
        </Box>

        <Button
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            // fontfamily: "Rubik",
            backgroundColor: "#343c53",
            color: "#FFFFFF",
            textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
            padding: "10px 40px",
            fontSize: "1.1em",
            position: "relative",
            px: 4,
            py: 1.5,
            minWidth: "200px",
            overflow: "hidden",
            clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
            boxShadow: "inset 0px -8px 8px -4px #262e40",
            borderRadius: "4px",
            transition: "all 0.3s",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              border: "2px solid black",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              pointerEvents: "none",
            },
            ":hover": {
              transform: "scale(1.02)",
            },
          }}
          value="f"
          onClick={(e) => {
            if (!final) {
              matchWinner(semi1, semi2, e);
            }
          }}
          disabled={
            !(quater1 && quater2 && quater3 && quater4 && semi1 && semi2)
          }
        >
          <Box component="span">Final</Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              style={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
                filter: final && final !== semi1 ? "grayscale(100%)" : "none",
              }}
              src={teams?.find((team) => team.name == semi1)?.flag}
              alt="TBD"
            />{" "}
            VS{" "}
            <img
              style={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
                filter: final && final !== semi2 ? "grayscale(100%)" : "none",
              }}
              src={teams?.find((team) => team.name == semi2)?.flag}
              alt="TBD"
            />
          </Box>

          <Button
            sx={{
              display: final ? "block" : "none",
              // fontfamily: "Rubik",
              backgroundColor: "#f6c401",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "0.8em",
              position: "relative",
              px: 4,
              py: 1.5,
              overflow: "hidden",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              boxShadow: "inset 0px -8px 8px -4px #b7560f",
              borderRadius: "4px",
              transition: "all 0.3s",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "2px solid black",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                pointerEvents: "none",
              },
              ":hover": {
                transform: "scale(1.02)",
              },
            }}
            onClick={() => {
              if (final && final === userTeam?.name) {
                manageTournaments();
              }
              navigate("/");
            }}
          >
            Finish
          </Button>
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Button
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              // fontfamily: "Rubik",
              backgroundColor: "#343c53",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "1.1em",
              position: "relative",
              px: 4,
              py: 1.5,
              overflow: "hidden",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              boxShadow: "inset 0px -8px 8px -4px #262e40",
              borderRadius: "4px",
              transition: "all 0.3s",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "2px solid black",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                pointerEvents: "none",
              },
              ":hover": {
                transform: "scale(1.02)",
              },
            }}
            value="s2"
            onClick={(e) => {
              if (!semi2) {
                matchWinner(quater3, quater4, e);
              }
            }}
            disabled={!(quater1 && quater2 && quater3 && quater4 && semi1)}
          >
            <Box component="span">Semi Final 2</Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                style={{
                  width: "45px",
                  height: "30px",
                  boxShadow: "3px 3px 8px -2px #000000",
                  filter:
                    semi2 && semi2 !== quater3 ? "grayscale(100%)" : "none",
                }}
                src={teams?.find((team) => team.name == quater3)?.flag}
                alt="TBD"
              />{" "}
              VS{" "}
              <img
                style={{
                  width: "45px",
                  height: "30px",
                  boxShadow: "3px 3px 8px -2px #000000",
                  filter:
                    semi2 && semi2 !== quater4 ? "grayscale(100%)" : "none",
                }}
                src={teams?.find((team) => team.name == quater4)?.flag}
                alt="TBD"
              />
            </Box>
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "50px",
            }}
          >
            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                // fontfamily: "Rubik",
                backgroundColor: "#343c53",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.1em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #262e40",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              value="q3"
              onClick={(e) => {
                if (!quater3) {
                  matchWinner(tourTeams[2], tourTeams[5], e);
                }
              }}
              disabled={!(quater1 && quater2)}
            >
              <Box component="span">Q Final 3</Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater3 && quater3 !== tourTeams[2]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[2])?.flag}
                  alt="TBD"
                />{" "}
                VS{" "}
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater3 && quater3 !== tourTeams[5]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[5])?.flag}
                  alt="TBD"
                />
              </Box>
            </Button>

            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                // fontfamily: "Rubik",
                backgroundColor: "#343c53",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.1em",
                position: "relative",
                px: 4,
                py: 1.5,
                overflow: "hidden",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                boxShadow: "inset 0px -8px 8px -4px #262e40",
                borderRadius: "4px",
                transition: "all 0.3s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  border: "2px solid black",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  pointerEvents: "none",
                },
                ":hover": {
                  transform: "scale(1.02)",
                },
              }}
              value="q4"
              onClick={(e) => {
                if (!quater4) {
                  matchWinner(tourTeams[3], tourTeams[4], e);
                }
              }}
              disabled={!(quater1 && quater2 && quater3)}
            >
              <Box component="span">Q Final 4</Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater4 && quater4 !== tourTeams[3]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[3])?.flag}
                  alt="TBD"
                />{" "}
                VS{" "}
                <img
                  style={{
                    width: "45px",
                    height: "30px",
                    boxShadow: "3px 3px 8px -2px #000000",
                    filter:
                      quater4 && quater4 !== tourTeams[4]
                        ? "grayscale(100%)"
                        : "none",
                  }}
                  src={teams?.find((team) => team.name == tourTeams[4])?.flag}
                  alt="TBD"
                />
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
