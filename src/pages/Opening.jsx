import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Data from "../components/data";
import LoadingPage from "../components/loading";

const team = Data;

const pulledCards = [
  {
    value: 100,
    rarity: "Bronze",
    weight: 50,
    unlocks: [
      { type: "coins", resource: [50, 200] },
      { type: "trophy 2x", resource: [1, 3] },
      { type: "coins", resource: [50, 200] },
      { type: "trophy 2x", resource: [1, 3] },
      { type: "team", resource: [] },
    ],
  },
  {
    value: 200,
    rarity: "Silver",
    weight: 30,
    unlocks: [
      { type: "coins", resource: [100, 500] },
      { type: "trophy 2x", resource: [2, 5] },
      { type: "coins", resource: [100, 500] },
      { type: "trophy 2x", resource: [2, 5] },
      { type: "team", resource: [] },
    ],
  },
  {
    value: 300,
    weight: 15,
    rarity: "Gold",
    unlocks: [
      { type: "coins", resource: [200, 1000] },
      { type: "trophy 2x", resource: [3, 10] },
      { type: "coins", resource: [200, 1000] },
      { type: "trophy 2x", resource: [3, 10] },
      { type: "team", resource: [] },
    ],
  },
  {
    value: 400,
    rarity: "Legendary",
    weight: 5,
    unlocks: [
      { type: "coins", resource: [500, 2000] },
      { type: "trophy 2x", resource: [8, 20] },
      { type: "coins", resource: [500, 2000] },
      { type: "trophy 2x", resource: [8, 20] },
      { type: "team", resource: [] },
    ],
  },
];

function getWeightedRandomCard(cards) {
  const totalWeight = cards.reduce((sum, c) => sum + (c.weight || 1), 0);
  let random = Math.random() * totalWeight;

  for (const card of cards) {
    if (random < (card.weight || 1)) {
      return card;
    }
    random -= card.weight || 1;
  }

  return cards[0];
}

const updatedPulledCards = pulledCards.map((card) => {
  const relatedTeams = team
    .filter((team) => team.category === card.rarity)
    .map((t) => t.name);

  return {
    ...card,
    unlocks: card.unlocks.map((unlock) =>
      unlock.type === "team" && relatedTeams.length > 0
        ? { ...unlock, resource: relatedTeams }
        : unlock
    ),
  };
});

// console.log(updatedPulledCards);

const packData = {
  Starter: { title: "Starter Pack", size: 2, colors: ["#00b894", "#55efc4"] },
  Bronze: { title: "Bronze Pack", size: 3, colors: ["#8d5524", "#d2691e"] },
  Silver: { title: "Silver Pack", size: 5, colors: ["#bdc3c7", "#2c3e50"] },
  Gold: { title: "Gold Pack", size: 7, colors: ["#FFD700", "#FF8C00"] },
  Legendary: {
    title: "Legendary Pack",
    size: 10,
    colors: ["#7b4397", "#dc2430"],
  },
};

