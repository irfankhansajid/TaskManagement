import { createContext,  useCallback } from "react";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export const ToastContext = createContext({
  toast: () => {},
});

export function ToastProvider({ children }) {
  const { toast } = useShadcnToast();

  const showToast = useCallback((props) => {
    toast(props);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
    </ToastContext.Provider>
  );
}