import { useState } from "react";

const useDrawer = () => {
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return { openDrawer, closeDrawer, open };
};

export default useDrawer;
