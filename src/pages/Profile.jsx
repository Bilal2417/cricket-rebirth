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
import {
  ArrowBackIosNew,
  EmojiEventsTwoTone,
  StarTwoTone,
  WhatshotTwoTone,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  let profileId = localStorage.getItem("MyId");
  if (!profileId) {
    profileId = nanoid();
    localStorage.setItem("MyId", profileId);
  }
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [tempName, setTempName] = useState("");

  // Fetch profile on page load
  useEffect(() => {
    fetch("/.netlify/functions/saveProfile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const profileData = {
            ...data.profile,
            img: data.profile.img || "/assets/img/pak.png",
          };
          setProfile(profileData);
          setName(profileData.name);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // Background styling
  useEffect(() => {
    if (location.pathname === "/profile") {
      document.body.style.background =
        "radial-gradient(circle, #1164ee 0%, #381daa 100%)";
    }
  }, [location]);

  // Dialog handlers
  const handleOpen = () => {
    setTempName(name);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Save updated profile (name or image)
  const handleSave = async (newImg) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      id: localStorage.getItem("MyId"),
      name: tempName,
      img: newImg || profile.img,
      win_streak: profile.win_streak,
      trophies: profile.trophies,
      victories: profile.victories,
    };

    setProfile(updatedProfile);
    setName(tempName);
    setOpen(false);

    // Update in database
    fetch("/.netlify/functions/updateProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
          sessionStorage.setItem("Profile", JSON.stringify(data.profile));
        }
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  // Image upload handlers
  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleSave(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  if (!profile) return null; // loading

  return (
    <Box sx={{ width: "fit-content", margin: "auto" }}>
      {/* Back Button */}
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
          ":hover": { cursor: "pointer" },
        }}
        onClick={() => navigate("/")}
      >
        <ArrowBackIosNew sx={{ color: "#FFFFFF" }} />
      </Box>

      {/* Profile Image & Name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Box
          component="img"
          src={profile.img}
          alt="profile"
          sx={{
            width: 120,
            height: 120,
            border: "4px solid #000",
            borderRadius: 2,
            objectFit: "cover",
            "&:hover": { cursor: "pointer" },
          }}
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
          value={name}
          onClick={handleOpen}
          readOnly
          sx={{
            padding: "10px 60px",
            backgroundColor: "#313c64",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            textTransform: "uppercase",
            cursor: "pointer",
            "& .MuiOutlinedInput-input": {
              textAlign: "center",
              fontWeight: "bold",
              color: "#fff",
            },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        />
      </Box>

      {/* Change Name Dialog */}
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
          <Button onClick={() => handleSave()} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stats */}
      <Grid container sx={{ margin: "20px 0" }}>
        {[
          {
            label: "Trophies",
            icon: <EmojiEventsTwoTone />,
            value: profile.trophies,
          },
          {
            label: "Victories",
            icon: <StarTwoTone />,
            value: profile.victories,
          },
          {
            label: "Win Streak",
            icon: <WhatshotTwoTone />,
            value: profile.win_streak,
          },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              m: 1,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                WebkitTextStroke: "1px black",
                fontSize: "1.4em",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                padding: "10px 70px",
                backgroundColor: "#073575",
                textAlign: "center",
                borderRadius: 2,
                fontWeight: 600,
                color: "#fff",
                display: "flex",
                gap: 1,
              }}
            >
              {stat.icon} {stat.value}
            </Typography>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
