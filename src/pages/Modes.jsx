import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OversThreeIcon from "../components/overIcon";
import { EmojiEventsSharp, Help, Security } from "@mui/icons-material";
import { useState } from "react";
import { FaSkull } from "react-icons/fa";        
import { GiSkullCrossedBones } from "react-icons/gi"; 

export default function Modes() {
  const navigate = useNavigate();

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
        <strong>{Math.ceil(over.value / 2)}</strong> trophies gained or lost per
        game.
      </span>
    ),
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverDesc, setPopoverDesc] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

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
          py: 8,
          px: 2,
        }}
      >
        <Button
          sx={{
            fontFamily: "Rubik",
            backgroundColor: "#f47909",
            color: "#FFFFFF",
            textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
            padding: "10px 40px",
            fontSize: "1.1em",
            position: "relative",
            px: 4,
            py: 1.5,
            overflow: "hidden",
            clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
            boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
            borderRadius: "4px",
            transition: "all 0.3s",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              border: "2px solid black",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              pointerEvents: "none",
            },
            ":hover": {
              transform: "scale(1.02)",
            },
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={() => {
            navigate("/");
            localStorage.setItem("Overs", 10);
            sessionStorage.setItem("mode", `KNOCKOUT`);
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Rubik",
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
                      In Tournament mode, each match is <strong>10</strong>{" "}
                      overs with <strong>10</strong>{" "}
                      wickets. All <strong>8</strong> teams face each other, and
                      the <strong>undefeated team</strong> wins the tournament.
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
                fontFamily: "Rubik",
                fontWeight: 600,
              }}
              variant="body1"
            >
              8 Teams
            </Typography>
          </Box>
        </Button>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs : "repeat(2,1fr)" , md : "repeat(3,1fr)"},
            gap: "20px",
          }}
        >
          {overs.map((over, index) => {
            return (
              <Button
                key={index}
                sx={{
                  fontFamily: "Rubik",
                  background: "linear-gradient(#60da01 , #90e100)",
                  color: "#FFFFFF",
                  textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
                  padding: "10px 40px",
                  fontSize: "1.1em",
                  position: "relative",
                  px: 4,
                  py: 1.5,
                  overflow: "hidden",
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                  boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
                  borderRadius: "4px",
                  transition: "all 0.3s",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    border: "2px solid black",
                    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                    pointerEvents: "none",
                  },
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
              fontFamily: "Rubik",
              backgroundColor: "#f5214b",
              color: "#FFFFFF",
              textShadow: `
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           2px  1.5px 0 #000
        `,
              padding: "10px 40px",
              fontSize: "1.1em",
              position: "relative",
              px: 4,
              py: 1.5,
              overflow: "hidden",
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
              boxShadow: `
      inset 0px -8px 8px -4px #262e40,   
      inset 0px 8px 8px -4px rgb(193 193 193)       
    `,
              borderRadius: "4px",
              transition: "all 0.3s",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                border: "2px solid black",
                clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
                pointerEvents: "none",
              },
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
      </Box>
    </>
  );
}
