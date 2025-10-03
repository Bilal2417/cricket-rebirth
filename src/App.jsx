import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ScoreCard24 from "./components/scr24";
import Scorecard from "./pages/Scorecard";
import { Box, Container } from "@mui/material";
import Selection from "./pages/Selection";
import Toss from "./pages/Toss";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Modes from "./pages/Modes";
import Knockout from "./pages/Knockout";
import Fixtures from "./pages/Fixtures";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import CardPacksShop from "./components/card";
import MovingBallsBackground from "./components/background";

function App() {

    useEffect(() => {
    const profileId = localStorage.getItem("MyId"); 
    if (!profileId) return;

    
    const updateActivity = async () => {
      try {
        await fetch(`/.netlify/functions/activeProfile?profileId=${profileId}`);
      } catch (err) {
        console.error("Failed to update activity:", err);
      }
    };

    updateActivity();

    
    const interval = setInterval(updateActivity, 50 * 1000);

    
    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      sx={{
        alignContent: "center",
      }}
    >
      <Router>
        <Box
          sx={{
            // transform: { xs: "rotate(90deg)", md: "none" },
            
            
            overflowX: { xs : "auto" , md : "unset"}, 
            overflowY: { xs : "auto" , md : "unset"}, 
            maxWidth: "100vw", 
          }}
        >
          <MovingBallsBackground/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card" element={<CardPacksShop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/knockout" element={<Knockout />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/team" element={<Selection />} />
            <Route  path="/gamePlay" element={<ScoreCard24 />} />
            <Route path="/toss" element={<Toss />} />
            <Route path="/score" element={<Scorecard />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </Box>
      </Router>
      <ToastContainer/>
    </Container>
  );
}

export default App;
