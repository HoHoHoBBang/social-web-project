import {
  MenuReducerActionType,
  MenuReducerInitialStateProps,
} from "../assets/types/postType";

export const MenuInitialState: MenuReducerInitialStateProps = {
  menu: "null",
};

export const menuReducer = (
  state: MenuReducerInitialStateProps,
  action: MenuReducerActionType,
): MenuReducerInitialStateProps => {
  switch (action.type) {
    case "FRIEND":
      return {
        menu: "friend",
      };
    case "LIKE":
      return {
        menu: "like",
      };
    case "CHAT":
      return {
        menu: "chat",
      };
    case "MENU":
      return {
        menu: "menu",
      };
    case "INITIAL":
      return {
        menu: "null",
      };
    default:
      return state;
  }
};
