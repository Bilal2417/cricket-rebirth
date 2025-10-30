import { Box, Typography } from "@mui/material";

export default function Bowling(squad) {
  const bowling = squad.data;

  const colors = {
    wc19: { bg: "#222589", text: "#222589" },
    wc21: {
      bg: "linear-gradient(to bottom, rgb(215, 21, 73), rgb(233, 25, 85))",
      text: "#f83059",
    },
    wc22: { bg: "#d71c59", text: "#d71c59" },
    wc24: { bg: "#fa208e", text: "#fa208e" },
    ct25: { bg: "#02c208", text: "#02c208" },
    // wtc: { bg: bowling?.primary, text: bowling?.primary },
    wtc : { bg : "#000" , text : "#000"}
  };

  const board = localStorage.getItem("Board");

  return (
    <>
      <Box>
        <Box
          sx={{
            color: colors[board].text || "rgb(65, 38, 255)",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 4px -3px #0003",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              paddingRight: "35px",
              gap: "20px",
              justifyContent: "flex-end",
              borderBottom: `2px solid ${colors[board].text || "rgb(65, 38, 255)"}`,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "8px 16px",
                width: "75px",
                textAlign: "center",
              }}
              variant="body1"
            >
              ovrs
            </Typography>

            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "75px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Dots
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "75px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Runs
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "75px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Wkts
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "75px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Ecn
            </Typography>
          </Box>
        </Box>
        <Box>
          {bowling.players
            .filter(
              (player) =>
                player.isBowler && (player.overs !== 0 || player.bowled !== 0)
            )
            .map((player, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#0f0648",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "inset 0px 0px 11px -10px #000000",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    padding: "8px 16px",
                  }}
                  variant="h6"
                >
                  {player.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "18px",
                    paddingRight: "35px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: { xs: "4px 16px", md: "8px 16px" },
                      width: "75px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.overs}.{player.bowled}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: { xs: "4px 16px", md: "8px 16px" },
                      width: "75px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.dot}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: { xs: "4px 16px", md: "8px 16px" },
                      width: "75px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.conceded}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: { xs: "4px 16px", md: "8px 16px" },
                      width: "75px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.wickets}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: { xs: "4px 16px", md: "8px 16px" },
                      width: "75px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.economy}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#0f0648",
            backgroundColor: "#FFFFFF",
            boxShadow: "inset 0px 0px 11px -10px #000000",
            width: "100%",
            height: "40px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#0f0648",
            backgroundColor: "#FFFFFF",
            boxShadow: "inset 0px 0px 11px -10px #000000",
            width: "100%",
            height: "40px",
          }}
        />
        <Box>
          <Box
            sx={{
              background: colors[board].bg || "#4126ff",
              display: "flex",
              alignItems: "center",
              gap: "50px",
              padding: "5px 0px",
              width: "100%",
              // borderRadius: "12px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "0px 15px",
                width: "220px",
              }}
              variant="h6"
            >
              fall of wickets
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
            >
              {bowling?.fow?.map((wicket, index) => {
                return (
                  <>
                    <Typography
                      key={index}
                      sx={{
                        color: "#FFFFFF",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        width: "40px",
                        textAlign: "center",
                      }}
                      variant="h6"
                    >
                      {index + 1}
                    </Typography>
                  </>
                );
              })}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "50px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                // fontfamily: "Rubik",
                padding: "4px 15px",
                width: "220px",
                color: "#000000",
              }}
              variant="h6"
            >
              score
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
            >
              {bowling?.fow?.map((wicket, index) => {
                return (
                  <>
                    <Typography
                      key={index}
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: 600,
                        width: "40px",
                        textAlign: "center",
                        color: "#000000",
                      }}
                      variant="h6"
                    >
                      {wicket}
                    </Typography>
                  </>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
