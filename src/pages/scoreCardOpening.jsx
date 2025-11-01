import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import Confetti from "react-confetti";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const flagGroups = [
  {
    value: 100,
    price: 2500,
    unlocks: [
      { country: "Pakistan", img: "/img/pak.png", key: "pak" },
      { country: "India", img: "/img/ind.png", key: "ind" },
      { country: "Sri Lanka", img: "/img/sri.png", key: "sri" },
      { country: "Bangladesh", img: "/img/ban.png", key: "ban" },
      { country: "West Indies", img: "/img/wi.png", key: "wi" },
    ],
  },
  {
    value: 200,
    price: 4000,
    unlocks: [
      { country: "South Africa", img: "/img/sa.png", key: "sa" },
      { country: "England", img: "/img/eng.png", key: "eng" },
      { country: "New Zealand", img: "/img/nz.png", key: "nz" },
      { country: "Australia", img: "/img/aus.png", key: "aus" },
    ],
  },
  {
    value: 300,
    price: 7500,
    unlocks: [
      { country: "World Cup 2019", img: "/img/wc19.png", key: "wc19" },
      { country: "World Cup 2021", img: "/img/wc21.png", key: "wc21" },
      { country: "World Cup 2022", img: "/img/wc22.png", key: "wc22" },
      { country: "World Cup 2024", img: "/img/wc24.png", key: "wc24" },
      { country: "Champions Trophy 2025", img: "/img/ct25.png", key: "ct25" },
    ],
  },
];

