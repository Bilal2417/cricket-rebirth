import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useDisableBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const restrictedPaths = [
      "/toss",
      "/gamePlay",      
      "/scoreBoardOpening",
      "/fixtures",
      "/shop",
      "/knockout",
      "/open-pack",
    ];

    const isRestricted =
      restrictedPaths.some((path) => location.pathname.startsWith(path)) ||
      (location.pathname === "/" || location.pathname === "/score");

    if (isRestricted) {
      // Push dummy history state so the user can't go back
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        toast.error("Back navigation is disabled!");
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [location.pathname]);
}
