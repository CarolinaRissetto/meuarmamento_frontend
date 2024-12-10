import { useEffect, useRef } from "react";

interface UseAutoSaveProps {
  isFilled: boolean;
  isDirty: boolean;
  isOpen: boolean;
  hasMounted: React.MutableRefObject<boolean>;
  processoId: string | null;
  fecharSessaoPreenchida: () => void;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

 const useAutoSave = ({
  isFilled,
  isDirty,
  isOpen,
  hasMounted,
  processoId,
  fecharSessaoPreenchida,
  setSnackbarOpen,
  setIsDirty
}: UseAutoSaveProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFilled && isDirty && isOpen && hasMounted.current && processoId) {

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fecharSessaoPreenchida();
        setSnackbarOpen(true);
        setIsDirty(false);
      }, 2500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isFilled, isDirty, isOpen, hasMounted, processoId, fecharSessaoPreenchida, setSnackbarOpen, setIsDirty]);
};

export default useAutoSave;
