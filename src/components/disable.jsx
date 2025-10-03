import { useEffect } from "react";

export default function DisablePullToRefresh() {
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const touchCurrentY = e.touches[0].clientY;
      const scrollTop = document.scrollingElement.scrollTop || 0;

      // If at top and swiping down, prevent default (pull-to-refresh)
      if (scrollTop === 0 && touchCurrentY > touchStartY) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}
