import { Box, Typography } from "@mui/material";
import { GiPointySword, GiTrophy } from "react-icons/gi";
import bat from "/img/pak.png";
import { useEffect, useState } from "react";
export default function Log() {
  const ok = 10;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profileId = localStorage.getItem("MyId");
    if (!profileId) return;

    // initial fetch
    fetch(`/.netlify/functions/log?profileId=${profileId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
          console.log(data.profile);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  return (
    <>
      <Box
        sx={{
          padding: "50px 0",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "center",
            mb: "20px",
          }}
          variant="h3"
        >
          Battle Log
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "25px",
          }}
        >
          {profile?.battle_log?.map((log) => {
            return (
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
                  {(() => {
                    const now = new Date();
                    const logTime = new Date(log?.time);
                    const diffMs = now - logTime; // difference in milliseconds

                    const diffMins = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHours / 24);

                    if (diffDays > 0)
                      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                    if (diffHours > 0)
                      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                    if (diffMins > 0)
                      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
                    return "Just now";
                  })()}
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
                    {isNaN(log?.mode) ? log?.mode : `${log?.mode} overs`}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color:
                        log?.result == "Victory"
                          ? "#0ff110"
                          : log?.result == "Defeat"
                          ? "#c70400"
                          : "grey",
                      textShadow: `
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       2px  2px 0 #000
    `,
                      ml: "25px",
                      width: "95px",
                    }}
                    variant="h5"
                  >
                    {log?.result}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      minWidth: "150px",
                      justifyContent: "end",
                    }}
                  >
                    {log?.mode == "CONTEST" ? (
                      <GiPointySword
                        size={30}
                        style={{ color: "#f6c401", transform: "rotate(85deg)" }}
                      />
                    ) : (
                      <GiTrophy size={30} style={{ color: "#f6c401" }} />
                    )}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                      variant="h6"
                    >
                      {log?.result == "Victory" || log?.mode == "CONTEST"
                        ? "+"
                        : "-"}
                      {log?.trophies}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
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
                            minWidth: "140px",
                          }}
                          variant="h6"
                        >
                          {log?.team1?.name}
                        </Typography>
                        <Box
                          component="img"
                          sx={{
                            width: { xs: "45px", md: "60px" },
                            height: { xs: "30px", md: "40px" },
                            boxShadow: "3px 3px 8px -2px #000000",
                            borderRadius: "6px",
                          }}
                          src={log?.team1?.flags}
                        />
                      </Box>

                      <Box>
                        <Typography minWidth={100} variant="h4">
                          {log?.team1?.runs}
                          {log?.team1?.wickets == 10
                            ? null
                            : "/" + log?.team1?.wickets}
                        </Typography>
                        <Typography variant="body2">
                          {log?.team1?.overs}.{log?.team1?.balls} overs
                        </Typography>
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
                        <Typography minWidth={100} variant="h4">
                          {log?.team2?.runs}
                          {log?.team2?.wickets == 10
                            ? null
                            : "/" + log?.team2?.wickets}
                        </Typography>
                        <Typography variant="body2">
                          {log?.team2?.overs}.{log?.team2?.balls} overs
                        </Typography>
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
                            minWidth: "140px",
                            textAlign: "end",
                          }}
                          variant="h6"
                        >
                          {log?.team2?.name}
                        </Typography>
                        <Box
                          component="img"
                          sx={{
                            width: { xs: "45px", md: "60px" },
                            height: { xs: "30px", md: "40px" },
                            boxShadow: "3px 3px 8px -2px #000000",
                            borderRadius: "6px",
                          }}
                          src={log?.team2?.flags}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                      }}
                      variant="h6"
                    >
                      {log?.team1?.runs > log?.team2?.runs
                        ? log?.team1?.name
                        : log?.team2?.name}
                    </Typography>
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                      }}
                      variant="body1"
                    >
                      won by
                    </Typography>
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                      }}
                      variant="h6"
                    >
                      {log?.team1?.runs > log?.team2?.runs
                        ? log?.team1?.runs -
                          log?.team2?.runs +
                          `${
                            log?.team1?.runs - log?.team2?.runs <= 1
                              ? ` run`
                              : `  runs`
                          }`
                        : log?.totalWickets -
                          log?.team2?.wickets +
                          `${
                            log?.totalWickets - log?.team2?.wickets <= 1
                              ? ` wicket`
                              : ` wickets`
                          }`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
