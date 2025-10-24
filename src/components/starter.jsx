import React from "react";
import { Box, Typography } from "@mui/material";

export default function StarterScoreboard({
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
  const battingTeam = batting ? userTeam : aiTeam;
  const bowlingTeam = batting ? aiTeam : userTeam;

  const currentScore = battingTeam?.score || 0;
  const currentWickets = battingTeam?.wicket || 0;
  const currentOver = over || 0;
  const currentBalls = balls || 0;

  const runRate =
    over === 0 && balls === 0
      ? "0.00"
      : (currentScore / (over + balls / 6) || 0).toFixed(2);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? parts[0][0] + parts[1][0]
      : parts[0].substring(0, 3);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Score Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={battingTeam?.flag}
            alt={battingTeam?.name}
            style={{
              width: "35px",
              height: "25px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
          <Typography sx={{ fontWeight: 600 }}>
            {getInitials(battingTeam?.name)}
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 600, fontSize: "1.2em" }}>
          {currentScore} / {currentWickets}
        </Typography>

        <Typography sx={{ fontSize: "0.9em" , position : "relative" }}>
          Overs: {currentOver}.{currentBalls} ({totalOvers})
          <Typography
            variant="body1"
            sx={{
              color: "#000",
              background : "#fff",
              textTransform: "uppercase",
              position: "absolute",
              top: -5,
              left: "120%",
              fontSize: "0.8em",
              padding: "6px 12px",
              minWidth : "130px",
              textAlign : "center"
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
        </Typography>
      </Box>

      {/* Strikers */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #ddd",
          pt: 1,
          mt: 1,
        }}
      >
        <Typography sx={{ fontSize: "1em", fontWeight: 900 }}>
          🏏 {striker?.name || "Striker"}: {striker?.score || 0} (
          {striker?.balls || 0})
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {nonStriker?.name || "Non-striker"}: {nonStriker?.score || 0} (
          {nonStriker?.balls || 0})
        </Typography>
      </Box>

      {/* Partnership */}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: "0.85em" }}>
          Partnership: {partnership || 0} ({partnershipBalls || 0})
        </Typography>
      </Box>

      {/* Run rate / Target */}
      <Box sx={{ mt: 1 }}>
        <Typography
          sx={{
            fontSize: firstInnings === 2 ? "1.5em" : "0.85em",
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          {firstInnings === 2
            ? `Target: ${target}`
            : `Run Rate: ${runRate} / Projected: ${(
                (currentScore / (over + balls / 6)) *
                totalOvers
              ).toFixed(0)}`}
        </Typography>
      </Box>

      {/* Bowler */}
      <Box
        sx={{
          mt: 1,
          borderTop: "1px solid #ddd",
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={bowlingTeam?.flag}
            alt={bowlingTeam?.name}
            style={{
              width: "35px",
              height: "25px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
          <Typography sx={{ fontWeight: 600 }}>
            {getInitials(bowlingTeam?.name)}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.9em" }}>
          🎯 {randomBowler?.name || "Bowler"}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {randomBowler?.wickets || 0}-{randomBowler?.conceded || 0} (
          {randomBowler?.overs || 0}.{randomBowler?.bowled || 0})
        </Typography>
      </Box>
    </Box>
  );
}
