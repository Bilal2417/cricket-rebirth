import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OversThreeIcon from "../components/overIcon";
import { EmojiEventsSharp, Security } from "@mui/icons-material";

export default function Modes() {
  const navigate = useNavigate();

  const overs = [
    {
      value: 1,
    },
    {
      value: 3,
    },
    {
      value: 5,
    },
    {
      value: 10,
    },
    {
      value: 20,
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
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
            gridTemplateColumns: "repeat(3,1fr)",
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
              </Button>
            );
          })}
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
            <Security />
            Survival
          </Button>
        </Box>
      </Box>
    </>
  );
}