export default function ScoreCardOpening() {
  const navigate = useNavigate();
  const [show, setShow] = useState(() => {
    const val = sessionStorage.getItem("value");
    if (val) {
      return false;
    }
    return true;
  });
  const [groupValue, setGroupValue] = useState(null);

  useEffect(() => {
    const val = sessionStorage.getItem("value");
    if (!val) {
      navigate("/");
    }
    setGroupValue(Number(val));
  }, []);

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const updatedflags =
    flagGroups?.find((f) => f.value === groupValue)?.unlocks || [];

  const flags =
    updatedflags?.filter((f) => !Profile?.unlocked_items?.includes(f.key)) ||
    [];

  // useEffect(() => {
  //   if (flags?.length == 1) {
  //     const val = sessionStorage.getItem("value");
  //     const pack = localStorage.getItem("packs");
  //     const updatedPack = JSON.parse(pack || "[]");
  //     updatedPack.push(Number(val));
  //     localStorage.setItem("packs", JSON.stringify(updatedPack));
  //   }
  // }, [flags]);

  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [work, setWork] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const speedRef = useRef(10);
  const positionRef = useRef(0);
  const requestRef = useRef(null);
  const deceleratingRef = useRef(false);

  const itemWidth = 120;
  const totalWidth = flags?.length * itemWidth;
  const viewWidth = 450;
  const centerOffset = viewWidth / 2;

  const loop = () => {
    positionRef.current -= speedRef.current;

    if (positionRef.current <= -totalWidth) {
      positionRef.current += totalWidth;
    }

    const strip = document.getElementById("flags-strip");
    if (strip) strip.style.transform = `translateX(${positionRef.current}px)`;

    if (deceleratingRef.current) {
      speedRef.current *= 0.97;
      if (speedRef.current < 0.2) {
        finishSpin();
        return;
      }
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  const startSpin = () => {
    if (spinning) return;

    setShow(false);
    setSpinning(true);
    setShowConfetti(false);
    setSelected(null);

    speedRef.current = 20;
    deceleratingRef.current = false;

    requestRef.current = requestAnimationFrame(loop);

    setTimeout(() => {
      deceleratingRef.current = true;
    }, 2000 + Math.random() * 3500);
  };

  const finishSpin = async () => {
    cancelAnimationFrame(requestRef.current);

    // normalize position to positive
    const normalizedPosition =
      (((-positionRef.current + centerOffset) % totalWidth) + totalWidth) %
      totalWidth;

    const index = Math.floor(normalizedPosition / itemWidth) % flags?.length;

    const finalFlag = flags[index] || flags[0];

    setSelected(finalFlag);
    setShowConfetti(true);
    setSpinning(false);
    toast.success(`🎉 ${finalFlag.country} Unlocked!`);
    setShow(true);

    const unlockedFlagGroup = flagGroups.find((group) =>
      group.unlocks.some((flag) => flag.country === finalFlag?.country)
    );

    const updatedflag = unlockedFlagGroup?.unlocks.find(
      (f) => f.country === finalFlag?.country
    );

    const currentItems = Profile.unlocked_items || [];

    const updatedProfile = {
      ...Profile,
      id: Profile?.id,
      coins: Profile.coins - unlockedFlagGroup?.price,
      unlocked_items: [...currentItems, updatedflag?.key],
    };

    try {
      const res = await fetch("/.netlify/functions/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedProfile,
          source: "scoreCardOpening", // 👈 Add this line
        }),
      });

      const data = await res.json();
      if (data.success) {
        // setProfile(data.profile);
        console.log(data.profile);
        sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));

        const val = sessionStorage.getItem("value");

        const lockedFlags = flags.filter(
          (item) => !data?.profile?.unlocked_items?.includes(item.key)
        );

        if (lockedFlags.length === 0) {
          console.log("ALL unlocked");

          const existing = JSON.parse(localStorage.getItem("boardData")) || {};

          const existingValues = existing.values || [];

          if (!existingValues.includes(val)) {
            existingValues.push(val);
          }

          localStorage.setItem(
            "boardData",
            JSON.stringify({
              ...existing,
              values: existingValues,
            })
          );

          console.log("Updated boardData:", {
            ...existing,
            values: existingValues,
            allFlagsUnlocked: true,
          });
        }

        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        console.error("Failed to update tournaments in database:", data.error);
      }
    } catch (err) {
      console.error("Error updating tournaments:", err);
    }

    setWork(true);
    sessionStorage.removeItem("value");
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Toaster position="top-center" />
      {showConfetti && <Confetti recycle={false} numberOfPieces={800} />}

      <Typography variant="h5" color="white" sx={{ mb: 3 }}>
        {selected
          ? `${selected.country} Unlocked!`
          : spinning
          ? "Spinning..."
          : "Tap to Spin!"}
      </Typography>

      <Box
        sx={{
          width: `${viewWidth}px`,
          height: "150px",
          border: "3px solid white",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          bgcolor: "#111",
        }}
      >
        <Box
          id="flags-strip"
          sx={{
            display: "flex",
            willChange: "transform",
          }}
        >
          {[...flags, ...flags]?.map((flag, i) => (
            <Box
              key={i}
              sx={{
                minWidth: `${itemWidth}px`,
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid #333",
                background: "#1c1c1c",
              }}
            >
              <img
                src={flag.img}
                alt={flag.country}
                style={{
                  width: selected?.country === flag.country ? "100px" : "85px",
                  height: "auto",
                  filter:
                    selected?.country === flag.country
                      ? "drop-shadow(0 0 20px white)"
                      : "brightness(0.7)",
                  transition: "filter 0.3s, width 0.3s",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* golden marker */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "4px",
            height: "100%",
            background: "gold",
            zIndex: 5,
          }}
        />
      </Box>

      {show && !spinning ? (
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          disabled={!work}
          sx={{
            mt: 3,
            bgcolor: "#ff684d",
            color: "white",
            "&:hover": { bgcolor: "#ff684dff" },
          }}
        >
          Finish
        </Button>
      ) : (
        <Button
          onClick={startSpin}
          disabled={spinning}
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "gold",
            color: "black",
            "&:hover": { bgcolor: "#ffda4d" },
          }}
        >
          {spinning ? "Spinning..." : "Spin"}
        </Button>
      )}
    </Box>
  );
}
