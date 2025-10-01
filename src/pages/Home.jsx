import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  HighlightOff,
  Person,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [userProfile, setUserProfile] = useState();

  
  useEffect(() => {
    const keysToClear = ["q1", "q2", "q3", "q4", "s1", "s2", "f", "Teams"];
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
  
  const profileId = localStorage.getItem("MyId");
  useEffect(() => {
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
      .catch((err) => console.error("Error fetching profiles:", err));
  }, []);

  const mode = sessionStorage.getItem("mode");
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
                      // color: profile?.id == profileId ? "#000000" : "#ffffff",
                      transition: "all 0.3s",
                      ":hover": {
                        cursor: "pointer",
                        transform: "scale(1.1)",
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
                        }}
                        variant="body1"
                      >
                        {index + 1}
                      </Typography>
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
                        padding: "10px 20px",
                        clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0% 100%)",
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
                      {profile?.trophies}
                    </Typography>
                  </Box>
                );
              })}
              {/* <Box
                // key={index}
                sx={{
                  backgroundColor:
                    profiles?.id == profileId ? "#ef7627" : "#ef7627",
                  minWidth: "350px",
                  paddingLeft: "10px",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                  border: "2px solid #000000",
                  borderRadius: "4px",
                  boxShadow:
                    profiles?.id == profileId
                      ? "inset 0px -8px 8px -4px #b7560f"
                      : "inset 0px -8px 8px -4px #b7560f",
                  // clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                  color: profiles?.id == profileId ? "#000000" : "#000000",
                  transition: "all 0.3s",
                  ":hover": {
                    cursor: "pointer",
                    transform: "scale(1.1)",
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
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Rubik",
                      backgroundColor: "#6e606d",
                      color: "#aa9ca9",
                      padding: "4px 12px",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    1
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Rubik",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    profiles?.name
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    backgroundColor: "#665963",
                    padding: "10px 20px",
                    clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0% 100%)",
                  }}
                  variant="body1"
                >
                  <EmojiEventsTwoTone
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "none",
                      },
                      "& path:first-of-type": {
                        fill: profiles?.id == profileId ? "#FFFFFF" : "#FFFFFF",
                      },
                      "& path:last-of-type": {
                        fill: profiles?.id == profileId ? "#000000" : "#000000",
                      },
                    }}
                  />
                  34030
                </Typography>
              </Box> */}
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
              {mode || "SELECT"}
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
                navigate("/team");
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
