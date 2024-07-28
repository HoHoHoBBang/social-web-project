import {
  faBookmark,
  faCalendarDay,
  faCaretRight,
  faHeart,
  faList,
  faMessage,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { PageContext } from "../../contexts/pageContext";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../contexts/chatContext";
import { EditProfileContext } from "../../contexts/editProfileContext";

const Leftbar = () => {
  const [open, setOpen] = useState(false);
  const { dispatch } = useContext(PageContext);
  const { dispatch: chatDispatch } = useContext(ChatContext);
  const { setEdit } = useContext(EditProfileContext);

  const leftbar = [
    { name: "Feed", icon: faList, type: "FEED" },
    { name: "Friends", icon: faUserGroup, type: "FRIEND" },
    { name: "Chats", icon: faMessage, type: "INITIAL" },
    { name: "Likes", icon: faHeart, type: "LIKE" },
    { name: "Bookmarks", icon: faBookmark, type: "BOOKMARK" },
    { name: "Events", icon: faCalendarDay, type: "EVENT" },
  ];

  const navigate = useNavigate();

  return (
    <div
      className={`z-[4] h-dvh flex-[2] bg-white shadow-lg duration-300 dark:bg-neutral-700 max-sm:fixed ${open ? "" : " max-sm:-ml-12"}`}
    >
      <ul className="mt-16 flex flex-col gap-2 max-sm:relative">
        <div
          className={`${open ? "-right-9" : "-right-9"} absolute top-0 hidden cursor-pointer rounded-r-lg bg-white duration-300 dark:bg-neutral-700 max-sm:flex`}
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon
            className={`h-10 w-10 text-purple-500 duration-500 dark:text-neutral-500 ${open ? "rotate-180" : ""}`}
            icon={faCaretRight}
          />
        </div>
        {leftbar.map((data) => (
          <li
            key={data.name}
            className="group flex cursor-pointer items-center border-purple-500 p-2 transition-all duration-300 hover:border-r-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400 max-sm:border-none"
            onClick={() => {
              if (data.name !== "Chats" && data.name !== "Events") {
                navigate("/");
                dispatch({ type: data.type });
                setEdit(false);
                setOpen(!open);
              } else if (data.name === "Chats") {
                navigate("/chats");
                chatDispatch({ type: data.type });
                setEdit(false);
                setOpen(!open);
              } else {
                navigate("/events");
                setEdit(false);
                setOpen(!open);
              }
            }}
          >
            <div className="relative flex items-center gap-5">
              <FontAwesomeIcon
                className="h-7 w-7 group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white"
                icon={data.icon}
              />
              <p className="text-lg group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white max-sm:absolute max-sm:left-10 max-sm:scale-0 max-sm:text-base max-sm:group-active:scale-100">
                {data.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leftbar;
