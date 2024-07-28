import { createContext, useReducer } from "react";
import { pageReducer, pageInitialState } from "./pageReducer";
import { ChildrenProps, PageContextProps } from "../assets/types/postType";

export const PageContext = createContext<PageContextProps>({
  state: pageInitialState,
  dispatch: () => {},
});

export const PageContextProvider = ({ children }: ChildrenProps) => {
  const [state, dispatch] = useReducer(pageReducer, pageInitialState);

  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  );
};
