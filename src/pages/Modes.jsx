import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OversThreeIcon from "../components/overIcon";
import {
  EmojiEventsSharp,
  Help,
  Lock,
  LockOutlined,
  Security,
} from "@mui/icons-material";
import { useState } from "react";
import { FaSkull } from "react-icons/fa";
import { GiSkullCrossedBones } from "react-icons/gi";

export default function Modes() {
  const navigate = useNavigate();

  const trophyMap = {
    1: 1,
    3: 3,
    5: 5,
    10: 10,
    20: 15,
    100: 5,
  };

  const overs = [
    {
      value: 1,
      wkt: 1,
    },
    {
      value: 3,
      wkt: 3,
    },
    {
      value: 5,
      wkt: 5,
    },
    {
      value: 10,
      wkt: 10,
    },
    {
      value: 20,
      wkt: 10,
    },
  ].map((over) => ({
    ...over,
    desc: (
      <span>
        This mode allows <strong>{over.wkt}</strong> wicket(s) in{" "}
        <strong>{over.value}</strong> over(s), with{" "}
        <strong>{trophyMap[over.value]}</strong> trophies gained or{" "}
        <strong>{Math.ceil(trophyMap[over.value] / 2)}</strong> trophies lost
        per game.
      </span>
    ),
  }));

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverDesc, setPopoverDesc] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const [unlocked, setUnlocked] = useState(
    () => !!Profile?.unlocked_items?.includes("worldcup")
  );

  const [unlockedKO, setUnlockedKO] = useState(
    () => !!Profile?.unlocked_items?.includes("knockout")
  );

  const [saved, setSaved] = useState(() => {
    const storedCup = localStorage.getItem("tournamentData");
    return storedCup ? true : false;
  });

  const handlePopoverOpen = (event, desc) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPopoverDesc(desc);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverDesc("");
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "20px",
          py: 8,
          px: 2,
        }}
      >
        <Button
          sx={{
            // fontfamily: "Rubik",
            backgroundColor: unlocked ? "#f5214b" : "#f55c73",
            color: unlocked ? "#FFFFFF" : "#a0a0a0",
            textShadow: `
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
            padding: "10px 40px",
            fontSize: "1.1em",
            transform: "skew(-20deg)",
            boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
            borderRadius: "4px",
            transition: "all 0.3s",
            overflow: "hidden",
            border: "2px solid black",
            ":hover": {
              transform: "scale(1.02)",
              cursor: unlocked ? "pointer" : "not-allowed",
            },
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={(e) => {
            if (unlocked) {
              navigate("/");
              localStorage.setItem("Overs", 10);
              sessionStorage.setItem("mode", `TOURNAMENT`);
            } else {
              handlePopoverOpen(e, <strong>Buy this item from shop</strong>);
            }
          }}
          // disabled={!saved}
        >
          <Box>
            {!unlocked && (
              <Lock
                sx={{
                  position: "absolute",
                  top: 10,
                  fontSize: 50,
                  color: "#000",
                }}
              />
            )}
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              variant="h5"
            >
              <EmojiEventsSharp />
              World Cup
              <IconButton
                type="button"
                onClick={(e) =>
                  handlePopoverOpen(
                    e,
                    <span>
                      In Tournament mode, each match is <strong>10</strong>{" "}
                      overs with <strong>10</strong> wickets.{" "}
                      <strong>All teams</strong> face each other, and the{" "}
                      <strong>strongest team</strong> wins the tournament.
                      <br />
                      <strong>REQUIRED : </strong>Teams higher than{" "}
                      <strong>BRONZE</strong> and not{" "}
                      <strong>NETHERLANDS</strong>
                    </span>
                  )
                }
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  backgroundColor: "#fa208e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#ff4eb0" },
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </IconButton>
            </Typography>
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
              }}
              variant={saved ? "h3" : "body1"}
            >
              {saved ? "Continue" : "10 Teams , 1 Winner"}
            </Typography>
          </Box>
        </Button>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(3,1fr)" },
            gap: "20px",
          }}
        >
          {overs.map((over, index) => {
            return (
              <Button
                key={index}
                sx={{
                  // fontfamily: "Rubik",
                  background: "linear-gradient(#60da01 , #90e100)",
                  color: "#FFFFFF",
                  textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                  overflow: "hidden",
                  padding: "10px 40px",
                  fontSize: "1.1em",
                  boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
                  borderRadius: "4px",
                  transition: "all 0.3s",
                  border: "2px solid black",
                  transform: "skew(-20deg)",
                  ":hover": {
                    transform: "scale(1.02)",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={() => {
                  navigate("/");
                  localStorage.setItem("Overs", over.value);
                  sessionStorage.setItem("mode", `${over.value} OVERS`);
                }}
              >
                <OversThreeIcon value={over.value} />
                Overs
                <IconButton
                  type="button"
                  onClick={(e) => handlePopoverOpen(e, overs[index].desc)}
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 32,
                    height: 32,
                    backgroundColor: "#fa208e",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#ff4eb0" },
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
                </IconButton>
              </Button>
            );
          })}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1, fontSize: "0.85em", width: "200px" }}>
              {popoverDesc}
            </Typography>
          </Popover>

          <Button
            sx={{
              // fontfamily: "Rubik",
              backgroundColor: "#8237ca",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "1.1em",

              transform: "skew(-20deg)",
              boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
              overflow: "hidden",
              borderRadius: "4px",
              transition: "all 0.3s",
              border: "2px solid black",
              ":hover": {
                transform: "scale(1.02)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={() => {
              navigate("/");
              localStorage.setItem("Overs", 100);
              sessionStorage.setItem("mode", `SURVIVAL`);
            }}
          >
            <GiSkullCrossedBones size={30} color="white" />
            Survival
            <IconButton
              type="button"
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  <span>
                    This mode allows only<strong>1</strong> wicket in{" "}
                    <strong>unlimited</strong> overs, with <strong>5</strong>{" "}
                    trophies gained or lost per game.
                  </span>
                )
              }
              sx={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 32,
                height: 32,
                backgroundColor: "#fa208e",
                color: "#fff",
                "&:hover": { backgroundColor: "#ff4eb0" },
                boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
              }}
            >
              <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
            </IconButton>
          </Button>
        </Box>
        <Button
          sx={{
            // fontfamily: "Rubik",
            backgroundColor: unlockedKO ? "#f47909" : "#d69153",
            color: unlockedKO ? "#FFFFFF" : "#a0a0a0",
            textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
            padding: "10px 40px",
            fontSize: "1.1em",
            transform: "skew(-20deg)",
            boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
            overflow: "hidden",
            borderRadius: "4px",
            transition: "all 0.3s",
            border: "2px solid black",
            ":hover": {
              transform: "scale(1.02)",
              cursor: unlocked ? "pointer" : "not-allowed",
            },
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={(e) => {
            if (unlocked) {
              navigate("/");
              localStorage.setItem("Overs", 10);
              sessionStorage.setItem("mode", `KNOCKOUT`);
            } else {
              handlePopoverOpen(e, <strong>Buy this item from shop</strong>);
            }
          }}
        >
          <Box>
            {!unlockedKO && (
              <Lock
                sx={{
                  position: "absolute",
                  top: 10,
                  fontSize: 50,
                  color: "#000",
                }}
              />
            )}
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              variant="h5"
            >
              <EmojiEventsSharp />
              Knockout
              <IconButton
                type="button"
                onClick={(e) =>
                  handlePopoverOpen(
                    e,
                    <span>
                      In Knockout mode, each match is <strong>10</strong> overs
                      with <strong>10</strong> wickets. All <strong>8</strong>{" "}
                      teams face each other, and the{" "}
                      <strong>undefeated team</strong> wins the tournament.
                      <br />
                      <strong>REQUIRED : </strong>Teams higher than{" "}
                      <strong>BRONZE</strong>
                    </span>
                  )
                }
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  backgroundColor: "#fa208e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#ff4eb0" },
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <Help sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </IconButton>
            </Typography>
            <Typography
              sx={{
                // fontfamily: "Rubik",
                fontWeight: 600,
              }}
              variant="body1"
            >
              8 Teams
            </Typography>
          </Box>
        </Button>
      </Box>
    </>
  );
}
