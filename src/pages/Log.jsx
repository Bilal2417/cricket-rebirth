import { Box, Typography } from "@mui/material";
import { GiTrophy } from "react-icons/gi";
import bat from "/img/pak.png";
export default function Log() {
  const ok = 10;
  return (
    <>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "center",
            mb: "20px",
            mt: "100px",
          }}
          variant="h3"
        >
          Battle Log
        </Typography>

        <Box
          sx={{
            background: "#8275a1",
            padding: "10px 0",
            border: "4px solid #3b3f6b",
            boxShadow: "5px 5px 20px 5px #032267",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#332741",
              textAlign: "right",
              paddingRight: "20px",
            }}
            variant="h6"
          >
            1h 11m ago
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#7a6d98",
              padding: "10px 20px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                width: "120px",
              }}
              variant="h6"
            >
              20 Overs
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                color: ok === 10 ? "#0ff110" : "#c70400",
                textShadow: `
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       2px  2px 0 #000
    `,
              }}
              variant="h5"
            >
              {ok === 10 ? "Victory" : "Defeat"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "120px",
                justifyContent: "end",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
                variant="h6"
              >
                {/* {winner == aiTeam?.name ? "-" : "+"} */}+
                {/* {Math.ceil(trophyInc)} */}8
              </Typography>
              <GiTrophy size={30} style={{ color: "#f6c401" }} />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                // flexDirection : "column",
                gap: "30px",
                alignItems: "center",
                width: "320px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                  variant="h6"
                >
                  Pakistan
                </Typography>
                <Box
                  component="img"
                  sx={{
                    width: { xs: "45px", md: "60px" },
                    height: { xs: "30px", md: "40px" },
                    boxShadow: "3px 3px 8px -2px #000000",
                    borderRadius: "6px",
                  }}
                  src={bat}
                />
              </Box>

              <Box>
                <Typography variant="h4">152/0</Typography>
                <Typography variant="body2">10.3 overs</Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: 900,
                textTransform: "uppercase",
                textShadow: `
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       2px  4px 0 #000
    `,
              }}
              variant="h1"
            >
              vs
            </Typography>

            <Box
              sx={{
                display: "flex",
                // flexDirection : "column",
                gap: "30px",
                alignItems: "center",
                width: "320px",
                justifyContent: "end",
              }}
            >
              <Box>
                <Typography variant="h4">152/0</Typography>
                <Typography variant="body2">10.3 overs</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                  variant="h6"
                >
                  Pakistan
                </Typography>
                <Box
                  component="img"
                  sx={{
                    width: { xs: "45px", md: "60px" },
                    height: { xs: "30px", md: "40px" },
                    boxShadow: "3px 3px 8px -2px #000000",
                    borderRadius: "6px",
                  }}
                  src={bat}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
