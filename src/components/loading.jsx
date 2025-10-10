import { useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

export default function LoadingPage({ loading, onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setInterval(() => {
        setProgress((old) => Math.min(old + Math.random() * 5, 95));
      }, 200);
    } else {
      timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            old = 100;
            clearInterval(timer);
            onFinish();
            return 100;
          }
          return old + 5;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [loading]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{  fontWeight: 600, color: "#FFFFFF" }}
      >
        Loading, please wait...
      </Typography>
      <Box sx={{ width: "80%" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#ddd",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #f7bb1e, #fc913a, #ff4e50)",
            },
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{  color: "#FFFFFF" }}
      >
        {Math.round(progress)}%
      </Typography>
    </Box>
  );
}
