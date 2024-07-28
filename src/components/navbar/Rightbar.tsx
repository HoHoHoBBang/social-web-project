import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import useGetFollowingUser from "../../hooks/useGetFollowingUser";
import person from "../../assets/images/person.png";
import { Link } from "react-router-dom";
import useEvents from "../../hooks/useEvents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCaretLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserProfileProps } from "../../assets/types/postType";

const Rightbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { loginUser, logoutUser } = useGetFollowingUser(
    currentUser ? currentUser.uid : "",
  );
  const [open, setOpen] = useState(false);

  const date = new Date();
  const { todayEvents } = useEvents(date);

  return (
    <div className="h-dvh flex-[2] max-sm:fixed max-sm:right-0">
      <div className="flex h-full flex-col gap-2 bg-white dark:bg-black max-sm:bg-transparent max-sm:dark:bg-transparent">
        <div
          className={`relative mt-14 flex flex-1 flex-col gap-1 rounded-bl-lg bg-white shadow-lg duration-300 dark:bg-neutral-700 max-sm:w-12 ${open ? "" : "max-sm:-mr-28"}`}
        >
          <div
            className="absolute top-2 hidden cursor-pointer rounded-lg bg-white duration-300 dark:bg-neutral-700 max-sm:right-10 max-sm:flex"
            onClick={() => setOpen(!open)}
          >
            <FontAwesomeIcon
              className={`h-10 w-10 text-purple-500 duration-300 dark:text-neutral-500 ${open ? "rotate-180" : ""}`}
              icon={faCaretLeft}
            />
          </div>
          <div className="flex items-center border-b p-2 max-sm:justify-center">
            <p className="hidden items-center px-2 text-purple-500 dark:text-neutral-300 max-sm:flex">
              <FontAwesomeIcon icon={faCalendar} />
            </p>
            <p className="text-lg font-bold dark:text-white max-sm:hidden">
              Events
            </p>
          </div>

          <Link
            to={"/events"}
            className="flex items-center gap-2 p-2 max-sm:justify-center"
          >
            <p className="flex items-center text-purple-500 dark:text-neutral-300 max-sm:hidden">
              <FontAwesomeIcon icon={faCalendar} />
            </p>
            <p className="text-lg font-bold dark:text-white">
              {todayEvents().length}
            </p>
            <p className="dark:text-white max-sm:hidden">events invites</p>
          </Link>
        </div>

        <div
          className={`flex h-[calc(100vh-165px)] flex-col gap-1 rounded-tl-lg bg-white shadow-lg duration-300 dark:bg-neutral-700 max-sm:w-12 ${open ? "" : "max-sm:-mr-28"}`}
        >
          <div className="flex items-center border-b p-2 max-sm:justify-center">
            <p className="hidden items-center px-2 text-purple-500 dark:text-neutral-300 max-sm:flex">
              <FontAwesomeIcon icon={faUser} />
            </p>
            <p className="text-lg font-bold dark:text-white max-sm:hidden">
              Friends
            </p>
          </div>
          <ul className="flex h-full flex-col overflow-y-scroll scrollbar-hide">
            {loginUser?.map((data: UserProfileProps) => (
              <Link
                to={`/profile/${data?.uid}`}
                key={data.uid}
                className="group flex items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400 max-sm:border-none"
              >
                <div className="relative flex items-center">
                  <img
                    className="h-8 w-8 rounded-full border bg-white object-cover"
                    src={
                      data.userInfo.photoURL ? data.userInfo.photoURL : person
                    }
                    alt=""
                  />
                  <div className="absolute -top-1 right-0 h-3 w-3 rounded-full border bg-green-500"></div>
                </div>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white max-sm:absolute max-sm:right-14 max-sm:w-14 max-sm:scale-0 max-sm:group-active:scale-100">
                  {data.userInfo.displayName}
                </p>
              </Link>
            ))}
            {logoutUser?.map((data: UserProfileProps) => (
              <Link
                to={`/profile/${data?.uid}`}
                key={data.uid}
                className="group flex items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400 max-sm:border-none"
              >
                <div className="relative flex items-center">
                  <img
                    className="h-8 w-8 rounded-full border bg-white object-cover"
                    src={
                      data.userInfo.photoURL ? data.userInfo.photoURL : person
                    }
                    alt=""
                  />
                  <div className="absolute -top-1 right-0 h-3 w-3 rounded-full border bg-red-500"></div>
                </div>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white max-sm:absolute max-sm:right-14 max-sm:w-14 max-sm:scale-0 max-sm:group-active:scale-100">
                  {data.userInfo.displayName}
                </p>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
