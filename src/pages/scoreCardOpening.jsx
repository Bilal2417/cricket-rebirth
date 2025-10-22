import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import Confetti from "react-confetti";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const flagGroups = [
  {
    value: 100,
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
    unlocks: [
      { country: "South Africa", img: "/img/sa.png", key: "sa" },
      { country: "England", img: "/img/eng.png", key: "eng" },
      { country: "New Zealand", img: "/img/nz.png", key: "nz" },
      { country: "Australia", img: "/img/aus.png", key: "aus" },
    ],
  },
  {
    value: 300,
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
  useEffect(() => {
    const val = localStorage.getItem("value");
    if (!val) {
      navigate("/");
    }
    setGroupValue(Number(val));
  }, []);

  const [groupValue, setGroupValue] = useState(null);
  const flags = flagGroups.find((f) => f.value === groupValue)?.unlocks || [];

  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const speedRef = useRef(8);
  const positionRef = useRef(0);
  const requestRef = useRef(null);
  const deceleratingRef = useRef(false);

  const itemWidth = 120;
  const totalWidth = flags.length * itemWidth;
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
      if (speedRef.current < 0.5) {
        finishSpin();
        return;
      }
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  const startSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setShowConfetti(false);
    setSelected(null);

    speedRef.current = 20;
    deceleratingRef.current = false;

    requestRef.current = requestAnimationFrame(loop);

    setTimeout(() => {
      deceleratingRef.current = true;
    }, 1500 + Math.random() * 3500);
  };

  const finishSpin = () => {
    cancelAnimationFrame(requestRef.current);

    // normalize position to positive
    const normalizedPosition =
      (((-positionRef.current + centerOffset) % totalWidth) + totalWidth) %
      totalWidth;

    const index = Math.floor(normalizedPosition / itemWidth) % flags.length;

    const finalFlag = flags[index] || flags[0];

    setSelected(finalFlag);
    setShowConfetti(true);
    setSpinning(false);

    localStorage.removeItem("value");

    toast.success(`🎉 ${finalFlag.country} Unlocked!`);
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
          {[...flags, ...flags].map((flag, i) => (
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

      <Button
        onClick={startSpin}
        disabled={spinning}
        variant="contained"
        sx={{
          display: () => {
            const val = localStorage.getItem("value");
            if (!val) {
             return "none"
            } else {
             return "block"
            }
          },
          mt: 3,
          bgcolor: "gold",
          color: "black",
          "&:hover": { bgcolor: "#ffda4d" },
        }}
      >
        {spinning ? "Spinning..." : "Spin"}
      </Button>
    </Box>
  );
}
