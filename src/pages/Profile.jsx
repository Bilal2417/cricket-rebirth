import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import photo from "../assets/img/pak.png";
import localforage from "localforage";
import {
  ArrowBack,
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  StarTwoTone,
  WhatshotTwoTone,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileData from "../components/profileData";

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  
  const [profile, setProfile] = useState(ProfileData);
  const [name, setName] = useState(ProfileData?.name);

  useEffect(() => {
    fetch("/.netlify/functions/saveProfile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
          setName(data.profile.name);
        }
      });
  }, []);

  useEffect(() => {
    if (location.pathname === "/profile") {
      document.body.style.background =
        "radial-gradient(circle, #1164ee 0%, #381daa 100%)";
    }

    const loadProfile = async () => {
      const data = await localforage.getItem("profileData");
      if (data) {
        setProfile(data);
      }
    };

    loadProfile();
  }, []);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Img = reader.result;

        const updatedProfile = { ...profile, img: base64Img };

        setProfile(updatedProfile);

        localforage.setItem("profileData", updatedProfile);
      };
      reader.readAsDataURL(file);
    }
  };

  const [open, setOpen] = useState(false);
  const [tempName, setTempName] = useState(profile?.name);

  const handleOpen = () => {
    setTempName(name);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    setName(tempName);
    setOpen(false);

    const updatedProfile = { ...profile, name: tempName };
    localforage.setItem("profileData", updatedProfile);

    console.log("Saved name:", tempName);
  };

  return (
    <>
      <Box
        sx={{
          width: "fit-content",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#343c53",
            width: "fit-content",
            padding: "5px 20px",
            display: "flex",
            alignContent: "center",
            border: "2px solid #000000",
            borderRadius: "4px",
            boxShadow: "inset 0px -8px 8px -4px #2a3043",
            clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
            m: "50px 0",
            color: "#ffffff",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => navigate("/")}
        >
          <ArrowBackIosNew sx={{ color: "#FFFFFF" }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            component="img"
            sx={{
              width: "120px",
              height: "120px",
              border: "4px solid #000000",
              borderRadius: "8px",
              objectFit: "cover",
              objectPosition: "center",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            src={profile?.img}
            alt="profile-photo"
            onClick={handleImageClick}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <TextField
            sx={{
              padding: "10px 60px",
              backgroundColor: "#313c64",
              textAlign: "center",
              width: "fit-content",
              borderRadius: "4px",
              clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
              fontWeight: 600,
              color: "#ffffff",
              textTransform: "uppercase",
              cursor: "pointer",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "none",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "none",
                },
              "& input": {
                color: "#ffffff",
                fontWeight: 600,
                textAlign: "center",
                textTransform: "uppercase",
                cursor: "pointer",
              },
            }}
            readOnly
            value={name}
            onClick={handleOpen}
            variant="outlined"
          />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Change Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New Name"
                fullWidth
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Grid
          container
          sx={{
            margin: "20px 0",
          }}
          xs={6}
          sm={4}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography
              sx={{
                color: "#c8c8d5",
                WebkitTextStroke: "1px black",
                WebkitTextFillColor: "white",
                fontSize: "1.4em",
                fontWeight: 900,
                fontFamily: "Rubik",
                textTransform: "uppercase",
              }}
              variant="body1"
            >
              Trophies
            </Typography>
            <Typography
              sx={{
                padding: "10px 70px",
                backgroundColor: "#073575",
                textAlign: "center",
                width: "fit-content",
                borderRadius: "4px",
                clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                fontWeight: 600,
                color: "#FFFFFF",
                display: "flex",
                gap: "10px",
                fontFamily: "Rubik",
              }}
              variant="body1"
            >
              <EmojiEventsTwoTone
                sx={{
                  "& .MuiSvgIcon-root": {
                    fill: "none",
                  },
                  "& path:first-of-type": { fill: "#FFD700" },
                  "& path:last-of-type": { fill: "#DAA520" },
                }}
              />
              {profile?.records?.trophies}{" "}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                WebkitTextStroke: "1px black",
                WebkitTextFillColor: "white",
                fontSize: "1.4em",
                fontWeight: 900,
                fontFamily: "Rubik",
                textTransform: "uppercase",
              }}
              variant="body1"
            >
              Victories
            </Typography>
            <Typography
              sx={{
                padding: "10px 70px",
                backgroundColor: "#073575",
                textAlign: "center",
                width: "fit-content",
                borderRadius: "4px",
                clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "Rubik",
                display: "flex",
                gap: "10px",
              }}
              variant="body1"
            >
              <StarTwoTone
                sx={{
                  "& path:first-of-type": { fill: "#FFD700" },
                  "& path:last-of-type": { fill: "#DAA520" },
                }}
              />
              {profile?.records?.victories}{" "}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                WebkitTextStroke: "1px black",
                WebkitTextFillColor: "white",
                fontSize: "1.4em",
                fontWeight: 900,
                fontFamily: "Rubik",
                textTransform: "uppercase",
              }}
              variant="body1"
            >
              Win Streak
            </Typography>
            <Typography
              sx={{
                padding: "10px 70px",
                backgroundColor: "#073575",
                textAlign: "center",
                width: "fit-content",
                fontFamily: "Rubik",
                borderRadius: "4px",
                clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                fontWeight: 600,
                color: "#FFFFFF",
                display: "flex",
                gap: "10px",
              }}
              variant="body1"
            >
              {" "}
              <WhatshotTwoTone
                sx={{
                  "& .MuiSvgIcon-root": { color: "#fc3927" },
                  "& path:first-of-type": { fill: "#dffe00" },
                  "& path:last-of-type": { fill: "#fc3927" },
                }}
              />
              {profile?.records?.winStreak}{" "}
            </Typography>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
