import { Box, Fade, Typography } from "@mui/material";

export default function BAN({
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            padding: "15px",
            background: "radial-gradient( #e0dee0 , #cbcbcb )",
            borderRadius: "50%",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #000000",
            }}
            src={!batting ? aiTeam?.flag : userTeam?.flag}
            alt={!batting ? aiTeam?.name : userTeam?.name}
          />
        </Box>

        <Box
          sx={{
            border: "4px solid #000000",
            flexGrow: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "4px solid #000000",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(to bottom , #005601 , #006700 , #005601 )",
                  padding: "4px 40px",
                }}
                variant="body1"
              >
                {batting ? userTeam?.name || "Dummy" : aiTeam?.name || "Dummy"}
              </Typography>
              <Typography
                sx={{
                  background:
                    "linear-gradient(to bottom , #8b0605 , #9a0001 , #8b0605 )",
                  padding: "4px 30px",
                  textTransform: "uppercase",
                }}
                variant="body1"
              >
                {batting ? userTeam?.score || 0 : aiTeam?.score || 0} -{" "}
                {batting ? userTeam?.wicket || 0 : aiTeam?.wicket || 0}
              </Typography>
              <Typography
                sx={{
                  background: "linear-gradient(to bottom , #e0dee0 , #cbcbcb )",
                  padding: "4px 30px",
                  textTransform: "uppercase",
                  color: "#000000",
                }}
                variant="body1"
              >
                {batting ? userTeam?.Over || 0 : aiTeam?.Over || 0}.
                {batting ? userTeam?.Ball || 0 : aiTeam?.Ball || 0}
              </Typography>

              <Box
                sx={{
                  background:
                    "linear-gradient(to bottom , #005601 , #006700 , #005601 )",
                  padding: "4px 20px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "32px",
                  // minWidth: "340px",
                  flexGrow: 2,
                }}
              >
                <Fade in={show == 0} timeout={500}>
                  <Typography
                    sx={{
                      color: "#FFFFFF",
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
                      color: "#FFFFFF",
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
                      color: "#FFFFFF",
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
                  background:
                    "linear-gradient(to bottom , #8b0605 , #9a0001 , #8b0605 )",
                  padding: "4px 20px",
                  textTransform: "uppercase",
                  minWidth: "200px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {getInitials(userTeam?.name || "Bot1")} v{" "}
                {getInitials(aiTeam?.name || "Bot2")}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    // fontFamily: "Poppins ,sans-serif , Rubik",
                    position: "absolute",
                    top: -70,
                    left: -10,
                    fontSize: "0.8em",
                    background:
                      "linear-gradient(to bottom , #8b0605 , #9a0001 , #8b0605 )",
                    padding: "10px 20px",
                    border : "4px solid #000000"
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
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(to bottom , #e0dee0 , #cbcbcb )",
                padding: "4px 40px",
                justifyContent: "space-between",
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
                    color: "#000000",
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
                      backgroundColor: "#000000",
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
                    gap: "10px",
                    width: "50px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000000",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    {striker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000000",
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
                <Box
                  sx={{
                    textTransform: "uppercase",
                    color: "#000000",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    width: "80px",
                    fontWeight: 600,
                  }}
                >
                  {nonStriker?.name || "Bot1"}
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
                      color: "#000000",
                      fontWeight: 600,
                    }}
                    variant="body1"
                  >
                    {nonStriker?.score || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000000",
                      fontSize: "0.75em",
                    }}
                    variant="body1"
                  >
                    {nonStriker?.balls || 0}
                  </Typography>
                </Box>
              </Box>

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
                    color: "#000000",
                    fontWeight: 600,
                  }}
                  variant="body1"
                >
                  {randomBowler?.name || "Bot3"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000000",
                      // fontfamily: "Rubik",
                      minWidth: "80px",
                      textAlign: "center",
                    }}
                    variant="body1"
                  >
                    {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000000",
                      fontSize: "0.8em",
                      // fontfamily: "Rubik",
                    }}
                    variant="body1"
                  >
                    {randomBowler?.overs || 0}.{randomBowler?.bowled || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            alignContent: "center",
            padding: "15px",
            background: "radial-gradient( #e0dee0 , #cbcbcb )",
            borderRadius: "50%",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
              boxShadow: "3px 3px 8px -2px #000000",
            }}
            src={batting ? aiTeam?.flag : userTeam?.flag}
            alt={batting ? aiTeam?.name : userTeam?.name}
          />
        </Box>
      </Box>
    </>
  );
}
