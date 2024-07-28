import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { MenuContext } from "../../contexts/menuContext";
import { DarkModeContext } from "../../contexts/darkModeContext";
import { ModalContext } from "../../contexts/modalContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { MenuReducerInitialStateProps } from "../../assets/types/postType";

interface Props {
  state: MenuReducerInitialStateProps;
}

const Menu = ({ state }: Props) => {
  const { darkMode, toggleHandler } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");
  const { dispatch } = useContext(MenuContext);
  const { dispatch: modalDispatch, setModalOpen } = useContext(ModalContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div
        className={`${state.menu === "menu" ? "scale-100" : "scale-0"} absolute right-0 top-14 flex h-56 w-52 origin-top-right flex-col gap-2 rounded-lg border bg-white transition-all duration-300 dark:bg-neutral-700`}
      >
        <div className="m-1.5 flex items-center gap-2 rounded-full bg-purple-100 p-1 dark:bg-neutral-500">
          <img
            className="h-8 w-8 rounded-full border bg-white object-cover"
            src={
              userProfile && userProfile.userInfo.photoURL
                ? userProfile?.userInfo.photoURL
                : person
            }
            alt=""
          />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold dark:text-white">
            {userProfile?.userInfo.displayName}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          <Link
            onClick={() => dispatch({ type: "INITIAL" })}
            to={`/profile/${currentUser.uid}`}
            className="group flex w-full justify-end border-purple-500 p-2 text-lg transition-all duration-300 hover:border-r-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400"
          >
            <p className="group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
              Profile
            </p>
          </Link>
          <li
            className="group flex w-full cursor-pointer items-center justify-between border-purple-500 p-2 transition-all duration-300 hover:border-r-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400"
            onClick={toggleHandler}
          >
            <div className="relative flex items-center">
              <div
                className={`relative flex h-5 w-10 items-center justify-center rounded-full bg-transparent ${darkMode ? "bg-gradient-to-tr from-blue-950 via-blue-500 to-sky-500" : "bg-gradient-to-tl from-purple-950 via-red-500 to-white"}`}
              >
                <div className="absolute h-3 w-8 rounded-full bg-white" />
              </div>
              <div
                className={`absolute flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 ${darkMode ? "ml-4 bg-gradient-to-tr from-blue-950 via-blue-500 to-sky-500" : "left-0 bg-gradient-to-tl from-purple-950 via-red-500 to-white"}`}
              >
                <FontAwesomeIcon
                  icon={darkMode ? faMoon : faSun}
                  className="text-white"
                />
              </div>
            </div>
            <p className="text-lg group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
              Dark Mode
            </p>
          </li>
          <li
            className="group flex w-full cursor-pointer justify-end border-purple-500 p-2 text-lg transition-all duration-300 hover:border-r-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400"
            onClick={() => {
              setModalOpen(true);
              dispatch({ type: "INITIAL" });
              modalDispatch({ type: "LOGOUT" });
            }}
          >
            <p className="text-lg group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
              Log out
            </p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
