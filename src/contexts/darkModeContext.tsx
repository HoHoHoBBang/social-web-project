import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ChildrenProps } from "../assets/types/postType";

interface DarkModeContextProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleHandler: () => void;
}

export const DarkModeContext = createContext<DarkModeContextProps>({
  darkMode: false,
  setDarkMode: () => {},
  toggleHandler: () => {},
});

export const DarkModeContextProvider = ({ children }: ChildrenProps) => {
  const { currentUser } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const getModeData = async () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        const data = doc.data();

        if (data) {
          setDarkMode(data.dark);

          if (data.dark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      });

      return () => {
        unsub();
      };
    };

    getModeData();
  }, [currentUser]);

  const toggleHandler = async () => {
    if (currentUser) {
      const modeDataRef = await getDoc(doc(db, "users", currentUser.uid));
      const data = modeDataRef.data();

      if (data) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          dark: !data.dark,
        });
      }
    }
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleHandler }}>
      {children}
    </DarkModeContext.Provider>
  );
};
