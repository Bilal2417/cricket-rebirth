import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  HighlightOff,
  Person,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { keyframes } from "@emotion/react"

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
      "Boundary",
    ];
    keysToClear.forEach((key) => sessionStorage.removeItem(key));

    const keysToClearLocally = [
      "Ai",
      "User",
      "CurrentBowler",
      "FirstInnings",
      "Innings",
      "currentInnings",
      "winner",
    ];
    keysToClearLocally.forEach((key) => localStorage.removeItem(key));
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

  // const [name, setName] = useState("");

  // Fetch profile on page load
  // useEffect(() => {
  //   fetch("/.netlify/functions/saveProfile")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         console.log(data.profile.name)
  //         setName(data.profile.name);
  //       }
  //     })
  //     .catch((err) => console.error("Error fetching profile:", err));
  // }, []);

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

  // useEffect(() => {
  //   fetch("/.netlify/functions/getProfile")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data?.success && data.profiles) {
  //         setProfiles(data.profiles);

  //         const matchedProfile = data.profiles.find(
  //           (profile) => profile.id === profileId
  //         );

  //         if (matchedProfile) {
  //           setUserProfile(matchedProfile);
  //           sessionStorage.setItem("Profile", JSON.stringify(matchedProfile));
  //         }
  //       }
  //     })
  //     .catch((err) => console.error("Error fetching profiles:", err))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    const fetchProfiles = () => {
      fetch("/.netlify/functions/getProfile")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data.profiles) {
            setProfiles(data.profiles);

            const matchedProfile = data.profiles.find(
              (profile) => profile.id === profileId
            );

            if (matchedProfile) {
              setUserProfile(matchedProfile);
              sessionStorage.setItem("Profile", JSON.stringify(matchedProfile));
            }
          }
        })
        .catch((err) => console.error("Error fetching profiles:", err))
        .finally(() => setLoading(false));
    };

    fetchProfiles();

    const interval = setInterval(fetchProfiles, 10000);

    return () => clearInterval(interval);
  }, [profileId]);

  // useEffect(() => {
  //   const fetchProfiles = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch("/.netlify/functions/getProfile");
  //       const data = await res.json();

  //       if (data?.success && data.profiles) {
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
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfiles();
  //   const interval = setInterval(fetchProfiles, 10000);
  //   return () => clearInterval(interval);
  // }, [profileId]);

  const [mode, setMode] = useState(null);

  useEffect(() => {
    const selectMode = sessionStorage.getItem("mode");
    setMode(selectMode);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "50vh",
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
            clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
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
          onClick={() => navigate("/profile")}
        >
          <Person sx={{ color: "#FFFFFF" }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
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
                fontFamily: "Rubik",
              }}
              variant="h5"
            >
              LeaderBoard
            </Typography>

            <Box
              sx={{
                maxHeight: "500px",
              }}
            >
              {profiles?.map((profile, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor:
                        profile?.id == profileId ? "#ef7627" : "#897689",
                      width: "400px",
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
                      clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                      transition: "all 0.3s",
                      ":hover": {
                        cursor: "pointer",
                        transform: "scale(1.025)",
                      },
                      ":active": {
                        transform: "scale(1)",
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
                          fontFamily: "Rubik",
                          backgroundColor:
                            profile?.id == profileId ? "#ffa800" : "#6e606d",
                          color:
                            profile?.id == profileId ? "#ffc73e" : "#aa9ca9",
                          padding: "4px 12px",
                          fontWeight: 600,
                          width: "11px",
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
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontFamily: "Rubik",
                          textTransform: "uppercase",
                          color: "#f7bb1e",
                        }}
                        variant="body1"
                      >
                        {profile?.name}
                      </Typography>
                      <span
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          backgroundColor: profile?.is_active
                            ? "green"
                            : "#514e4e",
                          borderRadius: "50%",
                          position: "absolute",
                          top: 12,
                          left: 30,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontFamily: "Rubik",
                        fontWeight: 600,
                        backgroundColor:
                          profile?.id == profileId ? "#dc5425" : "#665963",
                        padding: "20px 30px",
                        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
                        width: "60px",
                        justifyContent: "center",
                        color: "#f7bb1e",
                      }}
                      variant="body1"
                    >
                      <EmojiEventsTwoTone
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fill: "none",
                          },
                          "& path:first-of-type": {
                            fill:
                              profile?.id == profileId ? "#FFFFFF" : "#FFD700",
                          },
                          "& path:last-of-type": {
                            fill:
                              profile?.id == profileId ? "#000000" : "#DAA520",
                          },
                        }}
                      />
                      <Box
                        sx={{ minWidth: "30px", textAlign: "center" }}
                        component="span"
                      >
                        {profile?.trophies < 0 ? 0 : profile?.trophies}
                      </Box>
                    </Typography>
                  </Box>
                );
              })}

              {loading
                ? ["1", "2", "3"].map((index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#897689",
                          width: "400px",
                          paddingLeft: "15px",
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "space-between",
                          border: "2px solid #000000",
                          borderRadius: "4px",
                          boxShadow: "inset 0px -8px 8px -4px #655b67",
                          clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
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
                              fontFamily: "Rubik",
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
                              fontFamily: "Rubik",
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
                            fontFamily: "Rubik",
                            fontWeight: 600,
                            backgroundColor: "#665963",
                            padding: "10px 30px",
                            clipPath:
                              "polygon(5% 0, 100% 0, 100% 100%, 0% 100%)",
                            width: "60px",
                            justifyContent: "center",
                            color: "#897689",
                          }}
                          variant="body1"
                        >
                          <EmojiEventsTwoTone />
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
          <Box>
            <Button
              sx={{
                fontFamily: "Rubik",
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
              onClick={() => {
                navigate("/modes");
              }}
            >
              {/* <HighlightOff /> */}
              {mode || "Select"}
            </Button>

            <Button
              sx={{
                fontFamily: "Rubik",
                backgroundColor: "#f6c401",
                color: "#FFFFFF",
                textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                padding: "10px 40px",
                fontSize: "1.4em",
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
                if (!profileId) {
                  showDescToast("Create Profile first!");
                } else if (!mode) {
                  showDescToast("Select Game Mode first!");
                } else if (
                  userProfile?.trophies <
                    (overs == 100 ? 5 : Math.ceil(overs / 2)) &&
                  mode !== "KNOCKOUT"
                ) {
                  showDescToast("Not enough trophies to play this mode!");
                } else {
                  navigate("/team");
                }
              }}
            >
              Play
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
