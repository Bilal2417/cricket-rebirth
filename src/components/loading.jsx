import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

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
    <Box sx={{ width: "100%", height: "100vh" }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
