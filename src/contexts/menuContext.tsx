import React, { createContext, useReducer } from "react";
import { MenuInitialState, menuReducer } from "./menuReducer";
import { ChildrenProps, MenuContextProps } from "../assets/types/postType";

export const MenuContext = createContext<MenuContextProps>({
  state: MenuInitialState,
  dispatch: () => {},
});

export const MenuContextProvider = ({ children }: ChildrenProps) => {
  const [state, dispatch] = useReducer(menuReducer, MenuInitialState);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
};