export default function CardOpening() {
  const { packKey } = useParams();
  const pack = packData[packKey];

  const [currentIndex, setCurrentIndex] = useState(0);

  const [rewards, setRewards] = useState(() => {
    const storedRewards = localStorage.getItem("rewards");
    return storedRewards ? JSON.parse(storedRewards) : [];
  });

  const [showSummary, setShowSummary] = useState(false);
  const [isAnimation, setIsAnimation] = useState(false);

  const handleNext = () => {
    if (isAnimation) return;
    if (currentIndex < pack.size - 1) {
      setIsAnimation(true);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const getRandomValue = (resource) => {
    if (!resource) return 0;
    const [min, max] = resource;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const storedProfile = sessionStorage.getItem("UserProfile");
  const [Profile, setProfile] = useState(
    storedProfile ? JSON.parse(storedProfile) : ""
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    const yes = sessionStorage.getItem("canOpen");
    if (!yes) return;
    setShow(true);

    if (rewards?.length > 0) return;
    if (!packKey) return;

    setCurrentIndex(0);
    const newRewards = [];
    const unlockedTeams = [...(Profile?.unlocked_teams || [])];

    const rarityMap = {
      Bronze: { required: 100, guarantee: null },
      Silver: { required: 200, guarantee: "Bronze" },
      Gold: { required: 300, guarantee: "Silver" },
      Legendary: { required: 400, guarantee: "Gold" },
      Starter: { required: 400, guarantee: "Any" },
    };

    const packTier = rarityMap[packKey];
    if (!packTier) return;
    let guaranteedReward = null;

    if (packTier?.guarantee === "Any") {
      const guaranteedCards = updatedPulledCards.filter(
        (card) => card.rarity !== packTier.guarantee
      );

      if (guaranteedCards.length > 0) {
        // const randomCard =
        //   guaranteedCards[Math.floor(Math.random() * guaranteedCards.length)];

        const randomCard = getWeightedRandomCard(guaranteedCards);

        const teamUnlocks = randomCard.unlocks.filter((u) => u.type === "team");

        if (teamUnlocks.length > 0) {
          const randomUnlock =
            teamUnlocks[Math.floor(Math.random() * teamUnlocks.length)];

          const possibleTeams = randomUnlock.resource.filter(
            (teamName) => !unlockedTeams?.includes(teamName)
          );

          if (possibleTeams.length > 0) {
            const randomTeam =
              possibleTeams[Math.floor(Math.random() * possibleTeams.length)];

            guaranteedReward = {
              ...randomCard,
              selectedUnlock: { ...randomUnlock, resource: randomTeam },
            };
          }
        }
      }
    } else if (packTier?.guarantee) {
      const guaranteedCards = updatedPulledCards.filter(
        (card) => card.rarity === packTier.guarantee
      );

      if (guaranteedCards.length > 0) {
        // const randomCard =
        //   guaranteedCards[Math.floor(Math.random() * guaranteedCards.length)];

        const randomCard = getWeightedRandomCard(guaranteedCards);
        console.log("Random", randomCard, "Guareanteed", guaranteedCards);
        const teamUnlocks = randomCard.unlocks.filter((u) => u.type === "team");

        if (teamUnlocks.length > 0) {
          const randomUnlock =
            teamUnlocks[Math.floor(Math.random() * teamUnlocks.length)];

          const possibleTeams = randomUnlock.resource.filter(
            (teamName) => !unlockedTeams?.includes(teamName)
          );

          if (possibleTeams.length > 0) {
            const randomTeam =
              possibleTeams[Math.floor(Math.random() * possibleTeams.length)];

            guaranteedReward = {
              ...randomCard,
              selectedUnlock: { ...randomUnlock, resource: randomTeam },
            };
          }
        }
      }
    }

    while (newRewards.length < pack.size - (guaranteedReward ? 1 : 0)) {
      const eligibleCards = updatedPulledCards.filter(
        (card) => card.value <= packTier.required
      );
      if (eligibleCards.length === 0) break;

      // const randomCard =
      //   eligibleCards[Math.floor(Math.random() * eligibleCards.length)];

      const randomCard = getWeightedRandomCard(eligibleCards);

      let unlock = null;

      if (randomCard.unlocks && randomCard.unlocks.length > 0) {
        const tryUnlock = (attempt = 0) => {
          if (attempt > 10) return null;

          const randomUnlockIndex = Math.floor(
            Math.random() * randomCard.unlocks.length
          );
          let u = randomCard.unlocks[randomUnlockIndex];

          if (u.type === "team") {
            const possibleTeams = (u.resource || []).filter(
              (teamName) => !unlockedTeams?.includes(teamName)
            );

            if (possibleTeams.length === 0) {
              return tryUnlock(attempt + 1);
            }

            const randomTeam =
              possibleTeams[Math.floor(Math.random() * possibleTeams.length)];

            unlockedTeams.push(randomTeam);
            return { ...u, resource: randomTeam };
          } else {
            return { ...u, resource: getRandomValue(u.resource) };
          }
        };

        unlock = tryUnlock();
      }

      newRewards.push({ ...randomCard, selectedUnlock: unlock });
    }

    if (guaranteedReward) {
      newRewards.push(guaranteedReward);
    }

    const updateProfile = async () => {
      let updatedProfile = { ...Profile };
      newRewards.forEach((rewards) => {
        if (rewards.selectedUnlock.type == "coins") {
          updatedProfile = {
            ...updatedProfile,
            id: Profile?.id || updatedProfile.id,
            coins: Profile.coins + rewards.selectedUnlock.resource,
          };
        } else if (rewards.selectedUnlock.type == "team") {
          const currentTeams = updatedProfile.unlocked_teams || [];
          const newTeam = rewards.selectedUnlock.resource;

          if (!currentTeams.includes(newTeam)) {
            updatedProfile = {
              ...updatedProfile,
              unlocked_teams: [...currentTeams, newTeam],
            };
          }
        } else if (rewards.selectedUnlock.type == "trophy 2x") {
          updatedProfile = {
            ...updatedProfile,
            trophydoubler:
              Profile.trophydoubler + rewards.selectedUnlock.resource,
          };
        }
      });

      try {
        updatedProfile.unlocked_teams = [
          ...new Set(updatedProfile.unlocked_teams),
        ];

        const res = await fetch("/.netlify/functions/updateProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
          console.log(data.profile);
          sessionStorage.setItem("UserProfile", JSON.stringify(data.profile));

          window.dispatchEvent(new Event("profileUpdated"));
        } else {
          console.error(
            "Failed to update tournaments in database:",
            data.error
          );
        }
      } catch (err) {
        console.error("Error updating tournaments:", err);
      }
    };

    updateProfile();

    console.log(newRewards, "✅ Final Rewards");
    localStorage.setItem("rewards", JSON.stringify(newRewards));
    setRewards(newRewards);
  }, [packKey, rewards]);

  const getCardBackground = (rarity) => {
    switch (rarity) {
      case "Bronze":
        return "linear-gradient(135deg, #8d5524, #d2691e)";
      case "Silver":
        return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      case "Gold":
        return "linear-gradient(135deg, #FFD700, #FF8C00)";
      case "Legendary":
        return "linear-gradient(135deg, #7b4397, #dc2430)";
      default:
        return "linear-gradient(135deg, #333, #111)";
    }
  };

  const nextReward = rewards[currentIndex + 1]?.selectedUnlock?.type == "team";
  const navigate = useNavigate();

  const selectedTeam = team.find(
    (t) => t.name === rewards[currentIndex]?.selectedUnlock?.resource
  );

  return (
    <>
      <Box
        onClick={!showSummary ? handleNext : undefined}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "none",
          overflow: "hidden",
          cursor: "pointer",
          flexDirection: "column",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        {!showSummary ? (
          <Box>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                onAnimationComplete={() => setIsAnimation(false)}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: 300,
                    height: 420,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                    color: "#fff",
                    background: getCardBackground(
                      rewards[currentIndex]?.rarity
                    ),
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {rewards[currentIndex]?.selectedUnlock?.type}
                  </Typography>
                  <Box
                    sx={{
                      width: 90,
                      height: 60,
                      display:
                        rewards[currentIndex]?.selectedUnlock?.type == "team"
                          ? "block"
                          : "none",
                    }}
                    src={selectedTeam?.flag}
                    component="img"
                  />
                  <Typography variant="h4" sx={{ fontWeight: "bold", m: 2 }}>
                    {rewards[currentIndex]?.selectedUnlock?.resource}
                  </Typography>
                  <Typography variant="h6" sx={{ letterSpacing: 1 }}>
                    {rewards[currentIndex]?.rarity}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
                    (Tap anywhere to reveal next)
                  </Typography>
                </Card>
              </motion.div>
            </AnimatePresence>
            <Box
              sx={{
                backgroundColor: "#d32323",
                borderRadius: "8px",
                padding: "4px 12px",
                color: "#FFFFFF",
                display: rewards.length - currentIndex - 1 > 0 ? "" : "none",
                width: "fit-content",
                margin: "50px 0 0 auto",
                boxShadow: nextReward
                  ? "0 0 15px 5px rgba(255,0,0,0.8), 0 0 30px 10px rgba(255,0,0,0.6)"
                  : "none",
                animation: nextReward ? "pulse 1.3s infinite" : "none",
                "@keyframes pulse": {
                  "0%": { boxShadow: "0 0 10px 3px rgba(255,0,0,0.6)" },
                  "50%": { boxShadow: "0 0 25px 10px rgba(255,0,0,1)" },
                  "100%": { boxShadow: "0 0 10px 3px rgba(255,0,0,0.6)" },
                },
              }}
            >
              {rewards.length - currentIndex - 1}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 3, color: "#fff" }}
            >
              🎉 All Collected Rewards 🎉
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 1, lg: 2 },
              }}
            >
              {rewards?.map((card, i) => {
                const matchTeam = team.find(
                  (t) =>
                    t.name === card?.selectedUnlock?.resource
                );
                return (
                  <Card
                    key={i}
                    sx={{
                      width: 160,
                      height: 240,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 3,
                      color: "#fff",
                      background: getCardBackground(card.rarity),
                      // boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                      boxShadow:
                        card?.selectedUnlock?.type == "team"
                          ? "0 0 15px 5px rgba(255,0,0,0.8), 0 0 30px 10px rgba(255,0,0,0.6)"
                          : "0 8px 30px rgba(0,0,0,0.4)",
                      animation:
                        card?.selectedUnlock?.type == "team"
                          ? "shine 1.3s infinite linear"
                          : "none",
                      "@keyframes shine": {
                        "0%": {
                          boxShadow: "0 0 10px 3px #ffffff30",
                          backgroundPosition: "-200% 0",
                        },
                        "50%": {
                          boxShadow: "0 0 25px 10px #ffffff90",
                          backgroundPosition: "200% 0",
                        },
                        "100%": {
                          boxShadow: "0 0 10px 3px #ffffff30",
                          backgroundPosition: "-200% 0",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {card?.selectedUnlock?.type}
                    </Typography>
                    <Box
                      sx={{
                        width: 75,
                        height: 50,
                        display:
                          card?.selectedUnlock?.type == "team"
                            ? "block"
                            : "none",
                      }}
                      src={matchTeam?.flag}
                      component="img"
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold", m: 2 }}>
                      {card?.selectedUnlock?.resource}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {card?.rarity}
                    </Typography>
                  </Card>
                );
              })}
            </Box>
            <Button
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#d32323",
                width: "200px",
                m: "20px 0",
              }}
              onClick={() => {
                // setRewards([]);
                setShowSummary(false);
                localStorage.removeItem("rewards");
                sessionStorage.removeItem("canOpen");
                setShow(false);
                navigate("/shop");
              }}
            >
              Finish
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
