import { Box, Button, IconButton, Typography } from "@mui/material";
import CardPacksShop from "../components/card";
import { EmojiEventsSharp, Help } from "@mui/icons-material";

export default function Shop({ profile }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap:4,
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          p: 4,
          mt: 4,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        {/* Example Pack Cards */}
        <CardPacksShop />

        {/* World Cup Button */}
        <Button
          sx={{
            minWidth: "400px",
            borderRadius : "12px",
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
            boxShadow: `
              inset 0px -8px 8px -4px #262e40,   
              inset 0px 8px 8px -4px rgb(193 193 193)       
            `,            
            transition: "all 0.3s",
            ":hover": {
              transform: "scale(1.02)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Box>
            <Typography
              sx={{
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
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
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

            <Typography sx={{ fontWeight: 600 }} variant="h4">
              10 Teams, 1 Winner
            </Typography>
          </Box>
        </Button>
      </Box>
    </>
  );
}
