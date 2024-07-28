import {
  faBookmark,
  faHeart,
  faSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faReply,
  faBookmark as faSolidBookmark,
  faHeart as faSolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { CommentsProps, PostProps } from "../../assets/types/postType";
import { AuthContext } from "../../contexts/authContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import timeAgo from "../../utils/timeAgo";
import person from "../../assets/images/person.png";
import Comments from "./Comments";
import { Link, Navigate } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import usePost from "../../hooks/usePost";
import { ModalContext } from "../../contexts/modalContext";

interface Props {
  data: PostProps;
}

const Post = ({ data }: Props) => {
  const [openComment, setOpenComment] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(data.createdBy);
  const { dispatch, setModalOpen, setPostModalOpen } = useContext(ModalContext);
  const { userProfile: currentUserProfile } = useGetUserProfile(
    currentUser ? currentUser.uid : "",
  );
  const { followHandler } = useFollow();
  const {
    comment,
    setComment,
    likeHandler,
    bookmarkHandler,
    commentHandler,
    keyHandler,
  } = usePost();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mt-5 flex flex-col gap-2 rounded-lg p-2 shadow-lg dark:bg-neutral-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${userProfile?.uid}`}
            className="flex items-center gap-2"
          >
            <img
              className="h-8 w-8 rounded-full border bg-white object-cover"
              src={
                userProfile && userProfile.userInfo.photoURL !== null
                  ? userProfile.userInfo.photoURL
                  : person
              }
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold dark:text-white">
                {userProfile ? userProfile.userInfo.displayName : null}
              </p>
              <p className="text-xs text-gray-500">{timeAgo(data.createdAt)}</p>
            </div>
          </Link>
          {data.createdBy !== currentUser.uid && (
            <p
              className={`cursor-pointer rounded-full border-2 px-1 py-0.5 text-xs ${
                !currentUserProfile?.following.includes(data.createdBy)
                  ? "text-purple-500 hover:bg-purple-500 hover:text-white"
                  : "text-gray-500 hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => followHandler(data.createdBy)}
            >
              {!currentUserProfile?.following.includes(data.createdBy)
                ? "Follow"
                : "Unfollow"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            className="cursor-pointer dark:text-white max-sm:hidden"
            icon={faSquare}
            onClick={() => {
              setPostModalOpen(true);
              dispatch({ type: "VIEWPOST", payload: data });
            }}
          />
          {currentUser.uid === data.createdBy ? (
            <FontAwesomeIcon
              className="cursor-pointer dark:text-white"
              icon={faTrashCan}
              onClick={() => {
                setModalOpen(true);
                dispatch({ type: "POSTDELETE", payload: data });
              }}
            />
          ) : null}
        </div>
      </div>

      {data.files?.length > 0 ? (
        <div className="relative">
          {data.files?.length > 1 ? (
            <div
              className="absolute left-0 top-0 flex h-full w-10 cursor-pointer items-center rounded-l-lg border-purple-500 transition-all duration-300 hover:border-l-8 max-sm:border-none max-sm:active:bg-black/30"
              onClick={() => {
                if (fileIndex > 0) {
                  setFileIndex(fileIndex - 1);
                } else {
                  setFileIndex(data.files?.length - 1);
                }
              }}
            ></div>
          ) : null}
          <img
            src={data.files[fileIndex]}
            alt=""
            className="h-72 w-full rounded-lg border object-contain dark:bg-neutral-600"
          />
          {data.files?.length > 1 ? (
            <div
              className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center rounded-r-lg border-purple-500 transition-all duration-300 hover:border-r-8 max-sm:border-none max-sm:active:bg-black/30"
              onClick={() => {
                if (fileIndex < data.files?.length - 1) {
                  setFileIndex(fileIndex + 1);
                } else {
                  setFileIndex(0);
                }
              }}
            ></div>
          ) : null}
          {data.files?.length > 1 ? (
            <div className="absolute bottom-2 flex w-full justify-center gap-1">
              {data.files?.map((_, imageIndex) => (
                <div
                  onClick={() => {
                    setFileIndex(imageIndex);
                  }}
                  key={imageIndex}
                  className={`h-3 w-3 cursor-pointer rounded-full border ${fileIndex === imageIndex ? "bg-purple-500" : "bg-gray-500"}`}
                ></div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={
              data.bookmarks.includes(currentUser.uid)
                ? faSolidBookmark
                : faBookmark
            }
            className={`cursor-pointer ${data.bookmarks.includes(currentUser.uid) ? "text-yellow-500" : "dark:text-white"}`}
            onClick={() => bookmarkHandler(data)}
          />
          <FontAwesomeIcon
            icon={data.likes.includes(currentUser.uid) ? faSolidHeart : faHeart}
            className={`cursor-pointer ${data.likes.includes(currentUser.uid) ? "text-red-500" : "dark:text-white"}`}
            onClick={() => likeHandler(data)}
          />

          <p className="text-sm dark:text-white">
            {data.likes.length} people like it
          </p>
        </div>

        <p className="line-clamp-4 text-ellipsis break-all dark:text-white">
          {data.text}
        </p>
        <p
          onClick={() => setOpenComment(!openComment)}
          className="cursor-pointer text-sm dark:text-white"
        >
          {data.comments.length} comments
        </p>

        <ul className={`${!openComment ? "hidden" : "flex"} flex-col gap-1`}>
          {(data.comments as CommentsProps[])
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((comments) => (
              <Comments key={comments.id} comments={comments} data={data} />
            ))}
        </ul>

        <div className="flex gap-1 border-b">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => keyHandler(e, data)}
            className="w-full bg-transparent px-1 py-0.5 outline-none placeholder:text-sm dark:text-white"
            placeholder="Comment"
          />
          <button onClick={() => commentHandler(data)}>
            <p className="text-sm dark:text-white">
              <FontAwesomeIcon icon={faReply} />
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
