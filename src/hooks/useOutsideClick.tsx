import { useEffect } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  isOpen: boolean,
  callback: () => void,
) => {
  useEffect(() => {
    const handleOutsideClicks = (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as Node)) callback();
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };

    const addListeners = () => {
      document.addEventListener("mousedown", handleOutsideClicks);
      document.addEventListener("keydown", handleEscapeKey);
    };

    const removeListeners = () => {
      document.removeEventListener("mousedown", handleOutsideClicks);
      document.removeEventListener("keydown", handleEscapeKey);
    };

    if (isOpen) {
      addListeners();
    } else {
      removeListeners();
    }

    return () => removeListeners();
  }, [ref, callback, isOpen]);
};

export default useOutsideClick;
