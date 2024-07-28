import {
  PageReducerActionType,
  PageReducerInitialStateProps,
} from "../assets/types/postType";

export const pageInitialState: PageReducerInitialStateProps = {
  page: "feed",
};

export const pageReducer = (
  state: PageReducerInitialStateProps,
  action: PageReducerActionType,
): PageReducerInitialStateProps => {
  switch (action.type) {
    case "FEED":
      return {
        page: "feed",
      };
    case "FRIEND":
      return {
        page: "friend",
      };
    case "LIKE":
      return {
        page: "like",
      };
    case "BOOKMARK":
      return {
        page: "bookmark",
      };
    default:
      return state;
  }
};
