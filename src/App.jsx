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
import Log from "./pages/Log";
import Balatro from "./components/Balatro";
import Coins from "./pages/Coins";
import { supabase } from "./supabaseClient";
import CreateRoom from "./pages/createRoom";
import ScoreCardOnline from "./components/scoreOnline";

export const colors = {
  // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
  wc19: "#222589  ",
  wc21: "linear-gradient(to bottom , rgb(215 21 73) , rgb(233 25 85) ) ",
  wc22: "#d71c59", //de265c
  wc24: "#fa208e", //de265c
  ct25: "#02c208",
  // wtc: `linear-gradient(to bottom , ${batting?.secondary} , ${batting?.primary} )`,
  wtc: "#000",
};
function App() {
  useDisableBackButton();
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
  const [background, setBackground] = useState(false);

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

  useEffect(() => {
    const handleBackground = () => {
      const mode = sessionStorage.getItem("mode");
      if (mode == "CONTEST") {
        setBackground(true);
      }
    };
    handleBackground();
    window.addEventListener("contestBackground", handleBackground);
    return () =>
      window.removeEventListener("contestBackground", handleBackground);
  }, [location.pathname, finalist]);

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const profileId = localStorage.getItem("MyId");
    if (!profileId) return;

    const getProfile = async (userId) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) console.error(error);
      else setProfile(data);
    };
    getProfile(profileId);

    const handleProfileUpdate = () => {
      const updated = localStorage.getItem("UserProfile");
      if (updated) {
        setProfile(JSON.parse(updated));
        getProfile(profileId);
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

  const applyBackground =
    location.pathname == "/gamePlay" ||
    location.pathname == "/score" ||
    location.pathname == "/result" ||
    location.pathname == "/team" ||
    location.pathname == "/toss";

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
        {background && applyBackground ? (
          <Balatro
            spinRotation={-2.0}
            spinSpeed={10.0}
            color1="#8e0e2f"
            color2="#f5214b"
            color3="#000000"
            isRotate={true}
            mouseInteraction={false}
          />
        ) : (
          <MovingBallsBackground
            color={finalist ? "#111" : "white"}
            background={
              finalist
                ? "radial-gradient(circle, #b51c22,  #111 120%)"
                : "radial-gradient(circle, #1164ee 0%, #381daa 100%)"
            }
            speed={finalist ? 4 : 7}
          />
        )}
        <DisablePullToRefresh />
        {(location.pathname === "/" || location.pathname === "/shop") && (
          <Navbar profile={profile} />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/increment" element={<Coins />} />
          <Route path="/createRoom" element={<CreateRoom />} />
          <Route path="/battle-log" element={<Log />} />
          <Route path="/scoreBoardOpening" element={<ScorecardWheel />} />
          <Route path="/shop" element={<Shop profile={profile} />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/open-pack/:packKey" element={<CardOpening />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scoreboards" element={<ScoreBoards />} />
          <Route path="/profileData" element={<ProfileData />} />
          <Route path="/modes" element={<Modes />} />
          <Route path="/knockout" element={<Knockout />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/team" element={<Selection />} />
          <Route path="/gamePlay" element={<ScoreCard />} />
          <Route path="/gamePlayOnline" element={<ScoreCardOnline />} />
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
