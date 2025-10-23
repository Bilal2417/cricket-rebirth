import { Box, Fade, Typography } from "@mui/material";

export default function Wc19({
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
    6: "#222589",
    W: "#e00244",
    4: "#222589",
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
          width: { xs : "auto" , md : "100%"},
          //   backgroundColor: "#faf8fb",
          minHeight: "50px",
          display: "flex",
          justifyContent: "center",
          transform: { xs: "scale(0.7)", md: "scale(0.8)", lg: "scale(1.0)" },
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            padding: "0px 20px 0 100px",
            backgroundColor: "#faf8fb",
            borderRadius: "0 132px 132px 0",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #12174c",
            }}
            src={!batting ? aiTeam?.flag : userTeam?.flag}
            alt={!batting ? aiTeam?.name : userTeam?.name}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#faf8fb",
            borderRadius: "64px",
            padding: "2px 15px",
          }}
        >
          <Box
            sx={{
              width: "200px",
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
                }}
              >
                <Box
                  sx={{
                    width: "5px",
                    height: "5px",
                    backgroundColor: "#fa208e",
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
                  // fontfamily: "Rubik",
                  width: "80px",
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

          <Box
            sx={{
              backgroundColor: "#12174c",
              padding: " 4px 16px 4px 0",
              minWidth: "300px",
              borderRadius: "32px",
              overflow: "hidden",
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
                  alignItems: "flex-end",
                  gap: "10px",
                  background:
                    "linear-gradient(to left , #e00244 20%, #222589 70%)",
                  borderRadius: "0 32px 32px 0",
                  padding: "0 10px",
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
                      color: "#faf8fb",
                      // fontfamily: "Rubik",
                      textTransform: "uppercase",
                    }}
                    variant="body1"
                  >
                    <Typography
                      sx={{
                        color: "#faf8fb",
                        textTransform: "uppercase",
                        // fontSize: "1.1em",
                        opacity: 0.8,
                      }}
                      variant="body1"
                    >
                      {!batting
                        ? getInitials(userTeam?.name || "Robo")
                        : getInitials(aiTeam?.name || "Robo")}{" "}
                    </Typography>
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
                      color: "#faf8fb",
                      // fontfamily: "Rubik",
                      textTransform: "uppercase",
                      fontSize: "1.1em",
                      fontWeight: 600,
                    }}
                    variant="h6"
                  >
                    {!batting
                      ? getInitials(aiTeam?.name || "Robo")
                      : getInitials(userTeam?.name || "Robo")}{" "}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    //   backgroundColor: "#fa208e",
                    //   borderRadius: "8px",
                    padding: "2px 0px",
                    width: "100px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFFFFF",
                      fontSize: "0.9em",
                      fontWeight: "600",
                      // fontfamily: "Rubik",
                      textAlign: "center",
                    }}
                  >
                    {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
                    {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  sx={{
                    color: "#faf8fb",
                    // fontfamily: "Rubik",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    fontSize: "0.9em",
                    width: "30px",
                    textAlign: "center",
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
                    color: "#faf8fb",
                    minWidth : "65px",
                  }}
                  component="span"
                >
                  overs ({totalOvers == 100 ? "∞" : totalOvers})
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
                    color: "#faf8fb",
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

              <Fade in={show == 1} timeout={500}>
                <Typography
                  sx={{
                    color: "#faf8fb",
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

              <Fade in={show == 2} timeout={500}>
                <Typography
                  sx={{
                    color: "#faf8fb",
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
          </Box>

          <Box
            sx={{
              width: "200px",
              minHeight: "40px",
              padding: "10px 15px",
              position: "relative",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#12174c",
                textTransform: "uppercase",
                // fontFamily: "Poppins ,sans-serif , Rubik",
                position: "absolute",
                top: "-50px",
                left: 0,
                fontSize: "0.8em",
                backgroundColor: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: "32px",
                fontWeight: 600,
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
                  // fontfamily: "Rubik",
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
                    // fontfamily: "Rubik",
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
                        : "2px solid #12174c"
                      : aiTeam?.ballHistory[index] > 3 ||
                        aiTeam?.ballHistory[index] == "W"
                      ? `2px solid ${
                          colors[
                            batting
                              ? userTeam?.ballHistory[index]
                              : aiTeam?.ballHistory[index]
                          ]
                        }`
                      : "2px solid #12174c",

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
                    backgroundColor:
                      colors[
                        batting
                          ? userTeam?.ballHistory[index]
                          : aiTeam?.ballHistory[index]
                      ] || "#faf8fb",
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
            padding: "0px 100px 0 20px",
            backgroundColor: "#faf8fb",
            borderRadius: "132px 0px 0px 132px",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #12174c",
            }}
            src={batting ? aiTeam?.flag : userTeam?.flag}
          />
        </Box>
      </Box>
    </>
  );
}
