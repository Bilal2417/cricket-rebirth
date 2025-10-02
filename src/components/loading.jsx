import { Box, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function LoadingPage({ loading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
        
      setProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 91) return oldProgress; 
        return oldProgress + Math.random() * 9;
      });
    }, 500);

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
      <Typography variant="h5" sx={{ fontFamily: "Rubik", fontWeight: 600 , color : "#FFFFFF"}}>
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
      <Typography variant="body2" sx={{ fontFamily: "Rubik" , color : "#FFFFFF" }}>
        {Math.round(progress)}%
      </Typography>
    </Box>
  );
}
