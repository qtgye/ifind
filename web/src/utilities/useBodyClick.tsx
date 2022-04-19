import { useCallback } from "react";

const useBodyClick = () => {
  const handleBodyClick = useCallback((callback: EventListener) => {
    document.body.addEventListener("click", callback);
  }, []);

  return handleBodyClick;
};

export default useBodyClick;
