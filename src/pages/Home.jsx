import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  HighlightOff,
  Person,
  ScoreboardRounded,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { keyframes } from "@emotion/react";
import { GiCardboardBox, GiShoppingCart, GiTrophy } from "react-icons/gi";

export default function Home() {
  const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [scoreBoard, setScoreBoard] = useState(false);

  useEffect(() => {
    const keysToClear = [
      "q1",
      "q2",
      "q3",
      "q4",
      "s1",
      "s2",
      "f",
      "Teams",
      "Finalist",
      "Boundary",
    ];
    keysToClear.forEach((key) => sessionStorage.removeItem(key));

    const keysToClearLocally = [
      "Ai",
      "target",
      "CurrentBowler",
      "FirstInnings",
      "Innings",
      "currentInnings",
      "winner",
    ];
    keysToClearLocally.forEach((key) => localStorage.removeItem(key));

    const tournament = localStorage.getItem("tournamentData");
    if (!tournament) {
      localStorage.removeItem("User");
    }
    window.dispatchEvent(new Event("BackUpdated"));
  }, []);

  const [overs, setOvers] = useState(() =>
    Number(localStorage.getItem("Overs"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setOvers(Number(localStorage.getItem("Overs")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showDescToast = (desc) => {
    toast.error(desc, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const profileId = localStorage.getItem("MyId");

  const board = localStorage.getItem("Board");

  // useEffect(() => {
  //   let isMounted = true; // ✅ Prevents state updates if component unmounts

  //   const fetchProfiles = async () => {
  //     try {
  //       const res = await fetch("/.netlify/functions/getProfile");
  //       const data = await res.json();

  //       if (isMounted && data?.success && data.profiles) {
  //         setProfiles(data.profiles);

  //         const matchedProfile = data.profiles.find(
  //           (profile) => profile.id === profileId
  //         );

  //         if (matchedProfile) {
  //           setUserProfile(matchedProfile);
  //           sessionStorage.setItem("Profile", JSON.stringify(matchedProfile));
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching profiles:", err);
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   };

  //   fetchProfiles();

  //   const interval = setInterval(fetchProfiles, 150000);

  //   return () => {
  //     isMounted = false;
  //     clearInterval(interval);
  //   };
  // }, [profileId]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfiles = async (force = false) => {
      try {
        const cached = JSON.parse(
          sessionStorage.getItem("profilesData") || "{}"
        );
        const now = Date.now();

        if (
          !force &&
          cached.timestamp &&
          now - cached.timestamp < 5 * 60 * 1000
        ) {
          setProfiles(cached.data);
          const matchedProfile = cached.data.find((p) => p.id === profileId);
          if (matchedProfile) {
            setUserProfile(matchedProfile);
            sessionStorage.setItem("Profile", JSON.stringify(matchedProfile));
          }
          setLoading(false);
          return;
        }

        const res = await fetch("/.netlify/functions/getProfile");
        const data = await res.json();

        if (isMounted && data?.success && data.profiles) {
          setProfiles(data.profiles);
          sessionStorage.setItem(
            "profilesData",
            JSON.stringify({ data: data.profiles, timestamp: now })
          );

          const matchedProfile = data.profiles.find((p) => p.id === profileId);
          if (matchedProfile) setUserProfile(matchedProfile);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfiles(); // initial fetch

    const handleStorageChange = (e) => {
      if (e.key === "refreshProfiles" && e.newValue === "true") {
        console.log("♻️ It runs in home (storage event)");
        fetchProfiles(true);
        localStorage.removeItem("refreshProfiles"); // reset after use
      }
    };

    // ✅ Listen to localStorage changes (cross-page)
    window.addEventListener("storage", handleStorageChange);

    // ✅ Also handle direct page navigation case (when flag is already set)
    if (localStorage.getItem("refreshProfiles") === "true") {
      console.log("♻️ It runs in home (flag detected on mount)");
      fetchProfiles(true);
      localStorage.removeItem("refreshProfiles");
    }

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [profileId]);

  const [mode, setMode] = useState(null);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const selectMode = sessionStorage.getItem("mode");
    setMode(selectMode);

    const saved = localStorage.getItem("tournamentData");
    if (saved) {
      setSave(true);
    }
  }, []);

  function timeAgo(dateString) {
    const now = new Date();
    const last = new Date(dateString);
    const diff = now - last;
    const minutes = diff / (1000 * 60);
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${Math.floor(minutes)} min ago`;
    if (hours < 24) return `${Math.floor(hours)} hr ago`;
    return `${Math.floor(days)} days ago`;
  }

  return (
    <>
      <Box
        sx={{
          height: "90vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: 4,
          px: 2,
          boxSizing: "border-box",
          gap: "50px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "150px",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#343c53",
                width: "fit-content",
                padding: "5px 20px",
                display: "flex",
                alignContent: "center",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                transition: "all 0.3s",
                ":hover": {
                  cursor: "pointer",
                  transform: "scale(1.1)",
                },
                ":active": {
                  transform: "scale(1)",
                },
              }}
              onClick={() => navigate("/shop")}
            >
              <GiShoppingCart size={30} />
            </Box>

            <Box
              sx={{
                backgroundColor: "#343c53",
                width: "fit-content",
                padding: "5px 20px",
                display: "flex",
                alignContent: "center",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                transition: "all 0.3s",
                animation: scoreBoard ? "pulse 1.3s infinite" : "none",
                "@keyframes pulse": {
                  "0%": {
                    backgroundColor: "#343c53",
                    boxShadow: "inset 0px -8px 8px -4px #2a3043",
                    border: "2px solid #000000",
                  },
                  "50%": {
                    backgroundColor: "#f6c401",
                    boxShadow: "inset 0px -8px 8px -4px #b7560f",
                    border: "2px solid #f6c401",
                  },
                  "100%": {
                    backgroundColor: "#343c53",
                    boxShadow: "inset 0px -8px 8px -4px #2a3043",
                    border: "2px solid #000000",
                  },
                },
                ":hover": {
                  cursor: "pointer",
                  transform: "scale(1.1)",
                },
                ":active": {
                  transform: "scale(1)",
                },
              }}
              onClick={() => {
                setScoreBoard(false);
                navigate("/scoreboards");
              }}
            >
              <ScoreboardRounded sx={{ fontSize: "1.6em" }} />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                // fontfamily: "Rubik",
              }}
              variant="h5"
            >
              LeaderBoard
            </Typography>

            <Box
              sx={{
                maxHeight: "200px",
                overflowY: "scroll", // Change from "auto" to "scroll"
                overflowX: "hidden",
                padding: "0 15px",
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
                overscrollBehavior: "contain",
                position: "relative", // Add this
                isolation: "isolate",
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
              {profiles?.map((profile, index) => {
                return (
                  <Box
                    key={profile?.id}
                    onClick={() =>
                      navigate("/ProfileData", { state: { profile } })
                    }
                    sx={{
                      backgroundColor:
                        profile?.id == profileId ? "#ef7627" : "#897689",
                      width: "415px",
                      paddingLeft: "15px",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      boxShadow:
                        profile?.id == profileId
                          ? "inset 0px -8px 8px -4px #c16a2f"
                          : "inset 0px -8px 8px -4px #655b67",
                      transform: "skew(-5deg)",
                      transition: "all 0.3s",
                      "@media (hover: hover)": {
                        cursor: "pointer",
                        // transform: "scale(1.025)",
                        opacity: 0.9,
                      },
                      ":active": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        position: "relative",
                      }}
                    >
                      <Typography
                        sx={{
                          // fontfamily: "Rubik",
                          backgroundColor:
                            profile?.id == profileId
                              ? "rgb(255 168 0)"
                              : "#6e606d",
                          color:
                            profile?.id == profileId
                              ? "rgb(255 196 107)"
                              : "#aa9ca9",
                          padding: "4px 12px",
                          fontWeight: 600,
                        }}
                        variant="body1"
                      >
                        {index + 1}
                      </Typography>
                      <Box
                        component="img"
                        src={profile?.img}
                        alt={profile?.name}
                        sx={{
                          width: 45,
                          height: 45,
                          border: "2px solid #000",
                          borderRadius: "4px",
                          objectFit: "cover",
                          "&:hover": { cursor: "pointer" },
                        }}
                        // onClick={handleImageClick}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            // fontfamily: "Rubik",
                            color: "rgb(255 196 107)",
                          }}
                          variant="body1"
                        >
                          {profile?.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "rgb(255 196 107)",
                            fontSize: "0.7em",
                          }}
                          variant="body2"
                        >
                          {profile?.selected_title}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            display:
                              timeAgo(profile?.last_active) !== "just now" &&
                              profile?.id !== profileId
                                ? "block"
                                : "none",
                            color: "rgb(202 186 186)",
                            fontSize: "0.7em",
                          }}
                          variant="body2"
                        >
                          Last Online {timeAgo(profile?.last_active)}
                        </Typography>
                      </Box>
                      <span
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          backgroundColor:
                            timeAgo(profile?.last_active) == "just now"
                              ? "green"
                              : "#514e4e",
                          borderRadius: "50%",
                          position: "absolute",
                          top: 7,
                          left: 25,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        // fontfamily: "Rubik",
                        fontWeight: 600,
                        backgroundColor:
                          profile?.id == profileId ? "#dc5425" : "#665963",
                        padding: "15px 30px",
                        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
                        justifyContent: "center",
                        color: "rgb(255 196 107)",
                      }}
                      variant="body1"
                    >
                      <GiTrophy
                        size={25}
                        style={{
                          color: "rgb(255 196 107)",
                        }}
                      />
                      <Box
                        sx={{ minWidth: "30px", textAlign: "center" }}
                        component="span"
                      >
                        {Math.max(profile?.trophies, 0)}
                      </Box>
                    </Typography>
                  </Box>
                );
              })}

              {loading
                ? ["1", "2", "3", "4", "5"].map((index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#897689",
                          width: "415px",
                          paddingLeft: "15px",
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "space-between",
                          border: "2px solid #000000",
                          borderRadius: "4px",
                          boxShadow: "inset 0px -8px 8px -4px #655b67",
                          transform: "skew(-5deg)",
                          position: "relative",
                          overflow: "hidden",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                            background:
                              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                            animation: `${shimmer} 1.5s infinite`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Typography
                            sx={{
                              // fontfamily: "Rubik",
                              backgroundColor: "#6e606d",
                              color: "#aa9ca9",
                              padding: "4px 12px",
                              fontWeight: 600,
                              minWidth: "6px",
                              minHeight: "17px",
                            }}
                            variant="body1"
                          ></Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#6e606d",
                              fontWeight: 600,
                              // fontfamily: "Rubik",
                              textTransform: "uppercase",
                              color: "#f7bb1e",
                              minWidth: "200px",
                              minHeight: "25px",
                            }}
                            variant="body1"
                          ></Typography>
                        </Box>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            // fontfamily: "Rubik",
                            fontWeight: 600,
                            backgroundColor: "#665963",
                            padding: "10px 30px",
                            clipPath:
                              "polygon(5% 0, 100% 0, 100% 100%, 0% 100%)",
                            justifyContent: "center",
                            color: "#897689",
                          }}
                          variant="body1"
                        >
                          <GiTrophy
                            size={20}
                            style={{
                              color: "#897689",
                            }}
                          />
                          <Box
                            sx={{
                              minHeight: "25px",
                              minWidth: "50px",
                              backgroundColor: "#897689",
                            }}
                            component="span"
                          ></Box>
                        </Typography>
                      </Box>
                    );
                  })
                : null}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "20px",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#343c53",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "1.2em",
              transform: "skew(-10deg)",
              boxShadow: "inset 0px -8px 8px -4px #262e40",
              borderRadius: "4px",
              transition: "all 0.3s",
              border: "2px solid black",
              ":hover": {
                backgroundColor: "#454b5fff",
              },
            }}
            onClick={() => {
              navigate("/modes");
            }}
          >
            {/* <HighlightOff /> */}
            {mode || "Select"}
          </Button>

          <Button
            sx={{
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
              fontSize: "1.2em",
              transform: "skew(-10deg)",
              boxShadow: "inset 0px -8px 8px -4px #b7560f",
              borderRadius: "4px",
              transition: "all 0.3s",
              border: "2px solid black",
              ":hover": {
                cursor: loading ? "not-allowed" : "pointer",
                background: "#c59e04ff",
              },
            }}
            disabled={loading}
            onClick={() => {
              if (!profileId) {
                showDescToast("Create Profile first!");
                return;
              }
              if (!mode) {
                showDescToast("Select Game Mode first!");
                return;
              }
              if (!board) {
                showDescToast("Select Scoreboard first!");
                setScoreBoard(true);
                return;
              }

              if (save && mode == "TOURNAMENT") {
                navigate("/tournament");
              } else {
                navigate("/team");
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Play"
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
}
