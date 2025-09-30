import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ScoreCard24 from "./components/scr24";
import Scorecard from "./pages/Scorecard";
import { Box, Container } from "@mui/material";
import Selection from "./pages/selection";
import Toss from "./pages/Toss";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Modes from "./pages/Modes";
import Knockout from "./pages/Knockout";
import Fixtures from "./pages/Fixtures";

function App() {
  return (
    <Container sx={{
      height : "100vh",
      alignContent : "center"
    }}>

    <Router>

        <Box sx={{
          transform : { xs : "rotate(90deg)" , md : "none"},
          padding : { xs : "150px" , md : "0px"},
          width : "1150px"
        }}>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/modes" element={<Modes/>} />
        <Route path="/knockout" element={<Knockout/>} />
        <Route path="/fixtures" element={<Fixtures/>} />
        <Route path="/team" element={<Selection/>} />
        <Route path="/gamePlay" element={<ScoreCard24 />} />
        <Route path="/toss" element={<Toss />} />
        <Route path="/score" element={<Scorecard />} />
        <Route path="/result" element={<Result />} />
      </Routes>
        </Box>
    </Router>
    </Container>
  );
}

export default App;
