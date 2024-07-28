import {
  faArrowUpFromBracket,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import person from "../../assets/images/person.png";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useShare from "../../hooks/useShare";
import { ShareFileProps } from "../../assets/types/postType";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");

  const {
    submitHandler,
    imageUpdateHandler,
    imageDeleteHandler,
    files,
    text,
    setText,
    imageRef,
  } = useShare();

  return (
    <div className="rounded-lg bg-transparent p-2 shadow-lg dark:bg-neutral-700">
      <div className="flex gap-2">
        <img
          className="h-8 w-8 rounded-full border bg-white object-cover"
          src={
            userProfile && userProfile.userInfo.photoURL !== null
              ? userProfile.userInfo.photoURL
              : person
          }
          alt=""
        />
        <input
          className="w-full bg-transparent px-2 py-1 outline-none dark:text-white"
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder={`What's on your mind ${userProfile?.userInfo.displayName}?`}
        />

        <div className="flex items-center justify-end">
          <div
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-purple-500 px-2 py-1 shadow hover:bg-purple-700 dark:bg-neutral-500 dark:hover:bg-neutral-400"
            onClick={submitHandler}
          >
            <p className="text-white">
              <FontAwesomeIcon icon={faShareNodes} />
            </p>
            <p className="text-sm text-white">Share</p>
          </div>
        </div>
      </div>

      <hr className="my-2" />

      <div className="flex gap-1">
        <div className="flex gap-1 overflow-x-scroll scrollbar-hide">
          {files.length > 0
            ? files.map((data: ShareFileProps, index: number) => (
                <div key={index} ref={imageRef} className="flex-shrink-0">
                  <img
                    src={data.url}
                    alt={data.name}
                    onClick={() => imageDeleteHandler(data)}
                    className="h-20 w-20 cursor-pointer rounded-lg object-cover shadow hover:border-2"
                  />
                </div>
              ))
            : null}
        </div>

        <div className="">
          <label htmlFor="file" className="">
            <div className="group flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 shadow transition-all duration-300">
              <FontAwesomeIcon
                icon={faArrowUpFromBracket}
                className="duration-300 group-hover:scale-125 dark:text-white"
              />
            </div>
          </label>
          <input
            type="file"
            id="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              imageUpdateHandler(e);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Share;
