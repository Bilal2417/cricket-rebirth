import { Box, Fade, Typography } from "@mui/material";

export default function Ct25({
  batting,
  aiTeam,
  userTeam,
  striker,
  nonStriker,
  //   getInitials,
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
  const colors = {
    6: "#090533",
    W: "#02c208",
    4: "#090533",
  };

  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: "auto", md: "100%" },
          minHeight: "50px",
          display: "flex",
          transform: { xs: "scale(0.7)", md: "scale(0.8)", lg: "scale(1.0)" },
          background: "linear-gradient(to bottom , #fffdfe , #e8e7f0)",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            padding: "0px 30px",
            background: "linear-gradient(to left , #00af06 , #04c802)",
            borderRadius: "0 132px 132px 0",
            boxShadow: "3px 0px 25px -3px #000000",
            width: "100%",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #12174c",
              display: "block",
              marginLeft: "auto",
            }}
            src={!batting ? aiTeam?.flag : userTeam?.flag}
            alt={!batting ? aiTeam?.name : userTeam?.name}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            // background: "linear-gradient(to bottom , #fffdfe , #e8e7f0)",
            // background: "linear-gradient(to bottom , #fdfffc , #d7d8df)",
            // borderRadius: "64px",
            padding: "2px 15px",
          }}
        >
          <Box
            sx={{
              width: "210px",
              minHeight: "40px",
              padding: "10px 15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  textTransform: "uppercase",
                  color: "#0f0648",
                  fontSize: "0.9em",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  width: "80px",
                  fontWeight: 600,
                }}
              >
                <Box
                  sx={{
                    width: "5px",
                    height: "5px",
                    backgroundColor: "#da2c4e",
                    borderRadius: "50%",
                    marginLeft: "-10px",
                  }}
                ></Box>
                {striker?.name || "Robo"}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  width: "50px",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#0f0648",
                    fontWeight: 600,
                  }}
                  variant="body1"
                >
                  {striker?.score || 0}
                </Typography>
                <Typography
                  sx={{
                    color: "#0f0648",
                    fontSize: "0.75em",
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
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: "#0f0648",
                  fontSize: "0.9em",
                  width: "80px",
                  fontWeight: 600,
                }}
                variant="body1"
              >
                {nonStriker?.name || "Robo"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  width: "50px",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#0f0648",
                    fontWeight: 600,
                  }}
                  variant="body1"
                >
                  {nonStriker?.score || 0}
                </Typography>
                <Typography
                  sx={{
                    color: "#0f0648",
                    fontSize: "0.75em",
                  }}
                  variant="body1"
                >
                  {nonStriker?.balls || 0}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* score */}
          <Box
            sx={{
              background: "linear-gradient(to bottom , #16004c , #090533)",
              padding: " 4px 8px",
              minWidth: "320px",
              borderRadius: "100px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "3px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "5px",
                    textTransform: "uppercase",
                    color: "#02c208",
                  }}
                  variant="body1"
                >
                  {!batting
                    ? getInitials(userTeam?.name || "Bot1")
                    : getInitials(aiTeam?.name || "Bot2")}{" "}
                  <Box
                    sx={{
                      fontSize: "0.7em",
                    }}
                    variant="span"
                  >
                    v
                  </Box>
                </Box>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontSize: "1.4em !important",
                    fontWeight: 600,
                    color: "#02c208",
                  }}
                  variant="h6"
                >
                  {!batting
                    ? getInitials(aiTeam?.name || "Bot2")
                    : getInitials(userTeam?.name || "Bot1")}{" "}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  width: "100px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#171822",
                    fontSize: "0.9em",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
                  {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 600,
                    fontSize: "0.9em",
                    width: "30px",
                    textAlign: "center",
                    color: "#02c208",
                  }}
                  variant="body1"
                >
                  {/* {over}.{balls}{" "} */}
                  {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
                  {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0}
                </Typography>
                <Box
                  sx={{
                    fontSize: "0.7em",
                    fontWeight: 400,
                    color: "#02c208",
                  }}
                  component="span"
                >
                  overs ({totalOvers == 100 ? "∞" : totalOvers || 20})
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "24px",
              }}
            >
              <Fade in={show == 0} timeout={500}>
                <Typography
                  sx={{
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

              <Fade in={show == 1} timeout={500}>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 600,
                    position: "absolute",
                  }}
                  variant="body1"
                >
                  partnership {partnership}({partnershipBalls})
                </Typography>
              </Fade>

              <Fade in={show == 2} timeout={500}>
                <Typography
                  sx={{
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
          </Box>

          <Box
            sx={{
              width: "210px",
              minHeight: "40px",
              padding: "10px 15px",
              position: "relative",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#ffffff",
                textTransform: "uppercase",
                position: "absolute",
                top: "-50px",
                left: 0,
                fontSize: "0.8em",
                backgroundColor: "#090533",
                padding: "10px 20px",
                borderRadius: "32px",
                fontWeight: 600,
                borderBottom: "3px solid #02c208",
                borderRight: "3px solid #02c208",
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
              }[isSix] || ""}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: "#12174c",
                  fontSize: "0.9em",
                  fontWeight: 600,
                }}
                variant="body1"
              >
                {randomBowler?.name || "Robo"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    color: "#12174c",
                    fontWeight: 600,
                    width: "50px",
                    textAlign: "center",
                  }}
                  variant="body1"
                >
                  {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0}
                </Typography>
                <Typography
                  sx={{
                    color: "#12174c",
                    fontSize: "0.75em",
                    // fontfamily: "Rubik",
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
                gap: "8px",
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "15px",
                    height: "15px",
                    outline: batting
                      ? userTeam?.ballHistory[index] > 3 ||
                        userTeam?.ballHistory[index] == "W"
                        ? `2px solid ${
                            colors[
                              batting
                                ? userTeam?.ballHistory[index]
                                : aiTeam?.ballHistory[index]
                            ]
                          }`
                        : "2px solid #090533"
                      : aiTeam?.ballHistory[index] > 3 ||
                        aiTeam?.ballHistory[index] == "W"
                      ? `2px solid ${
                          colors[
                            batting
                              ? userTeam?.ballHistory[index]
                              : aiTeam?.ballHistory[index]
                          ]
                        }`
                      : "2px solid #090533",

                    color: batting
                      ? userTeam?.ballHistory[index] > 3 ||
                        userTeam?.ballHistory[index] == "W"
                        ? "#FFFFFF"
                        : "#12174c"
                      : aiTeam?.ballHistory[index] > 3 ||
                        aiTeam?.ballHistory[index] == "W"
                      ? "#FFFFFF"
                      : "#12174c",

                    borderRadius: "50%",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9em",
                    fontWeight: 900,
                    background:
                      colors[
                        batting
                          ? userTeam?.ballHistory[index]
                          : aiTeam?.ballHistory[index]
                      ] || "radial-gradient( #fdfffc , #d7d8df)",
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
        </Box>

        <Box
          sx={{
            alignContent: "center",
            padding: "0px 30px",
            background: "linear-gradient(to right , #00af06 , #04c802)",
            borderRadius: "132px 0px 0px 132px",
            boxShadow: "-3px 0px 25px -3px #000000",
            width : "100%"
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #12174c",
              display: "block",
              marginRight: "auto",
            }}
            src={batting ? aiTeam?.flag : userTeam?.flag}
          />
        </Box>
      </Box>
    </>
  );
}
