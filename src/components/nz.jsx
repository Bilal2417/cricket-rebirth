import { Box, Fade, Typography } from "@mui/material";
import { use } from "react";
import {
  GiArcheryTarget,
  GiConvergenceTarget,
  GiTargetPoster,
} from "react-icons/gi";

export default function NZ({
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
          transform: { xs: "scale(0.65)", md: "scale(0.9)", lg: "scale(1.0)" },
          // gap: "40px",
        }}
      >
        {/* first */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "8px",
            background: `linear-gradient(to left, ${
              batting ? userTeam?.secondary : aiTeam?.secondary || "#163c8c"
            }, ${batting ? userTeam?.primary : aiTeam?.primary || "#0e306f"})`,
            overflow: "hidden",
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
              padding: "4px 15px",
              color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                ? "#000000"
                : "#FFFFFF",
            }}
            variant="h3"
          >
            {batting
              ? getInitials(userTeam?.name) || "Dum"
              : getInitials(aiTeam?.name) || "Dum"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(to bottom , #c00050 , #c60e56 )",
              alignItems: "center",
              padding: "4px 0",
              height: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                color: "#FFFFFF",
                fontWeight: 600,
                textAlign: "center",
                minWidth: { xs : "100px" , lg : "120px"}
              }}
              variant="body1"
            >
              {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
              {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
            </Typography>

            <Typography
              sx={{
                textTransform: "uppercase",
                color: "#FFFFFF",
                opacity: 0.8,
              }}
              variant="body2"
            >
              {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
              {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0} (3)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 20px",
                gap: "15px",
                boxShadow: "3px 4px 10px -2px #ffffff",
                minWidth: "225px",
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
                padding: "4px 20px",
                minWidth: "225px",                
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  textTransform: "uppercase",
                  color: teams.includes(batting ? userTeam?.name : aiTeam?.name)
                    ? "#000000"
                    : "#FFFFFF",
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
                  boxShadow: "0px 3px 8px -6px #929f97",
                  width: "100%",
                  textAlign: "center",
                }}
                variant="body1"
              >
                run rate
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
                variant="body1"
              >
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
                  boxShadow: "0px 3px 8px -6px #929f97",
                  width: "100%",
                  textAlign: "center",
                }}
                variant="body1"
              >
                partnership
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
                variant="body1"
              >
                {partnership}({partnershipBalls})
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
                  boxShadow: "0px 3px 8px -6px #929f97",
                  width: "100%",
                  textAlign: "center",
                }}
                variant="body1"
              >
                {firstInnings == 2 ? `Target` : `Projected Score`}
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
                variant="body1"
              >
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

        <Box
          sx={{
            background: `linear-gradient(to right, ${
              batting ? aiTeam?.secondary : userTeam?.secondary || "#888888"
            }, ${batting ? aiTeam?.primary : userTeam?.primary || "#555555"})`,
            display: "flex",
            padding: "8px 20px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              borderRight: "1px solid rgba(255, 255, 255, 0.2)",
              paddingRight: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // padding: "4px 20px 4px 4px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: teams.includes(
                    !batting ? userTeam?.name : aiTeam?.name
                  )
                    ? "#000000"
                    : "#FFFFFF",
                  fontSize: "0.9em",
                  fontWeight: 600,
                  minWidth: "80px",
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
                    minWidth: "55px",
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
                      : aiTeam?.secondary || "#163c8c"
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
                    height: "20px",
                    color: (() => {
                      const isBatting = batting;
                      const team = isBatting ? userTeam : aiTeam;
                      const opponent = isBatting ? aiTeam : userTeam;
                      const ball = team?.ballHistory[index];

                      if (ball === "W" || ball > 3) return "#FFFFFF";

                      const currentTeamName = !isBatting
                        ? userTeam?.name
                        : aiTeam?.name;
                      if (teams.includes(currentTeamName)) return "#000000";

                      return "#FFFFFF";
                    })(),

                    // color: teams.includes(
                    //   !batting ? userTeam?.name : aiTeam?.name
                    // )
                    //   ? "#000000"
                    //   : "#FFFFFF",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9em",
                    fontWeight: 900,
                    background: batting
                      ? userTeam?.ballHistory[index] == "W"
                        ? "#c00050"
                        : userTeam?.ballHistory[index] > 3
                        ? userTeam?.primary
                        : aiTeam?.primary
                      : aiTeam?.ballHistory[index] == "W"
                      ? "#c00050"
                      : aiTeam?.ballHistory[index] > 3
                      ? aiTeam?.primary
                      : userTeam?.primary,
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
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                padding: "4px 15px",
                color: teams.includes(!batting ? userTeam?.name : aiTeam?.name)
                  ? "#000000"
                  : "#FFFFFF",
              }}
              variant="h3"
            >
              {!batting
                ? getInitials(userTeam?.name) || "Dum"
                : getInitials(aiTeam?.name) || "Dum"}
            </Typography>
            <img
              style={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
              }}
              src={batting ? aiTeam?.flag : userTeam?.flag}
              alt={batting ? aiTeam?.name : userTeam?.name}
            />
          </Box>
        </Box>
        {/* second */}
      </Box>
    </>
  );
}
