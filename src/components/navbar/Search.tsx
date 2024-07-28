import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import person from "../../assets/images/person.png";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import useSearch from "../../hooks/useSearch";
import { EditProfileContext } from "../../contexts/editProfileContext";

const Search = () => {
  const { input, setInput, user } = useSearch();
  const { setEdit } = useContext(EditProfileContext);

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-1/2 items-center justify-center gap-2 rounded-full bg-purple-300 px-2 py-1 dark:bg-neutral-500 max-sm:w-[90%]">
          <input
            className="w-full bg-transparent px-1 outline-none dark:text-white"
            type="text"
            placeholder="Search friend"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <FontAwesomeIcon className="dark:text-white" icon={faSearch} />
        </div>
      </div>
      <div className="absolute top-14 flex w-full justify-center">
        <ul
          className={`h-fit max-h-60 w-1/2 overflow-y-scroll rounded-xl bg-white shadow-lg scrollbar-hide max-sm:w-[90%] ${user.length > 0 ? "scale-100" : "scale-y-0"} origin-top transition-all duration-300`}
        >
          {user.length > 0 &&
            user.map((data) => (
              <Link
                to={`/profile/${data.uid}`}
                className="flex border-b"
                key={data.uid}
                onClick={() => {
                  setInput("");
                  setEdit(false);
                }}
              >
                <div className="group flex w-full items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:bg-neutral-500 dark:hover:bg-neutral-400">
                  <img
                    className="h-8 w-8 rounded-full border bg-white"
                    src={
                      data && data.userInfo.photoURL
                        ? data.userInfo.photoURL
                        : person
                    }
                    alt=""
                  />
                  <div className="w-60 max-sm:w-40">
                    <p className="overflow-hidden text-ellipsis text-nowrap text-lg font-bold group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
                      {data.userInfo.displayName}
                    </p>
                    <p className="overflow-hidden text-ellipsis text-nowrap text-sm group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
                      {data.email}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
