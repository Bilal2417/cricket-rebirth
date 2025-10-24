import { Box, Fade, Typography } from "@mui/material";
import { use } from "react";
import {
  GiArcheryTarget,
  GiConvergenceTarget,
  GiTargetPoster,
} from "react-icons/gi";

export default function SA({
  batting,
  aiTeam,
  userTeam,
  striker,
  nonStriker,
  // getInitials,
  totalOvers,
  over,
  balls,
  show = 0,
  partnership,
  partnershipBalls,
  firstInnings,
  target,
  isSix,
  randomBowler,
}) {
  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const teams = ["Australia", "UAE", "Sri Lanka", "India"];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          transform: { xs: "scale(0.6)", md: "scale(0.85)", lg: "scale(1.0)" },
        }}
      >
        {/* first */}

        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            paddingLeft: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 30px",
              background: `linear-gradient(to bottom , ${
                !batting ? aiTeam?.secondary || "#03a65a" : userTeam?.secondary
              } , ${!batting ? aiTeam?.primary || "#01411c": userTeam?.primary})`,
              transform: "skew(10deg)",
              position: "relative",
              zIndex: 100,
              height: "100%",
              marginRight: "-48px",
                borderRight: "3px solid #d9d5d8",
            }}
          >
            <img
              style={{
                width: "60px",
                height: "40px",
                boxShadow: "3px 3px 8px -2px #000000",
                transform: "skew(-10deg)",
              }}
              src={!batting ? aiTeam?.flag : userTeam?.flag}
              alt={!batting ? aiTeam?.name : userTeam?.name}
            />
          </Box>

          <Box
            sx={{
              transform: "skew(-15deg)",
                borderRight: "3px solid #d9d5d8",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "2px solid #d9d5d8",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  flex: 1,
                  padding: "0 20px 0 60px",
                  //   py: 0.5,
                  background: "linear-gradient(to bottom , #308bcb , #1a528c )",
                  transformOrigin: "bottom right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ transform: "skewX(10deg)" }}>
                  {batting
                    ? getInitials(userTeam?.name) || "Dum"
                    : getInitials(aiTeam?.name) || "Dum"}
                </Box>
              </Typography>

              <Typography
                sx={{
                  background: "linear-gradient(to bottom , #e81f21 , #83110f )",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textAlign: "center",
                  minWidth: { xs: "100px", lg: "120px" },
                }}
                variant="h6"
              >
                {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
                {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
              </Typography>
              <Typography
                sx={{
                  background: "linear-gradient(to bottom , #308bcb , #1a528c )",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  padding: "6px 5px",
                  borderLeft: "3px solid #FFFFFF",
                  width : "100px",
                  textAlign : "center"
                }}
                variant="body2"
              >
                {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
                {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0} 
                ({totalOvers == 100 ? "∞" : totalOvers || 3})
              </Typography>
            </Box>

            <Box
              sx={{
                background: "linear-gradient(to bottom , #f9fbfa , #929f97 )",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "32px",
                minWidth: { xs: "150px", lg: "280px" },
                paddingLeft: "48px",
              }}
            >
              <Fade in={show == 0} timeout={500}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    alignItems: "center",
                    width: "100%",
                    gap: "3px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    run rate{" "}
                    {over === 0 && balls === 0
                      ? "0.00"
                      : (
                          (batting ? userTeam?.score : aiTeam?.score) /
                            (over + balls / 6) || 0
                        ).toFixed(2)}
                  </Typography>
                </Box>
              </Fade>

              <Fade in={show == 1} timeout={500}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    alignItems: "center",
                    width: "100%",
                    gap: "3px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    partnership {partnership}({partnershipBalls})
                  </Typography>
                </Box>
              </Fade>

              <Fade in={show == 2} timeout={500}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    alignItems: "center",
                    width: "100%",
                    gap: "3px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    {firstInnings == 2 ? `Target` : `Projected Score`}{" "}
                    {firstInnings == 2
                      ? target
                      : (
                          ((batting ? userTeam?.score : aiTeam?.score) /
                            (over + balls / 6)) *
                            totalOvers || 0
                        ).toFixed(0)}
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "skew(-15deg)",
              overflow: "hidden",
              
                borderRight: "3px solid #d9d5d8",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "50px",
                boxShadow: "3px 4px 10px -2px #ffffff",
                minWidth: "225px",
                borderBottom: "2px solid #d9d5d8",
                paddingLeft: "20px",
                background: "linear-gradient(to bottom , #308bcb , #1a528c )",
              }}
            >
              <Box
                sx={{
                  textTransform: "uppercase",
                  color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                    ? "#000000"
                    : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  minWidth: "100px",
                  fontWeight: 600,
                }}
              >
                <Box
                  sx={{
                    width: "5px",
                    height: "5px",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    marginLeft: "-12px",
                  }}
                ></Box>
                {striker?.name || "Bot1"}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "5px",
                  //   width: "50px",
                  padding: "4px 20px",
                  background: "linear-gradient(to bottom , #fbf8ff , #d9d5d8 )",
                }}
              >
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: 600,
                    minWidth: "20px",
                  }}
                  variant="body1"
                >
                  {striker?.score || 0}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "0.75em",
                    minWidth: "20px",
                  }}
                  variant="body1"
                >
                  {striker?.balls || 0}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "50px",
                minWidth: "225px",
                paddingLeft: "20px",
                background: "linear-gradient(to bottom , #308bcb , #1a528c )",
              }}
            >
              <Box
                sx={{
                  textTransform: "uppercase",
                  color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                    ? "#000000"
                    : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  minWidth: "100px",
                  fontWeight: 600,
                }}
              >
                {nonStriker?.name || "Bot1"}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "5px",
                  padding: "4px 20px",
                  background: "linear-gradient(to bottom , #fbf8ff , #d9d5d8 )",
                }}
              >
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: 600,
                    minWidth: "20px",
                  }}
                  variant="body1"
                >
                  {nonStriker?.score || 0}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "0.75em",
                    minWidth: "20px",
                  }}
                  variant="body1"
                >
                  {nonStriker?.balls || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            position: "relative",
            transform: "skew(-15deg)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(to bottom , #fbf8ff , #d9d5d8 )",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              borderRight: "1px solid rgba(255, 255, 255, 0.2)",
              paddingRight: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "20px",
                background: "linear-gradient(to bottom , #308bcb , #1a528c )",
                minWidth: "225px",
                gap: "30px",
                borderBottom: "2px solid #d9d5d8",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  fontSize: "0.9em",
                  fontWeight: 600,
                  minWidth: "100px",
                  textAlign: "left",
                }}
                variant="body1"
              >
                {randomBowler?.name || "Bot3"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "2px",
                  padding: "4px 10px",
                  background: "linear-gradient(to bottom , #fbf8ff , #d9d5d8 )",
                }}
              >
                <Typography
                  sx={{
                    color:"#000000",
                    minWidth: "50px",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                  variant="body1"
                >
                  {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0}
                </Typography>
                <Typography
                  sx={{
                    color:"#000000",
                    fontSize: "0.8em",
                    minWidth: "20px",
                  }}
                  variant="body1"
                >
                  {randomBowler?.overs || 0}.{randomBowler?.bowled || 0}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                paddingLeft: "20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                    ? "#000000"
                    : "#FFFFFF",
                  textTransform: "uppercase",
                  position: "absolute",
                  top: -40,
                  left: 0,
                  fontSize: "0.8em",
                  background: `linear-gradient(to bottom, ${
                    batting
                      ? userTeam?.secondary
                      : aiTeam?.secondary || "#03a65a"
                  }, ${
                    batting ? userTeam?.primary : aiTeam?.primary || "#01411c"
                  })`,
                  padding: "6px 12px",
                }}
              >
                wkt % :{" "}
                {{
                  0: "Normal",
                  1: "High",
                  2: "Higher",
                  3: "Extreme",
                  4: "Massive",
                  5: "Legendary",
                }[isSix] || "Infinity"}
              </Typography>
              {Array.from({ length: 6 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "20px",
                    height: "20px",
                    color: "#FFFFFF",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9em",
                    fontWeight: 900,
                    background: batting
                      ? userTeam?.ballHistory[index] == "W"
                        ? "#83110f"
                        : userTeam?.ballHistory[index] > 3
                        ? userTeam?.primary
                        : "#1a528c"
                      : aiTeam?.ballHistory[index] == "W"
                      ? "#83110f"
                      : aiTeam?.ballHistory[index] > 3
                      ? aiTeam?.primary
                      : "#1a528c",
                    borderRadius: "50%",
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
              display: "flex",
              alignItems: "center",
              padding: "8px 30px",
              background: `linear-gradient(to bottom , ${
                batting ? aiTeam?.secondary : userTeam?.secondary || "#fde505"
              } , ${batting ? aiTeam?.primary : userTeam?.primary ||"#c1ab11"})`,
            }}
          >
            <img
              style={{
                width: "60px",
                height: "40px",
                boxShadow: "3px 3px 8px -2px #000000",
                transform: "skew(10deg)",
              }}
              src={batting ? aiTeam?.flag : userTeam?.flag}
              alt={batting ? aiTeam?.name : userTeam?.name}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
