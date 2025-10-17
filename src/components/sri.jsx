import { Box, Fade, Typography } from "@mui/material";
import { use } from "react";
import {
  GiArcheryTarget,
  GiConvergenceTarget,
  GiTargetPoster,
} from "react-icons/gi";

export default function SRI({
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

  const teams = ["Australia", "UAE"];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          transform: { xs: "scale(0.7)", md: "scale(0.8)", lg: "scale(1.0)" },
          gap: "40px",
        }}
      >
        {/* first */}
        <Box>
          <Box
            sx={{
              background: "linear-gradient(to bottom , #f9fbfa , #929f97 )",
              padding: "4px 20px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "32px",
              maxWidth: "280px",
            }}
          >
            <Fade in={show == 0} timeout={500}>
              <Typography
                sx={{
                  color: "#000",
                  // fontfamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
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
            </Fade>

            <Fade
              in={firstInnings == 2 ? show == 1 || show == 2 : show == 1}
              timeout={500}
            >
              <Typography
                sx={{
                  color: "#000",
                  // fontfamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
                }}
                variant="body1"
              >
                partnership {partnership}({partnershipBalls})
              </Typography>
            </Fade>

            <Fade in={firstInnings == 2 ? null : show == 2} timeout={500}>
              <Typography
                sx={{
                  color: "#000",
                  // fontfamily: "Rubik",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  position: "absolute",
                }}
                variant="body1"
              >
                {firstInnings == 2
                  ? `Target : ${target}`
                  : totalOvers !== 100
                  ? `Projected Score : ${(
                      ((batting ? userTeam?.score : aiTeam?.score) /
                        (over + balls / 6)) *
                      totalOvers
                    ).toFixed(0)}`
                  : null}
              </Typography>
            </Fade>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // background: batting
              //   ? userTeam?.primary
              //   : aiTeam?.primary || "#ff4d4d",
              // sec to pri
              padding: "0px 8px",
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
                  ? "#000000"
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
                padding: "7px 20px",
                textTransform: "uppercase",
                color: "#000000",
                fontWeight: 600,
                textAlign: "center",
                minWidth: "120px",
              }}
              variant="body1"
            >
              {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
              {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
            </Typography>

            <Typography
              sx={{
                padding: "4px 20px",
                textTransform: "uppercase",
                color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                  ? "#000000"
                  : "#FFFFFF",
                borderRight: "2px solid #74747450",
              }}
              variant="body1"
            >
              {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
              {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingX: "40px",
                justifyContent: "space-between",
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
                    color: teams.includes(
                      batting ? userTeam?.name : aiTeam?.name
                    )
                      ? "#000000"
                      : "#FFFFFF",
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
                      backgroundColor: "#fff",
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
                      color: teams.includes(
                        batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#000000"
                        : "#FFFFFF",
                      fontWeight: 600,
                      minWidth: "20px",
                    }}
                    variant="body1"
                  >
                    {striker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: teams.includes(
                        batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#000000"
                        : "#FFFFFF",
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
                    color: teams.includes(
                      batting ? userTeam?.name : aiTeam?.name
                    )
                      ? "#000000"
                      : "#FFFFFF",
                    gap: "5px",
                    minWidth: "80px",
                    fontWeight: 600,
                    textAlign: "right",
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
                      color: teams.includes(
                        batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#000000"
                        : "#FFFFFF",
                      fontWeight: 600,
                      minWidth: "20px",
                    }}
                    variant="body1"
                  >
                    {nonStriker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: teams.includes(
                        batting ? userTeam?.name : aiTeam?.name
                      )
                        ? "#000000"
                        : "#FFFFFF",
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

            <Box
              sx={{
                height: "32px",
                position: "relative",
                background: "#FFFFFF",
                width: "85px",
                display: firstInnings == 2 ? "block" : "none",
              }}
            >
              <Fade in={firstInnings == 2} timeout={500}>
                <Typography
                  sx={{
                    color: "#000",
                    // fontfamily: "Rubik",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    position: "absolute",
                    top: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "0 5px",
                  }}
                  variant="body1"
                >
                  <GiTargetPoster style={{ color: "#ff4d4d" }} size={25} />
                  {target}
                </Typography>
              </Fade>
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
                  ? "#000000"
                  : "#FFFFFF",
                textTransform: "uppercase",
                position: "absolute",
                top: -70,
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
                  width: "20px",
                  height: "15px",
                  color: batting
                    ? userTeam?.ballHistory[index] <= 3
                      ? "#12174c"
                      : "#FFFFFF"
                    : aiTeam?.ballHistory[index] <= 3
                    ? "#12174c"
                    : "#FFFFFF",
                  padding: "12px 8px",
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
                  ? "#000000"
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
                    ? "#000000"
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
                    ? "#000000"
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
