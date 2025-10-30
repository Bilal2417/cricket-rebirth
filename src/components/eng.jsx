import { Box, Fade, Typography } from "@mui/material";
import { use } from "react";
import {
  GiArcheryTarget,
  GiConvergenceTarget,
  GiTargetPoster,
} from "react-icons/gi";

export default function ENG({
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
          alignItems: "end",
        }}
      >
        {/* first */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "8px",
              background: `linear-gradient(to bottom, ${
                batting ? userTeam?.secondary : aiTeam?.secondary || "#163c8c"
              }, ${
                batting ? userTeam?.primary : aiTeam?.primary || "#0e306f"
              })`,
            }}
          >
            <img
              style={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
              }}
              src={!batting ? aiTeam?.flag : userTeam?.flag}
              alt={!batting ? aiTeam?.name : userTeam?.name}
            />
            <Typography
              sx={{
                textTransform: "uppercase",
                padding: "4px 25px",
                color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                  ? "#2f3d56"
                  : "#FFFFFF",
              }}
              variant="body1"
            >
              {batting
                ? getInitials(userTeam?.name) || "Dum"
                : getInitials(aiTeam?.name) || "Dum"}
            </Typography>

            <Typography
              sx={{
                background: "linear-gradient(to bottom , #f9fbfa , #929f97 )",
                padding: "7px 10px",
                textTransform: "uppercase",
                color: "#2f3d56",
                fontWeight: 600,
                textAlign: "center",
                minWidth: "100px",
                boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
              }}
              variant="body1"
            >
              {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
              {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
            </Typography>

            <Box
              sx={{
                display: "flex",
                background: `linear-gradient(to bottom, ${
                  batting ? aiTeam?.secondary : userTeam?.secondary || "#fde505"
                }, ${
                  batting ? aiTeam?.primary : userTeam?.primary || "#c1ab11"
                })`,
                paddingRight: "10px",
              }}
            >
              <Typography
                sx={{
                  width: "120px",
                  padding: "9px 0px 9px 10px",
                  textTransform: "uppercase",
                  color: teams.includes(
                    !batting ? userTeam?.name : aiTeam?.name
                  )
                    ? "#2f3d56"
                    : "#FFFFFF",
                  boxShadow: "inset -4px 0 6px -2px rgba(0,0,0,0.1)",
                }}
                variant="body2"
              >
                ovrs {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
                {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0} ({totalOvers})
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "130px",
                }}
              >
                <Fade in={show == 0} timeout={500}>
                  <Typography
                    sx={{
                      color: teams.includes(
                        !batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#2f3d56"
                        : "#FFFFFF",
                      // fontfamily: "Rubik",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      position: "absolute",
                    }}
                    variant="body1"
                  >
                    R.Rate{" "}
                    {over === 0 && balls === 0
                      ? "0.00"
                      : (
                          (batting ? userTeam?.score : aiTeam?.score) /
                            (over + balls / 6) || 0
                        ).toFixed(2)}
                  </Typography>
                </Fade>

                <Fade in={show == 1} timeout={500}>
                  <Typography
                    sx={{
                      color: teams.includes(
                        !batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#2f3d56"
                        : "#FFFFFF",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      position: "absolute",
                    }}
                    variant="body1"
                  >
                    p'ship {partnership}({partnershipBalls})
                  </Typography>
                </Fade>

                <Fade in={show == 2} timeout={500}>
                  <Typography
                    sx={{
                      color: teams.includes(
                        !batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#2f3d56"
                        : "#FFFFFF",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      position: "absolute",
                    }}
                    variant="body1"
                  >
                    {firstInnings == 2
                      ? `Target : ${target}`
                      : totalOvers !== 100
                      ? `Proj : ${(
                          ((batting ? userTeam?.score : aiTeam?.score) /
                            (over + balls / 6)) *
                          totalOvers
                        ).toFixed(0)}`
                      : null}
                  </Typography>
                </Fade>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "7px 20px",
                gap: "10px",
                justifyContent: "space-between",
                background: "linear-gradient(to bottom , #f0f1f3 , #a7adb1 )",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    textTransform: "uppercase",
                    color: "#2f3d56",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    minWidth: "80px",
                    fontWeight: 600,
                  }}
                >
                  <Box
                    sx={{
                      width: "5px",
                      height: "5px",
                      backgroundColor: "#2f3d56",
                      borderRadius: "50%",
                      marginLeft: "-10px",
                    }}
                  ></Box>
                  {striker?.name || "Bot1"}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "5px",
                    width: "50px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2f3d56",
                      fontWeight: 600,
                      minWidth: "20px",
                    }}
                    variant="body1"
                  >
                    {striker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#2f3d56",
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
                  gap: "15px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textTransform: "uppercase",
                    color: "#2f3d56",
                    gap: "5px",
                    minWidth: "80px",
                    fontWeight: 600,
                  }}
                >
                  {nonStriker?.name || "Bot1"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "5px",
                    width: "50px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2f3d56",
                      fontWeight: 600,
                      minWidth: "20px",
                    }}
                    variant="body1"
                  >
                    {nonStriker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#2f3d56",
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
        </Box>

        {/* second */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFFFFF",
              padding: "4px 20px",
              position: "relative",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                  ? "#2f3d56"
                  : "#FFFFFF",
                textTransform: "uppercase",
                position: "absolute",
                top: -40,
                left: 0,
                fontSize: "0.8em",
                background: `linear-gradient(to bottom, ${
                  batting ? userTeam?.secondary : aiTeam?.secondary || "#163c8c"
                }, ${
                  batting ? userTeam?.primary : aiTeam?.primary || "#0e306f"
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
                  width: "15px",
                  height: "15px",
                  color:
                  //  batting
                  //   ? userTeam?.ballHistory[index] <= 3
                  //     ? "#2f3d56"
                  //     : "#FFFFFF"
                  //   : aiTeam?.ballHistory[index] <= 3
                  //   ? "#2f3d56"
                  //   : 
                    "#FFFFFF",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9em",
                  fontWeight: 900,
                  background: batting
                    ? userTeam?.ballHistory[index] > 3
                      ? userTeam?.primary
                      : aiTeam?.primary
                    : aiTeam?.ballHistory[index] > 3
                    ? aiTeam?.primary
                    : userTeam?.primary,
                }}
              >
                {/* {ballHistory[index] ?? ""} */}
                {batting
                  ? userTeam?.ballHistory[index]
                  : aiTeam?.ballHistory[index]}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 20px 4px 4px",
              background: `linear-gradient(to bottom, ${
                batting ? aiTeam?.secondary : userTeam?.secondary || "#fde505"
              }, ${
                batting ? aiTeam?.primary : userTeam?.primary || "#c1ab11"
              })`,
            }}
          >
            <img
              style={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
              }}
              src={batting ? aiTeam?.flag : userTeam?.flag}
              alt={batting ? aiTeam?.name : userTeam?.name}
            />
            <Typography
              sx={{
                textTransform: "uppercase",
                color: teams.includes(!batting ? userTeam?.name : aiTeam?.name)
                  ? "#2f3d56"
                  : "#FFFFFF",
                fontSize: "0.9em",
                fontWeight: 600,
                minWidth: "80px",
                textAlign: "center",
              }}
              variant="body1"
            >
              {randomBowler?.name || "Bot3"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: "5px",
              }}
            >
              <Typography
                sx={{
                  color: teams.includes(
                    !batting ? userTeam?.name : aiTeam?.name
                  )
                    ? "#2f3d56"
                    : "#FFFFFF",
                  minWidth: "80px",
                  textAlign: "center",
                }}
                variant="body1"
              >
                {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0}
              </Typography>
              <Typography
                sx={{
                  color: teams.includes(
                    !batting ? userTeam?.name : aiTeam?.name
                  )
                    ? "#2f3d56"
                    : "#FFFFFF",
                  fontSize: "0.8em",
                }}
                variant="body1"
              >
                {randomBowler?.overs || 0}.{randomBowler?.bowled || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
