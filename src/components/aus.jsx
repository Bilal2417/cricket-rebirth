import { Box, Fade, Typography } from "@mui/material";

export default function AUS({
  batting,
  aiTeam,
  userTeam,
  striker,
  nonStriker,
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
    6: batting ? userTeam?.primary : aiTeam?.primary,
    W: !batting ? userTeam?.primary : aiTeam?.primary,
    4: "#FFFFFF",
  };
  return (
    <>
      <Box
        sx={{
          background:
            "radial-gradient(circle, rgba(255,255,255) -400%, #141517 100%)",
          display: "flex",
          gap: "20px",
          padding: "10px 20px 20px",
          alignItems: "flex-start",
          // mt: "100px",
          borderRadius: "64px",
          // width: "100%",
          boxShadow: `0 0 6px 2px black`,
          transform: { xs: "scale(0.6)", md: "scale(0.8)", lg: "scale(1.0)" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              boxShadow: `0 0 10px 2px ${
                batting ? userTeam?.primary : aiTeam?.primary || "red"
              }`,
              p: "13px 10px",
            }}
          >
            <Box
              sx={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
                m: "auto",
              }}
              src={!batting ? aiTeam?.flag : userTeam?.flag}
              alt={!batting ? aiTeam?.name : userTeam?.name}
              component="img"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              //   gap : "5px"
            }}
          >
            <Typography textTransform="uppercase" variant="h6">
              {batting ? userTeam?.name || "Team1" : aiTeam?.name || "Team2"}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8em !important",
                transform: "scaleY(1.8)",
                transformOrigin: "center",
                color: batting ? userTeam?.primary : aiTeam?.primary,
              }}
              variant="h6"
            >
              {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}-
              {batting ? userTeam?.score || 0 : aiTeam?.score || 0}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography textTransform="uppercase" variant="body2">
              Overs
            </Typography>
            <Typography fontWeight={600} variant="body1">
              {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
              {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0}
            </Typography>
          </Box>
        </Box>

        <Box flexGrow={1}>
          <Box
            sx={{
              border: "2px solid #FFFFFF",
              borderRadius: "32px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 20px",
                gap: "10px",
                borderRadius: "32px",
                outline: `2px solid ${
                  batting ? userTeam?.primary : aiTeam?.primary || "red"
                }`,
                flexGrow: 1,
                position: "relative",
                zIndex: 2,
                boxShadow: `0 0 20px 4px ${
                  batting ? userTeam?.primary : aiTeam?.primary || "red"
                }`,
              }}
            >
              <Typography
                minWidth="120px"
                textTransform="uppercase"
                variant="body1"
                fontSize="1.2em"
              >
                {striker?.name || "Dummy"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}
              >
                <Typography minWidth="20px" variant="body1">
                  {striker?.score || 0}
                </Typography>
                <Typography minWidth="20px" fontSize="0.8em" variant="body2">
                  {striker?.balls || 0}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 20px",
                gap: "10px",
                flexGrow: 1,
              }}
            >
              <Typography
                minWidth="120px"
                textTransform="uppercase"
                variant="body1"
                fontSize="1.2em"
              >
                {nonStriker?.name || "Dummy"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}
              >
                <Typography minWidth="20px" variant="body1">
                  {nonStriker?.score || 0}
                </Typography>
                <Typography minWidth="20px" fontSize="0.8em" variant="body2">
                  {nonStriker?.balls || 0}
                </Typography>
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
              mt: "10px",
            }}
          >
            <Fade in={show == 0} timeout={500}>
              <Typography
                sx={{
                  // color: "#0e0a20",
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
                  // color: "#0e0a20",
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
                  // color: "#0e0a20",
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
            display: "flex",
            alignItems: "flex-end",
            gap: "30px",
            position: "relative",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#ffffff",
              textTransform: "uppercase",
              // fontFamily: "Poppins ,sans-serif , Rubik",
              position: "absolute",
              top: -70,
              left: 0,
              fontSize: "0.8em",
              background: "linear-gradient(to bottom , #141517 , #1a1b1f)",
              padding: "10px 20px",
              borderRadius: "32px",
              borderBottom: `3px solid ${
                batting ? aiTeam?.primary : userTeam?.primary
              }`,
              borderRight: `2px solid ${
                batting ? aiTeam?.primary : userTeam?.primary
              }`,
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
              flexDirection: "column",
            }}
          >
            <Typography textTransform="uppercase" variant="h6">
              {!batting ? userTeam?.name || "Team1" : aiTeam?.name || "Team2"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "7px",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  color: !batting ? userTeam?.primary : aiTeam?.primary,
                  fontSize: "0.9em",
                  fontWeight: 600,
                  minWidth : "80px"
                }}
                variant="body1"
              >
                {randomBowler?.name || "Dummy"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "5px",
                }}
              >
                <Typography
                  sx={{
                    color: !batting ? userTeam?.primary : aiTeam?.primary,
                    width: "50px",
                    textAlign: "center",
                  }}
                  variant="body1"
                >
                  {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0}
                </Typography>
                <Typography
                  sx={{
                    color: !batting ? userTeam?.primary : aiTeam?.primary,
                    fontSize: "0.75em",
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
                        : "2px solid #FFFFFF"
                      : aiTeam?.ballHistory[index] > 3 ||
                        aiTeam?.ballHistory[index] == "W"
                      ? `2px solid ${
                          colors[
                            batting
                              ? userTeam?.ballHistory[index]
                              : aiTeam?.ballHistory[index]
                          ]
                        }`
                      : "2px solid #FFFFFF",

                    color: batting
                      ? userTeam?.ballHistory[index] == 4
                        ? "#000000"
                        : "#FFFFFF"
                      : aiTeam?.ballHistory[index] == 4
                      ? "#0f0648"
                      : "#FFFFFF",

                    borderRadius: "50%",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9em",
                    fontWeight: 900,
                    backgroundColor:
                      colors[
                        batting
                          ? userTeam?.ballHistory[index]
                          : aiTeam?.ballHistory[index]
                      ] || "#0f0648",
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
              borderRadius: "50%",
              boxShadow: `0 0 10px 2px ${
                !batting ? userTeam?.primary || "skyblue" : aiTeam?.primary
              }`,
              p: "13px 10px",
            }}
          >
            <Box
              sx={{
                width: "45px",
                height: "30px",
                boxShadow: "3px 3px 8px -2px #000000",
                m: "auto",
              }}
              src={batting ? aiTeam?.flag : userTeam?.flag}
              alt={batting ? aiTeam?.name : userTeam?.name}
              component="img"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
