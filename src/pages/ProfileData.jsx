import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  StarTwoTone,
  WhatshotTwoTone,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import LoadingPage from "../components/loading";
import Data from "../components/data";
import { GiAchievement, GiStarMedal, GiTrophy } from "react-icons/gi";
import avatar from "/img/dummy.png"

export default function ProfileData() {
  const { state } = useLocation();
  const profile = state?.profile;
  console.log(profile);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [teams, setTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTitle, setActiveTitle] = useState();
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  // Generate ID if not exists
  let profileId = localStorage.getItem("MyId");
  if (!profileId) {
    profileId = nanoid();
    localStorage.setItem("MyId", profileId);
  }

  const getCardBackground = (rarity) => {
    switch (rarity) {
      case "Bronze":
        return "linear-gradient(135deg, #8d5524, #d2691e)";
      case "Silver":
        return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      case "Gold":
        return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Legendary":
        return "linear-gradient(135deg, #7b4397, #dc2430)";
      default:
        return "linear-gradient(135deg, #333, #111)";
    }
  };

  const teamsData = Data.filter((team) =>
    profile?.unlocked_teams?.includes(team.name)
  );

  return (
    <>
      {!showLoadingPage && (
        <LoadingPage
          loading={loading}
          onFinish={() => setShowLoadingPage(false)}
        />
      )}

      {showLoadingPage && (
        <Box sx={{ width: "fit-content", margin: "auto" }}>
          {/* Back Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "300px",
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
                transform: "skew(-10deg)",
                m: "50px 0",
                color: "#ffffff",
                ":hover": { cursor: "pointer" },
              }}
              onClick={() => navigate("/")}
            >
              <ArrowBackIosNew sx={{ color: "#FFFFFF" }} />
            </Box>

            <Box
              sx={{
                backgroundColor: "#073575",
                width: "200px",
                padding: "5px 20px",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                transform: "skew(-5deg)",
                color: "#ffffff",
                ":hover": { cursor: "pointer" },
              }}
              onClick={() =>
                profile?.unlocked_teams?.length > 0
                  ? setTeams(!teams)
                  : toast.error("No teams unlocked yet!")
              }
            >
              <Typography sx={{ textAlign: "center" }} variant="h6">
                Teams {profile?.unlocked_teams?.length || 0}/20
              </Typography>
            </Box>
          </Box>

          {/* Profile Image & Name */}
          <Box>
            {!teams ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "50px",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={profile?.img || avatar}
                    alt="profile"
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid #000",
                      borderRadius: 2,
                      objectFit: "cover",
                      "&:hover": { cursor: "pointer" },
                    }}
                  />
                  <TextField
                    value={profile?.name || "dummy"}
                    readOnly
                    sx={{
                      padding: "10px 60px",
                      backgroundColor: "#313c64",
                      color: "#fff",
                      textAlign: "center",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "Rubik , Poppins , sans-serif",
                      transform: "skew(-10deg)",
                      "& .MuiOutlinedInput-input": {
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#fff",
                        fontSize: "1.2em",
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      left: "110%",
                      top: 0,
                      backgroundColor: "#073575",
                      width: "200px",
                      padding: "5px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      boxShadow: "inset 0px -8px 8px -4px #2a3043",
                      transform: "skew(-5deg)",
                      color: "#ffffff",
                      ":hover": { cursor: "pointer" },
                    }}
                    onClick={() => setShow(!show)}
                  >
                    <Typography sx={{ textAlign: "center" }} variant="h6">
                      {profile?.selected_title || "Titles"}
                    </Typography>

                    {show &&
                      profile?.titles?.map((title, index) => (
                        <Box
                          key={index}
                          sx={{
                            textAlign: "center",
                            backgroundColor: "#343c53",
                            width: "90%",
                            padding: "5px 20px",
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            gap: "10px",
                            border: "2px solid #000000",
                            borderRadius: "4px",
                            boxShadow: "inset 0px -8px 8px -4px #2a3043",
                            transform: "skew(-5deg)",
                            m: "50px 0",
                            color: "#ffffff",
                            ":hover": { cursor: "pointer" },
                          }}
                          onClick={(e) => {
                            setShow(false);
                            if (title.value >= 10) {
                              setActiveTitle(title.name);
                            } else {
                              toast.error(
                                "Win tournaments 10 times to unlock title"
                              );
                            }
                            // updateTitle(title);
                            e.stopPropagation();
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                title.value >= 10 ? "none" : "inline-block",
                            }}
                            component="span"
                          >
                            {title.value}/10
                          </Box>
                          {title.name}
                        </Box>
                      ))}
                  </Box>
                </Box>

                <Grid container sx={{ margin: "20px 0" }}>
                  {[
                       {
                         label: "Trophies",
                         icon: <GiTrophy size={25}/>,
                         value: profile.trophies,
                       },
                       {
                         label: "Victories",
                         icon: <GiStarMedal size={25} />,
                         value: profile.victories,
                       },
                       {
                         label: "World Cup",
                         icon: <GiAchievement size={25}/>,
                         value: profile.tournaments,
                       },
                    // {
                    //   label: "KnockOut",
                    //   icon: <WhatshotTwoTone />,
                    //   value: profile?.knockout || 0,
                    // },
                  ].map((stat) => (
                    <Box
                      key={stat.label}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        m: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          WebkitTextStroke: "1px black",
                          fontSize: "1.4em",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          fontFamily: "Rubik , Poppins , sans-serif",
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Rubik , Poppins , sans-serif",
                          padding: "10px 70px",
                          backgroundColor: "#073575",
                          textAlign: "center",
                          borderRadius: 2,
                          fontWeight: 600,
                          color: "#fff",
                          display: "flex",
                          gap: 1,
                          transform: "skew(-5deg)",
                          alignItems : "center"
                        }}
                      >
                        {stat.icon} {stat.value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </>
            ) : (
              <Grid container spacing={2} justifyContent="center">
                {teamsData?.map((team, index) => (
                  <Grid
                    item
                    key={index}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                        transform: "scale(1.1)",
                        ":active": { transform: "scale(0.9)" },
                        transition: "all 0.3s",
                      },
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        background: getCardBackground(team?.category),
                        borderRadius: "6px",
                        height: "fit-content",
                      }}
                    >
                      <Typography variant="body1">{team?.category}</Typography>
                      <img
                        src={team?.flag}
                        alt={team?.name}
                        title={team?.name}
                        style={{
                          height: "auto",
                          borderRadius: "6px",
                          boxShadow: "3px 3px 8px -2px #000000",
                          width: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
