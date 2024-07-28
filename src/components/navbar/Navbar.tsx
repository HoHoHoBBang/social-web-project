import {
  faBars,
  faBell,
  faMessage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MenuContext } from "../../contexts/menuContext";
import useGetNotification from "../../hooks/useGetNotification";
import Notifications from "./Notifications";
import Menu from "./Menu";
import ChatNotifications from "./ChatNotifications";
import { PageContext } from "../../contexts/pageContext";
import Search from "./Search";
import { EditProfileContext } from "../../contexts/editProfileContext";
import { NotificationProps, UserChatProps } from "../../assets/types/postType";

const Navbar = () => {
  const { state, dispatch } = useContext(MenuContext);

  const { dispatch: pageDispatch } = useContext(PageContext);
  const { setEdit } = useContext(EditProfileContext);

  const { notification, chatNotification } = useGetNotification();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        dispatch({ type: "INITIAL" });
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [dispatch]);

  return (
    <div className="fixed z-[5] flex h-14 w-full bg-purple-500 px-2 dark:bg-neutral-800">
      <div className="flex-[2] max-sm:flex-1">
        <div className="flex h-full items-center justify-center">
          <Link
            to="/"
            className=""
            onClick={() => {
              pageDispatch({ type: "FEED" });
              setEdit(false);
            }}
          >
            <p className="text-4xl font-bold text-white max-sm:text-xl">
              LOGO<span className="text-yellow-500">.</span>
            </p>
          </Link>
        </div>
      </div>

      <div className="flex-[6]">
        <Search />
      </div>

      <div className="flex flex-[2] max-sm:flex-1" ref={menuRef}>
        <div className="flex h-full w-full justify-around gap-5 max-sm:gap-0">
          <div className="flex gap-5">
            <div className="relative flex h-full cursor-pointer flex-col justify-center max-sm:hidden">
              <div
                className="relative flex h-full items-center"
                onClick={() =>
                  state.menu === "friend"
                    ? dispatch({ type: "INITIAL" })
                    : dispatch({ type: "FRIEND" })
                }
              >
                <FontAwesomeIcon
                  className="h-6 w-6 rounded-lg bg-purple-300 p-1 duration-300 hover:scale-110 hover:bg-purple-400 dark:bg-neutral-500 dark:hover:bg-neutral-400"
                  icon={faUser}
                />
                <p className="absolute -right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-white text-purple-500 dark:bg-neutral-500 dark:text-white">
                  {notification.filter(
                    (items: NotificationProps) =>
                      items.type === "follow" && !items.isChecked,
                  ).length > 0
                    ? notification.filter(
                        (items: NotificationProps) =>
                          items.type === "follow" && !items.isChecked,
                      ).length
                    : 0}
                </p>
              </div>

              <ul
                className={`absolute right-0 top-14 flex h-64 w-64 flex-col overflow-y-scroll scrollbar-hide ${state.menu === "friend" ? "scale-100" : "scale-0"} origin-top-right rounded-xl border bg-white transition-all duration-300 dark:bg-neutral-700`}
              >
                {notification.filter(
                  (items: NotificationProps) =>
                    items.type === "follow" && !items.isChecked,
                ).length > 0 ? (
                  notification
                    .filter(
                      (items: NotificationProps) =>
                        items.type === "follow" && !items.isChecked,
                    )
                    .sort(
                      (a: NotificationProps, b: NotificationProps) =>
                        b.createdAt - a.createdAt,
                    )
                    .map((followData: NotificationProps) => (
                      <Notifications key={followData.id} data={followData} />
                    ))
                ) : (
                  <div className="flex h-full cursor-default items-center justify-center dark:bg-neutral-700">
                    <p className="dark:text-white">No Notifications</p>
                  </div>
                )}
              </ul>
            </div>

            <div className="relative flex h-full cursor-pointer flex-col items-center justify-center max-sm:hidden">
              <div
                className="relative flex h-full items-center"
                onClick={() =>
                  state.menu === "like"
                    ? dispatch({ type: "INITIAL" })
                    : dispatch({ type: "LIKE" })
                }
              >
                <FontAwesomeIcon
                  className="h-6 w-6 rounded-lg bg-purple-300 p-1 duration-300 hover:scale-110 hover:bg-purple-400 dark:bg-neutral-500 dark:hover:bg-neutral-400"
                  icon={faBell}
                />
                <p className="absolute -right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-white text-purple-500 dark:bg-neutral-500 dark:text-white">
                  {notification.filter(
                    (items: NotificationProps) =>
                      (items.type === "like" || items.type === "comment") &&
                      !items.isChecked,
                  ).length > 0
                    ? notification.filter(
                        (items: NotificationProps) =>
                          (items.type === "like" || items.type === "comment") &&
                          !items.isChecked,
                      ).length
                    : 0}
                </p>
              </div>

              <ul
                className={`absolute right-0 top-14 flex h-64 w-64 flex-col overflow-y-scroll scrollbar-hide ${state.menu === "like" ? "scale-100" : "scale-0"} origin-top-right rounded-xl border bg-white transition-all duration-300 dark:bg-neutral-700`}
              >
                {notification.filter(
                  (items: NotificationProps) =>
                    (items.type === "like" || items.type === "comment") &&
                    !items.isChecked,
                ).length > 0 ? (
                  notification
                    ?.filter(
                      (items: NotificationProps) =>
                        (items.type === "like" || items.type === "comment") &&
                        !items.isChecked,
                    )
                    .sort(
                      (a: NotificationProps, b: NotificationProps) =>
                        b.createdAt - a.createdAt,
                    )
                    .map((postData: NotificationProps) => (
                      <Notifications key={postData.id} data={postData} />
                    ))
                ) : (
                  <div className="flex h-full cursor-default items-center justify-center dark:bg-neutral-700">
                    <p className="dark:text-white">No Notifications</p>
                  </div>
                )}
              </ul>
            </div>

            <div className="relative flex h-full cursor-pointer flex-col items-center justify-center max-sm:hidden">
              <div
                className="relative flex h-full items-center"
                onClick={() =>
                  state.menu === "chat"
                    ? dispatch({ type: "INITIAL" })
                    : dispatch({ type: "CHAT" })
                }
              >
                <FontAwesomeIcon
                  className="h-6 w-6 rounded-lg bg-purple-300 p-1 duration-300 hover:scale-110 hover:bg-purple-400 dark:bg-neutral-500 dark:hover:bg-neutral-400"
                  icon={faMessage}
                />
                <p className="absolute -right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-white text-purple-500 dark:bg-neutral-500 dark:text-white">
                  {(chatNotification as [string, UserChatProps][])?.filter(
                    (items) => !items[1].userLastMessage?.isChecked,
                  ).length > 0
                    ? (chatNotification as [string, UserChatProps][])?.filter(
                        (items) => !items[1].userLastMessage?.isChecked,
                      ).length
                    : 0}
                </p>
              </div>

              <ul
                className={`absolute right-0 top-14 flex h-64 w-64 flex-col overflow-y-scroll scrollbar-hide ${state.menu === "chat" ? "scale-100" : "scale-0"} origin-top-right rounded-xl border bg-white transition-all duration-300 dark:bg-neutral-700`}
              >
                {(chatNotification as [string, UserChatProps][])?.filter(
                  (items) => !items[1].userLastMessage?.isChecked,
                ).length > 0 ? (
                  (chatNotification as [string, UserChatProps][])
                    ?.filter((items) => !items[1].userLastMessage?.isChecked)
                    .sort((a, b) => b[1].date.createdAt - a[1].date.createdAt)
                    .map((chatData) => (
                      <ChatNotifications
                        key={chatData[1].uid}
                        data={chatData[1]}
                      />
                    ))
                ) : (
                  <div className="flex h-full cursor-default items-center justify-center dark:bg-neutral-700">
                    <p className="dark:text-white">No Notifications</p>
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className="flex">
            <div className="relative flex h-full flex-col items-center justify-center">
              <div
                className="flex cursor-pointer items-center gap-2 rounded-lg"
                onClick={() =>
                  state.menu === "menu"
                    ? dispatch({ type: "INITIAL" })
                    : dispatch({ type: "MENU" })
                }
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className="h-6 w-6 rounded-lg bg-purple-300 p-1 duration-300 hover:scale-110 hover:bg-purple-400 dark:bg-neutral-500 dark:hover:bg-neutral-400 max-sm:focus:bg-purple-400 max-sm:dark:focus:bg-neutral-400"
                />
              </div>
              <Menu state={state} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
