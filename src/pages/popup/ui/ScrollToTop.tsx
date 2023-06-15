import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const { key } = useLocation();

  useLayoutEffect(() => {
    const main = document.querySelector("#main");
    const scroll = () => {
      scrollPositions.set(key, main?.scrollTop ?? 0);
    };
    main?.addEventListener("scroll", scroll);
    return () => main?.removeEventListener("scroll", scroll);
  }, [key]);

  useLayoutEffect(() => {
    const savedPosition = scrollPositions.get(key);
    requestAnimationFrame(() => {
      setTimeout(() => {
        document
          .querySelector("#main")
          ?.scroll({ top: savedPosition, behavior: "auto" });
        scrollPositions.delete(key);
      }, 30);
    });
  }, [key]);

  return null;
};

export default ScrollToTop;
