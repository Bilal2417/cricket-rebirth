import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import ScoreCard from "./components/score";
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
import { useEffect, useState } from "react";
import CardPacksShop from "./components/card";
import MovingBallsBackground from "./components/background";
import DisablePullToRefresh from "./components/disable";
import CardOpening from "./pages/Opening";
import ProfileData from "./pages/ProfileData";
import Tournament from "./pages/Tournament";
import Navbar from "./components/navbar";
import Shop from "./pages/Shop";
import ScoreBoards from "./pages/Scoreboards";
import Wc21 from "./components/wc21";
import Wc22 from "./components/wc22";
import ScorecardWheel from "./pages/scoreCardOpening";
import useDisableBackButton from "./components/disableBack";

function App() {
  useDisableBackButton()
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

    const interval = setInterval(updateActivity, 100 * 1000);

    return () => clearInterval(interval);
  }, []);

  const location = useLocation();

  const [finalist, setFinalist] = useState(sessionStorage.getItem("Finalist"));

  useEffect(() => {
    const handleBackUpdate = () => {
      const final = sessionStorage.getItem("Finalist");
      if (!final) {
        setFinalist(false);
      }
    };
    handleBackUpdate();
    window.addEventListener("BackUpdated", handleBackUpdate);
    return () => window.removeEventListener("BackUpdated", handleBackUpdate);
  }, [location.pathname, finalist]);

  
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const profileId = localStorage.getItem("MyId");
    if (!profileId) return;

    // initial fetch
    fetch(`/.netlify/functions/userProfile?profileId=${profileId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
          // if(data.profile.name == "Billy" || data.profile.name == "Bilal" || data.profile.name == "Arsal 84" || data.profile.name == "Pak|Frozen"){
          //   localStorage.setItem("FirstVisit", true)
          // }
          sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    const handleProfileUpdate = () => {
      const updated = sessionStorage.getItem("UserProfile");
      if (updated) {
        setProfile(JSON.parse(updated));
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
}, [localStorage.getItem("MyId")]);

  useEffect(() => {
    const handleFinalistUpdate = () =>
      setFinalist(sessionStorage.getItem("Finalist"));
    window.addEventListener("finalistUpdated", handleFinalistUpdate);
    return () =>
      window.removeEventListener("finalistUpdated", handleFinalistUpdate);
  }, []);

  return (
    <Container
      sx={{
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          overflowX: { xs: "auto", md: "unset" },
          overflowY: { xs: "auto", md: "unset" },
          maxWidth: "100vw",
        }}
      >
        <MovingBallsBackground
          color={finalist ? "#111" : "white"}
          background={
            finalist
              ? "radial-gradient(circle, #b51c22,  #111 120%)"
              : "radial-gradient(circle, #1164ee 0%, #381daa 100%)"
          }
          speed={finalist ? 4 : 7}
        />
        <DisablePullToRefresh />
        {(location.pathname === "/" || location.pathname === "/shop") && (
          <Navbar profile={profile} />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scoreBoardOpening" element={<ScorecardWheel />} />
          <Route path="/shop" element={<Shop profile={profile} />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/open-pack/:packKey" element={<CardOpening />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scoreboards" element={<ScoreBoards />} />
          <Route path="/profileData" element={<ProfileData/>} />
          <Route path="/modes" element={<Modes />} />
          <Route path="/knockout" element={<Knockout />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/team" element={<Selection />} />
          <Route path="/gamePlay" element={<ScoreCard />} />
          <Route path="/toss" element={<Toss />} />
          <Route path="/score" element={<Scorecard />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Box>
      <ToastContainer />
    </Container>
  );
}

export default App;
