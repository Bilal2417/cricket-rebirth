import {
  Box,
  Button,
  CircularProgress,
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
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [titles, setTitles] = useState([]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [tempName, setTempName] = useState("");
  const [activeTitle, setActiveTitle] = useState();
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  // Generate ID if not exists
  let profileId = localStorage.getItem("MyId");
  if (!profileId) {
    profileId = nanoid();
    localStorage.setItem("MyId", profileId);
  }

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
          setTitles(profileData.titles);
          if (isFirstVisit) {
            toast.success("Profile Created Successfully !!");
            localStorage.setItem("ProfileVisited", true);
            localStorage.setItem("collectedStarter", true);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Update preview only, not save
      setProfile((prev) => ({ ...prev, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile) return;

    const profileId = localStorage.getItem("MyId");
    if (!profileId) return console.error("No profile ID found");

    setSave(true);

    const updatedProfile = {
      id: profileId,
      name: tempName || profile.name,
      img: profile.img,
      selected_title: activeTitle || profile.selected_title,
    };

    try {
      const res = await fetch("/.netlify/functions/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();

      if (data.success) {
        setSave(false);
        setProfile(data.profile);
        setName(data.profile.name);
        sessionStorage.setItem("Profile", JSON.stringify(data.profile));
        toast.success("Profile Updated Successfully!");
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const updateTitle = async (newTitle) => {
    if (!profile) return;

    const profileId = localStorage.getItem("MyId");
    if (!profileId) return console.error("No profile ID found");

    const updatedProfile = {
      id: profileId,
      selected_title: newTitle,
    };

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
          toast.success("Title Updated Successfully!");
        } else {
          toast.error(data.error || "Failed to update title");
        }
      })
      .catch((err) => console.error("Error updating title:", err));
  };

  const [save, setSave] = useState(false);

  return (
    <>
      {showLoadingPage && (
        <LoadingPage
          loading={loading}
          onFinish={() => setShowLoadingPage(false)}
        />
      )}

      {!showLoadingPage && profile && (
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "120px",
              position: "relative",
              ml: "50px",
            }}
          >
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
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <TextField
              value={tempName || name}
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

            <Box
              sx={{
                position: "absolute",
                left: "100%",
                top: 0,
                backgroundColor: "#073575",
                width: "200px",
                padding: "5px 20px",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                border: "2px solid #000000",
                borderRadius: "4px",
                boxShadow: "inset 0px -8px 8px -4px #2a3043",
                clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                color: "#ffffff",
                ":hover": { cursor: "pointer" },
              }}
              onClick={() => setShow(!show)}
            >
              <Typography sx={{ textAlign: "center" }} variant="h6">
                {profile?.selected_title || "Titles"}
              </Typography>

              {show &&
                profile?.titles?.map((title, index) => (
                  <Box
                    key={index}
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#343c53",
                      width: "90%",
                      padding: "5px 20px",
                      display: title.value == 0 ? "none" : "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      gap: "10px",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      boxShadow: "inset 0px -8px 8px -4px #2a3043",
                      clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
                      m: "50px 0",
                      color: "#ffffff",
                      ":hover": { cursor: "pointer" },
                    }}
                    onClick={(e) => {
                      setShow(false);
                      if (title.value >= 10) {
                        setActiveTitle(title.name);
                      } else {
                        toast.error("Win tournaments 10 times to unlock title");
                      }
                      // updateTitle(title);
                      e.stopPropagation();
                    }}
                  >
                    <Box
                      sx={{
                        display: title.value >= 10 ? "none" : "block",
                      }}
                      component="span"
                    >
                      {title.value}/10
                    </Box>
                    {title.name}
                  </Box>
                ))}
            </Box>
          </Box>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: "#0174fe",
              color: "#FFFFFF",
              fontFamily: "sans-serif",
              mt: 2,
              width: "100%",
              padding: "5px",
              clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0% 100%)",
              boxShadow: `
                inset 0px -8px 8px -4px #0248df,
                inset 0px 8px 8px -4px #009aff
              `,
            }}
            disabled={save}
          >
            {save ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Save Changes"
            )}
          </Button>

          {/* Change Name Dialog */}
          <Dialog
            PaperProps={{
              sx: { backgroundColor: "transparent", boxShadow: "none" },
            }}
            BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }}
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
                onClick={handleClose}
                // onClick={handleSave}
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
                icon: <EmojiEventsTwoTone />,
                value: profile.trophies,
              },
              {
                label: "Victories",
                icon: <StarTwoTone />,
                value: profile.victories,
              },
              {
                label: "World Cup",
                icon: <WhatshotTwoTone />,
                value: profile.tournaments,
              },
              {
                label: "KnockOut",
                icon: <WhatshotTwoTone />,
                value: profile.knockout,
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
