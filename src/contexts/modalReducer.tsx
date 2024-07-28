import {
  ModalReducerActionType,
  ModalReducerInitialStateProps,
} from "../assets/types/postType";

export const modalInitialState: ModalReducerInitialStateProps = {
  name: "null",
  data: undefined,
};

export const modalReducer = (
  state: ModalReducerInitialStateProps,
  action: ModalReducerActionType,
) => {
  switch (action.type) {
    case "LOGOUT":
      return { name: "logout" };
    case "POSTDELETE":
      return { name: "postDelete", data: action.payload };
    case "USERDELETE":
      return { name: "userDelete" };
    case "VIEWPOST":
      return { name: "viewPost", data: action.payload };
    case "FOLLOWER":
      return { name: "follower" };
    case "FOLLOWING":
      return { name: "following" };
    case "INITIAL":
      return { name: "null", data: undefined };
    default:
      return state;
  }
};
