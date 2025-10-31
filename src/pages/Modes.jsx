import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OversThreeIcon from "../components/overIcon";
import { EmojiEventsSharp, Help, Lock } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  GiExtraTime,
  GiPointySword,
  GiSkullCrossedBones,
  GiTicket,
  GiTrophy,
  GiTwoCoins,
} from "react-icons/gi";
import { keyframes } from "@emotion/react";

export default function Modes() {
  const navigate = useNavigate();

  const shimmer = keyframes`
    0% {
      background-position: -400px 0;
    }
    100% {
      background-position: 400px 0;
    }
  `;

  const trophyMap = {
    1: 1,
    3: 3,
    5: 5,
    10: 10,
    20: 15,
    100: 5,
  };

  const overs = [
    { value: 1, wkt: 1 },
    { value: 3, wkt: 3 },
    { value: 5, wkt: 5 },
    { value: 10, wkt: 10 },
    { value: 20, wkt: 10 },
  ].map((over) => ({
    ...over,
    desc: (
      <span>
        This mode allows <strong>{over.wkt}</strong> wicket(s) in{" "}
        <strong>{over.value}</strong> over(s), with{" "}
        <strong>{trophyMap[over.value]}</strong> trophies gained or{" "}
        <strong>{Math.ceil(trophyMap[over.value] / 2)}</strong> trophies lost
        per game.
      </span>
    ),
  }));

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverDesc, setPopoverDesc] = useState("");

  const [unlocked] = useState(
    () => !!Profile?.unlocked_items?.includes("worldcup")
  );

  const [unlockedKO] = useState(
    () => !!Profile?.unlocked_items?.includes("knockout")
  );

  const [saved] = useState(() => {
    const storedCup = localStorage.getItem("tournamentData");
    return storedCup ? true : false;
  });

  const [profiles, setProfiles] = useState([]);

  const handlePopoverOpen = (event, desc) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPopoverDesc(desc);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverDesc("");
  };

  const [timeLeft, setTimeLeft] = useState(null);

  function getTimeRemaining(endTime) {
    const total = endTime - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return { total, days, hours, minutes, seconds };
  }
  const start = new Date("2025-11-01T12:00:00Z");
  const end = new Date("2025-11-04T12:00:00Z");

  const remaining = getTimeRemaining(start);
  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      const remainingTime = getTimeRemaining(end);
      setTimeLeft(remainingTime);
      if (remainingTime.total <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const profileId = localStorage.getItem("MyId");
  useEffect(() => {
    let isMounted = true;

    const fetchProfiles = async (force = false) => {
      try {
        const cached = JSON.parse(
          sessionStorage.getItem("contestData") || "{}"
        );
        const now = Date.now();
        const myProfile = JSON.parse(sessionStorage.getItem("UserProfile"));

        if (
          !force &&
          cached.timestamp &&
          now - cached.timestamp < 2 * 60 * 1000
        ) {
          setProfiles(cached.data);

          // const matchedProfile = data.profiles.find((p) => p.id === profileId);
          // if (myProfile) setUserProfile(myProfile);

          return;
        }

        const res = await fetch("/.netlify/functions/manageContest");
        const data = await res.json();

        if (isMounted && data?.success && data.leaderboard) {
          setProfiles(data.leaderboard);
          sessionStorage.setItem(
            "contestData",
            JSON.stringify({ data: data.leaderboard, timestamp: now })
          );

          // const matchedProfile = data.profiles.find((p) => p.id === profileId);
          // if (myProfile) setUserProfile(myProfile);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles(); // initial fetch

    const handleStorageChange = (e) => {
      if (e.key === "refreshContest" && e.newValue === "true") {
        console.log("♻️ It runs in home (storage event)");
        fetchProfiles(true);
        localStorage.removeItem("refreshContest"); // reset after use
      }
    };

    // ✅ Listen to localStorage changes (cross-page)
    window.addEventListener("storage", handleStorageChange);

    // ✅ Also handle direct page navigation case (when flag is already set)
    if (localStorage.getItem("refreshContest") === "true") {
      console.log("♻️ It runs in home (flag detected on mount)");
      fetchProfiles(true);
      localStorage.removeItem("refreshContest");
    }

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [profileId]);

  useEffect(() => {
    const checkTickets = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const lastGiven = localStorage.getItem("lastTicketDate");

      // 🎟️ Only give tickets after 12 PM and not already given
      if (now.getUTCHours() >= 7 && lastGiven !== today && now < end) {
        localStorage.setItem("lastTicketDate", today);
        console.log("🎟️ 3 tickets granted for today!");
        manageTickets();
      }
    };

    // Run immediately and then every minute
    checkTickets();
    const interval = setInterval(checkTickets, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const manageTickets = async () => {
    if (!Profile) return;

    const updatedProfile = {
      ...Profile,
      id: Profile?.id,
      tickets: 3,
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
        console.log(data.profile, "/mode");
        sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));
        window.dispatchEvent(new Event("profileUpdated"));
        localStorage.setItem("refreshContest", "true");
      } else {
        console.error("Failed to update trophies in database");
      }
    } catch (err) {
      console.error("Error updating trophies:", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxHeight: "100vh",
          display: "flex",
          alignItems: "stretch",
          gap: 8,
          overflowX: "scroll",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          "& > *": { scrollSnapAlign: "center" },
          p: { xs: 3, md: 6 },
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Button
            sx={{
              height: "100%",
              minHeight: { xs: "280px", md: "500px" },
              flexShrink: 0,
              width: Date.now() < start ? 280 : 200,
              background: !unlocked
                ? "linear-gradient(to top, #f5214b, #8e0e2f)"
                : "#f55c73",
              color: !unlocked ? "#FFFFFF" : "#a0a0a0",
              textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              2px  1.5px 0 #000
            `,
              padding: "10px 40px",
              fontSize: "1.1em",
              transform: "skew(-5deg)",
              boxShadow: `
              inset 0px -8px 8px -4px #262e40,   
              inset 0px 8px 8px -4px rgb(193 193 193)       
            `,
              borderRadius: "4px",
              transition: "all 0.3s",
              overflow: "hidden",
              position: "relative",
              border: "2px solid black",
              ":hover": {
                cursor: unlocked ? "pointer" : "not-allowed",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* {!unlocked && (
              <Lock
                sx={{
                  position: "absolute",
                  top: "30%",
                  left: "35%",
                  fontSize: 75,
                  color: "#000",
                }}
              />
            )} */}
              <Typography
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                variant="h5"
              >
                <EmojiEventsSharp />
                Contest
                <IconButton
                  type="button"
                  onClick={(e) =>
                    handlePopoverOpen(
                      e,
                      <span>
                        In Tournament mode, each match is <strong>10</strong>{" "}
                        overs with <strong>10</strong> wickets.Every Day{" "}
                        <strong>3 Tickets</strong> are given and{" "}
                        <strong>Top 3 </strong> players are rewarded.
                      </span>
                    )
                  }
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 32,
                    height: 32,
                    backgroundColor: "#fa208e",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#ff4eb0" },
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
                </IconButton>
              </Typography>
              <Typography
                sx={{
                  minWidth: "165px",
                  fontWeight: 600,
                  color: "#dcdcdcff",
                }}
                variant={saved ? "h3" : "body1"}
              >
                10 Overs
              </Typography>
              <Button
                onClick={() => {
                  if (Date.now() > start && timeLeft.total >= 0) {
                    navigate("/");
                    localStorage.setItem("Overs", 10);
                    sessionStorage.setItem("mode", `CONTEST`);
                  } else {
                    localStorage.removeItem("Overs");
                    sessionStorage.removeItem("mode");
                  }
                }}
                sx={{
                  backgroundColor: "#f6c401",
                  color: "#FFFFFF",
                  textShadow: `
                  -1px -1px 0 #000,  
                   1px -1px 0 #000,
                  -1px  1px 0 #000,
                   2px  1.5px 0 #000
                `,
                  fontSize:
                    Date.now() < start && Date.now() > end ? "1em" : "0.9em",
                  padding: "0px 30px",
                  transform: "skew(-5deg)",
                  mt: "50px",
                  boxShadow: "inset 0px -8px 8px -4px #b7560f",
                  borderRadius: "4px",
                  transition: "all 0.3s",
                  border: "2px solid black",
                  ":hover": {
                    background: "#c59e04ff",
                  },
                }}
              >
                {Date.now() < start
                  ? `Event starts in :
                  ${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`
                  : Date.now() > end
                  ? "Event ended"
                  : `Play`}
              </Button>
            </Box>
          </Button>

          <Box
            sx={{
              display: Date.now() < start ? "none" : "block",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "0 20px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: "#ffffff",
                  fontWeight: 600,
                  minWidth: "120px",
                }}
                variant="h3"
              >
                {(() => {
                  const now = Date.now();
                  const totalDays = 3;
                  const dayMs = 24 * 60 * 60 * 1000;
                  const elapsed = now - start;

                  if (elapsed < 0) return `Starts soon`;
                  const currentDay = Math.min(
                    Math.floor(elapsed / dayMs) + 1,
                    totalDays
                  );

                  return `Day ${currentDay}/${totalDays}`;
                })()}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#dfe451",
                  }}
                  variant="body1"
                >
                  Score High
                </Typography>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#f6821b",
                    minWidth: "120px",
                  }}
                  variant="h6"
                >
                  Win Rewards
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                mt: "20px",
                overflowY: "auto",
                padding: "0 10px",
                alignItems: "center",
                // maxHeight : "200px"
              }}
            >
              {profiles?.map((prof, index) => {
                return (
                  <Box
                    sx={{
                      backgroundColor:
                        prof?.id == profileId ? "#eae8fc" : "#00001d",
                      minWidth: "415px",
                      paddingLeft: "15px",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      boxShadow:
                        prof?.id == profileId
                          ? "inset 0px -8px 8px -4px #eae8fc"
                          : "inset 0px -8px 8px -4px #00001d",
                      transition: "all 0.3s",
                      transform: "skew(-5deg)",
                      "@media (hover: hover)": {
                        cursor: "pointer",
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
                          backgroundColor: index < 3 ? "#3aecfa" : null,
                          color: prof?.id == profileId ? "#00001d" : "#FFFFFF",
                          padding: "4px 12px",
                          fontWeight: 600,
                        }}
                        variant="body1"
                      >
                        {index + 1}
                      </Typography>
                      <Box
                        component="img"
                        src={prof?.img}
                        alt={prof?.name}
                        sx={{
                          width: 45,
                          height: 45,
                          border:
                            prof?.id == profileId
                              ? "2px solid #000"
                              : "2px solid #fff",
                          borderRadius: "4px",
                          objectFit: "cover",
                          "&:hover": { cursor: "pointer" },
                        }}
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
                            color:
                              prof?.id == profileId
                                ? "#00001d"
                                : "rgb(255 196 107)",
                            width: "90px",
                          }}
                          variant="body1"
                        >
                          {prof?.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                        padding: "15px",
                        justifyContent: "center",
                        color: prof?.id == profileId ? "#d72c09ff" : "#FFFFFF",
                      }}
                      variant="body1"
                    >
                      <GiTicket
                        size={25}
                        style={{
                          color:
                            prof?.id == profileId ? "#d72c09ff" : "#FFFFFF",
                        }}
                      />
                      <Box
                        sx={{ minWidth: "30px", textAlign: "center" }}
                        component="span"
                      >
                        {Profile?.tickets}/3
                      </Box>
                    </Typography>

                    <Typography
                      sx={{
                        display: index > 2 ? "none" : "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                        padding: "15px 15px 15px 0",
                        justifyContent: "center",
                        color:
                          prof?.id == profileId
                            ? "#f47909"
                            : "rgb(255 196 107)",
                      }}
                      variant="body1"
                    >
                      <GiTwoCoins
                        size={25}
                        style={{
                          color:
                            prof?.id == profileId
                              ? "#f47909"
                              : "rgb(255 196 107)",
                        }}
                      />
                      <Box
                        sx={{ minWidth: "30px", textAlign: "center" }}
                        component="span"
                      >
                        {index == 0
                          ? 1000
                          : index == 1
                          ? 500
                          : index == 2
                          ? 300
                          : null}
                      </Box>
                    </Typography>

                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                        backgroundColor: "#61616135",
                        padding: "15px",
                        justifyContent: "center",
                        color: prof?.id == profileId ? "#00001d" : "#dfe451",
                      }}
                      variant="body1"
                    >
                      <GiPointySword
                        size={25}
                        style={{
                          color: prof?.id == profileId ? "#00001d" : "#dfe451",
                        }}
                      />
                      <Box
                        sx={{ minWidth: "30px", textAlign: "center" }}
                        component="span"
                      >
                        {Profile?.points}
                      </Box>
                    </Typography>
                  </Box>
                );
              })}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    textTransform: "uppercase",
                  }}
                  variant="h6"
                >
                  {timeLeft?.days <= 1 ? `Contest Ends:` : `New Tickets In:`}
                </Typography>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "1em !important",
                  }}
                  variant="h6"
                >
                  <GiExtraTime style={{ color: "#dfe451" }} size={30} />
                  {timeLeft
                    ? timeLeft.total <= 0
                      ? "Contest Ended"
                      : `${timeLeft.hours}h ${timeLeft.minutes}m`
                    : "Loading..."}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* World Cup */}
        <Button
          sx={{
            flexShrink: 0,
            minWidth: 150,
            backgroundColor: unlocked ? "#f5214b" : "#f55c73",
            color: unlocked ? "#FFFFFF" : "#a0a0a0",
            textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              2px  1.5px 0 #000
            `,
            padding: "10px 20px",
            fontSize: "1.1em",
            transform: "skew(-5deg)",
            boxShadow: `
              inset 0px -8px 8px -4px #262e40,   
              inset 0px 8px 8px -4px rgb(193 193 193)       
            `,
            borderRadius: "4px",
            transition: "all 0.3s",
            overflow: "hidden",
            position: "relative",
            border: "2px solid black",
            ":hover": {
              cursor: unlocked ? "pointer" : "not-allowed",
            },
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={(e) => {
            if (unlocked) {
              navigate("/");
              localStorage.setItem("Overs", 10);
              sessionStorage.setItem("mode", `TOURNAMENT`);
            } else {
              handlePopoverOpen(e, <strong>Buy this item from shop</strong>);
            }
          }}
        >
          <Box>
            {!unlocked && (
              <Lock
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "30%",
                  fontSize: 75,
                  color: "#000",
                }}
              />
            )}
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              variant="h5"
            >
              <EmojiEventsSharp />
              World Cup
              <IconButton
                type="button"
                onClick={(e) =>
                  handlePopoverOpen(
                    e,
                    <span>
                      In Tournament mode, each match is <strong>10</strong>{" "}
                      overs with <strong>10</strong> wickets.All{" "}
                      <strong>teams</strong> face each other, and the{" "}
                      <strong>strongest team</strong> wins the tournament.
                      <br />
                      <strong>REQUIRED:</strong> Teams higher than{" "}
                      <strong>BRONZE</strong> and not{" "}
                      <strong>NETHERLANDS</strong>
                      <br />
                      <strong>REWARD:</strong> <strong>5000</strong> Coins
                    </span>
                  )
                }
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  backgroundColor: "#fa208e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#ff4eb0" },
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </IconButton>
            </Typography>
            <Typography
              sx={{
                minWidth: "165px",
                fontWeight: 600,
                mt: 1,
              }}
              variant={saved ? "h3" : "body1"}
            >
              {saved ? "Continue" : "10 Teams , 1 Winner"}
            </Typography>
          </Box>
        </Button>

        {/* Overs Modes */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(3,1fr)" },
            gap: "15px",
            flexShrink: 0,
            minWidth: "fit-content",
          }}
        >
          {overs.map((over, index) => (
            <Button
              key={index}
              sx={{
                background: "linear-gradient(#60da01 , #90e100)",
                color: "#FFFFFF",
                textShadow: `
                  -1px -1px 0 #000,  
                  1px -1px 0 #000,
                  -1px  1px 0 #000,
                  2px  1.5px 0 #000
                `,
                overflow: "hidden",
                maxWidth: "200px",
                maxHeight: "60px",
                fontSize: "1.1em",
                boxShadow: `
                  inset 0px -8px 8px -4px #262e40,   
                  inset 0px 8px 8px -4px rgb(193 193 193)       
                `,
                borderRadius: "4px",
                transition: "all 0.3s",
                border: "2px solid black",
                transform: "skew(-5deg)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
              onClick={() => {
                navigate("/");
                localStorage.setItem("Overs", over.value);
                sessionStorage.setItem("mode", `${over.value} OVERS`);
              }}
            >
              <OversThreeIcon value={over.value} />
              Overs
              <IconButton
                type="button"
                onClick={(e) => handlePopoverOpen(e, overs[index].desc)}
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  backgroundColor: "#fa208e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#ff4eb0" },
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </IconButton>
            </Button>
          ))}
          <Button
            sx={{
              flexShrink: 0,
              backgroundColor: "#8237ca",
              color: "#FFFFFF",
              textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              2px  1.5px 0 #000
            `,
              padding: "0px 20px",
              fontSize: "1.1em",
              width: "200px",
              maxHeight: "60px",
              transform: "skew(-5deg)",
              overflow: "hidden",
              boxShadow: `
              inset 0px -8px 8px -4px #262e40,   
              inset 0px 8px 8px -4px rgb(193 193 193)       
            `,
              borderRadius: "4px",
              transition: "all 0.3s",
              border: "2px solid black",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={() => {
              navigate("/");
              localStorage.setItem("Overs", 100);
              sessionStorage.setItem("mode", `SURVIVAL`);
            }}
          >
            <GiSkullCrossedBones size={30} color="white" />
            Survival
            <IconButton
              type="button"
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  <span>
                    This mode allows only<strong>1</strong> wicket in{" "}
                    <strong>unlimited</strong> overs, with <strong>5</strong>{" "}
                    trophies gained or lost per game.
                  </span>
                )
              }
              sx={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 32,
                height: 32,
                backgroundColor: "#fa208e",
                color: "#fff",
                "&:hover": { backgroundColor: "#ff4eb0" },
                boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
              }}
            >
              <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
            </IconButton>
          </Button>
        </Box>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1, fontSize: "0.85em", width: "200px" }}>
            {popoverDesc}
          </Typography>
        </Popover>

        {/* Survival Mode */}

        {/* Knockout Mode */}
        <Button
          sx={{
            flexShrink: 0,
            minWidth: 150,
            backgroundColor: unlockedKO ? "#f47909" : "#d69153",
            color: unlockedKO ? "#FFFFFF" : "#a0a0a0",
            textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              2px  1.5px 0 #000
            `,
            padding: "10px 20px",
            fontSize: "1.1em",
            transform: "skew(-5deg)",
            boxShadow: `
              inset 0px -8px 8px -4px #262e40,   
              inset 0px 8px 8px -4px rgb(193 193 193)       
            `,
            borderRadius: "4px",
            position: "relative",
            transition: "all 0.3s",
            border: "2px solid black",
            ":hover": {
              cursor: unlockedKO ? "pointer" : "not-allowed",
            },
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={(e) => {
            if (unlockedKO) {
              navigate("/");
              localStorage.setItem("Overs", 10);
              sessionStorage.setItem("mode", `KNOCKOUT`);
            } else {
              handlePopoverOpen(e, <strong>Buy this item from shop</strong>);
            }
          }}
        >
          <Box>
            {!unlockedKO && (
              <Lock
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "30%",
                  fontSize: 75,
                  color: "#000",
                }}
              />
            )}
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              variant="h5"
            >
              <EmojiEventsSharp />
              Knockout
              <IconButton
                type="button"
                onClick={(e) =>
                  handlePopoverOpen(
                    e,
                    <span>
                      In Knockout mode, each match is <strong>10</strong> overs
                      with <strong>10</strong> wickets. All <strong>8</strong>{" "}
                      teams face each other, and the{" "}
                      <strong>undefeated team</strong> wins the tournament.
                      <br />
                      <strong>REQUIRED:</strong> Teams higher than{" "}
                      <strong>BRONZE</strong>
                      <br />
                      <strong>REWARD:</strong> <strong>1500</strong> Coins
                    </span>
                  )
                }
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  backgroundColor: "#fa208e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#ff4eb0" },
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </IconButton>
            </Typography>
            <Typography sx={{ fontWeight: 600 }} variant="body1">
              8 Teams
            </Typography>
          </Box>
        </Button>
      </Box>
    </>
  );
}
