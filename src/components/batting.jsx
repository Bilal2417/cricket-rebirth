import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Batting(squad) {


  const batting = squad.data;
  const colors = {
    // wc19: "linear-gradient(to right , #e00244 20%, #222589 70%)",
    wc19: "#222589  ",
    wc21: "linear-gradient(to bottom , rgb(215 21 73) , rgb(233 25 85) ) ", 
    wc22: "#d71c59",//de265c 
    wc24: "#fa208e",//de265c 
    ct25: "#02c208",
    wtc: batting?.secondary,
  };

  const board = localStorage.getItem("Board");
  const location = useLocation()

  return (
    <>
      {batting?.players?.map((data, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: data.notout ? "#FFFFFF" : "#0f0648",
            background: data.notout ? colors[board] ||"rgb(65, 38, 255)" : "#FFFFFF",
            boxShadow: "0px 0px 9px -7px #000000",
            // borderRadius: data.notout ? "12px" : "0px",
            // padding: data.notout ? "0 5px" : "0px",
            // marginLeft: data.notout ? "-5px" : "0px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                // fontfamily: "Rubik",
                textTransform: "uppercase",
                padding: "0px 16px",
              }}
              variant="h6"
            >
              {data.name}
            </Typography>
            {data.out && location.pathname == "/score"? (
              <Box
                sx={{
                  // fontfamily: "Rubik",
                  fontWeight: 600,
                  color: data.notout ? "#FFFFFF" : "#0f0648",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "20px",
                  width: "100px",
                }}
              >
                b
                <Typography
                  sx={{
                    fontSize: "0.95em",
                  }}
                  variant="body1"
                >
                  {data.bowler}
                </Typography>
              </Box>
            ) : null}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                // fontfamily: "Rubik",
                textTransform: "uppercase",
                padding: { xs : "2px 16px" , md : "6px 16px"},
                boxShadow: "4px -4px 5px -3px #0003",
                width : "50px",
                textAlign : "center",
              }}
              variant="h6"
            >
              {data.score}
            </Typography>
            <Typography
              sx={{
                // fontfamily: "Rubik",
                textTransform: "uppercase",
                padding: "0px 20px",
                width : "50px",
                textAlign : "center",
              }}
              variant="body1"
            >
              {data.balls}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
