import { Box, Typography } from "@mui/material";

export default function Bowling(squad) {
  console.log("ashgakjhkjhjhkhjhjkhjc", squad);
  const bowling = squad.data;
  return (
    <>
      <Box>
        <Box
          sx={{
            color: "#fa208e",
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
              gap: "15px",
              justifyContent: "flex-end",
              borderBottom: "2px solid #fa208e",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                padding: "8px 16px",
                width: "60px",
                textAlign: "center",
              }}
              variant="body1"
            >
              ovrs
            </Typography>

            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "60px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Dots
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "60px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Runs
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "60px",
                textAlign: "center",
              }}
              variant="body1"
            >
              Wkts
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Rubik",
                textTransform: "uppercase",
                padding: "10px 20px",
                width: "60px",
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
            .filter((player) => player.isBowler && (player.overs !==0 || player.bowled !== 0))
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
                    fontFamily: "Rubik",
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
                    gap: "15px",
                    paddingRight: "40px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Rubik",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      width: "60px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.overs}.{player.bowled}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Rubik",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      width: "60px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.dot}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Rubik",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      width: "60px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.conceded}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Rubik",
                      textTransform: "uppercase",
                      padding: "8px 16px",
                      width: "60px",
                      textAlign: "center",
                    }}
                    variant="h6"
                  >
                    {player.wickets}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Rubik",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      width: "60px",
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
              backgroundColor: "#4126ff",
              display: "flex",
              alignItems: "center",
              gap: "50px",
              padding: "5px",
              ml: "-5px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                textTransform: "uppercase",
                fontWeight: 600,
                fontFamily: "Rubik",
                padding: "0px 15px",
                width: "200px",
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
                fontFamily: "Rubik",
                padding: "4px 15px",
                width: "200px",
                color : '#000000'
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
                        color : '#000000'
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
