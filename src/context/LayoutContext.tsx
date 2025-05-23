import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { CustomToastProps } from "../components/models/common";
import CustomToast from "../components/Toast";

type ContextProps = {
  setToastInfo: Dispatch<SetStateAction<undefined | ToastInfo>>;
  theme: string;
  toggleTheme: () => void;
};
type ToastInfo = Partial<CustomToastProps>;
const LayoutContext = createContext<ContextProps | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastInfo, setToastInfo] = useState<ToastInfo>();
  const [theme, setTheme] = useState("light");
  const handleCloseToast = () => {
    setToastInfo((props) => ({ ...props, show: false }));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <LayoutContext.Provider value={{ setToastInfo, theme, toggleTheme }}>
      {children}
      {toastInfo && <CustomToast {...toastInfo} onClose={handleCloseToast} />}
    </LayoutContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("Cannot get context");
  }
  return context;
};
