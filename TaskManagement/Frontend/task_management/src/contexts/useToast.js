import { useContext } from "react";
import { ToastContext } from "./ToastContext";


const TOAST_REMOVE_DELAY = 5000;

function useToast() {
    const context = useContext(ToastContext);

    if (context === undefined) {
      throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
export {useToast, TOAST_REMOVE_DELAY};
