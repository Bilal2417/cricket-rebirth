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
import { toast } from "react-toastify";
import LoadingPage from "../components/loading";

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

  const [loading, setLoading] = useState(true);
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem("ProfileVisited");
    fetch(`/.netlify/functions/saveProfile?profileId=${profileId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const profileData = {
            ...data.profile,
            img: data.profile.img || "/assets/img/pak.png",
          };
          setProfile(profileData);
          setName(profileData.name);
          if (isFirstVisit) {
            showDescToast("Profile Created Successfully !!");
            localStorage.setItem("ProfileVisited", "true");
          }
        }
      })
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = () => {
    setTempName(name);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const showDescToast = (desc) => {
    toast.success(desc, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrToast = (desc) => {
    toast.error(desc, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSave = async (newImg) => {
    if (!profile) return;

    const id = localStorage.getItem("MyId");
    if (!id) return console.error("No profile ID found");

    
    const updatedProfile = {
      ...profile,
      id: profileId,
      name: tempName || profile.name,
      img: newImg || profile.img,
      tournaments: profile.tournaments,
      trophies: profile.trophies,
      victories: profile.victories,
    };

    setProfile(updatedProfile);
    setName(tempName || name);
    setOpen(false);
    console.log(updatedProfile, "pppp");
    console.log(profileId, "oooo");
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
          showDescToast("Profile Updated Successfully !!");
        } else {
          showErrToast("Name already exist");
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

  // if (!profile) return <LoadingPage loading={loading} />;

  return (
    <>
      {showLoadingPage && (
        <LoadingPage
          loading={loading}
          onFinish={() => setShowLoadingPage(false)}
        />
      )}

      {!showLoadingPage && (
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
                color: "#fff",
                textAlign: "center",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Rubik , Poppins , sans-serif",
                clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
                "& .MuiOutlinedInput-input": {
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "1.2em",
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
          </Box>

          {/* Change Name Dialog */}
          <Dialog
            PaperProps={{
              sx: {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
            BackdropProps={{
              sx: { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
            open={open}
            onClose={handleClose}
          >
            <DialogTitle
              sx={{ color: "#FFFFFF", textAlign: "center", fontWeight: 600 }}
            >
              Change Name
            </DialogTitle>
            <DialogContent>
              <TextField
                sx={{
                  boxShadow: `
      inset 0px -8px 8px -4px #ffffff,   
      inset 0px 8px 8px -4px #c6cbda       
    `,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                }}
                autoFocus
                margin="dense"
                label="New Name"
                fullWidth
                value={tempName}
                inputProps={{ maxLength: 12 }}
                onChange={(e) => setTempName(e.target.value)}
                error={
                  tempName.length > 0 &&
                  (tempName.length < 3 || tempName.length > 10)
                }
                helperText={
                  tempName.length > 0 && tempName.length < 3
                    ? "Name must be at least 3 characters"
                    : tempName.length > 10
                    ? "Name cannot exceed 10 characters"
                    : ""
                }
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleSave()}
                sx={{
                  backgroundColor: "#0174fe",
                  color: "#FFFFFF",
                  fontFamily: "sans-serif",
                  width: "100%",
                  clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                  boxShadow: `
      inset 0px -8px 8px -4px #0248df,   
      inset 0px 8px 8px -4px #009aff       
    `,
                }}
                disabled={tempName.length < 3 || tempName.length > 10}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Stats */}
          <Grid container sx={{ margin: "20px 0" }}>
            {[
              {
                label: "Trophies",
                icon: (
                  <EmojiEventsTwoTone
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "none",
                      },
                      "& path:first-of-type": {
                        fill: "#FFD700",
                      },
                      "& path:last-of-type": {
                        fill: "#DAA520",
                      },
                    }}
                  />
                ),
                value: profile.trophies,
              },
              {
                label: "Victories",
                icon: (
                  <StarTwoTone
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "none",
                      },
                      "& path:first-of-type": {
                        fill: "#FFD700",
                      },
                      "& path:last-of-type": {
                        fill: "#DAA520",
                      },
                    }}
                  />
                ),
                value: profile.victories,
              },
              {
                label: "Tournaments",
                icon: (
                  <WhatshotTwoTone
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "none",
                      },
                      "& path:first-of-type": {
                        fill: "#FFD700",
                      },
                      "& path:last-of-type": {
                        fill: "#DAA520",
                      },
                    }}
                  />
                ),
                value: profile.tournaments,
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
                    fontFamily: "Rubik , Poppins , sans-serif",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Rubik , Poppins , sans-serif",
                    padding: "10px 70px",
                    backgroundColor: "#073575",
                    textAlign: "center",
                    borderRadius: 2,
                    fontWeight: 600,
                    color: "#fff",
                    display: "flex",
                    gap: 1,
                    clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
                  }}
                >
                  {stat.icon} {stat.value}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}
