import {
  faBookmark,
  faHeart,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faReply,
  faBookmark as faSolidBookmark,
  faHeart as faSolidHeart,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { CommentsProps, PostProps } from "../../assets/types/postType";
import { AuthContext } from "../../contexts/authContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import timeAgo from "../../utils/timeAgo";
import person from "../../assets/images/person.png";
import Comments from "../feed/Comments";
import { Link, Navigate } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import usePost from "../../hooks/usePost";
import { ModalContext } from "../../contexts/modalContext";
import useGetFeed from "../../hooks/useGetFeed";

interface Props {
  data: PostProps;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal = ({ data, setModalOpen, setPostModalOpen }: Props) => {
  const [fileIndex, setFileIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ModalContext);
  const { userProfile } = useGetUserProfile(data.createdBy);
  const { userProfile: currentUserProfile } = useGetUserProfile(
    currentUser ? currentUser.uid : "",
  );
  const { feed } = useGetFeed();

  const { followHandler } = useFollow();
  const {
    comment,
    setComment,
    likeHandler,
    bookmarkHandler,
    commentHandler,
    keyHandler,
  } = usePost();

  const postData = feed.find((post) => post.id === data.id);

  if (!postData) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="fixed inset-0 z-[9] flex items-center justify-center bg-black bg-opacity-15">
      <div className="flex h-2/3 w-2/3 flex-col rounded-lg bg-white dark:bg-neutral-700">
        <div className="flex h-14 w-full items-center justify-between border-b-2 p-2">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${userProfile?.uid}`}
              onClick={() => setPostModalOpen(false)}
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
                <p className="font-bold dark:text-white">
                  {userProfile ? userProfile.userInfo.displayName : null}
                </p>
                <p className="text-xs text-gray-500">
                  {timeAgo(postData.createdAt)}
                </p>
              </div>
            </Link>
            {postData.createdBy !== currentUser.uid && (
              <p
                className={`cursor-pointer rounded-full border-2 px-1 py-0.5 text-xs ${
                  !currentUserProfile?.following.includes(postData.createdBy)
                    ? "text-purple-500 hover:bg-purple-500 hover:text-white"
                    : "text-gray-500 hover:bg-gray-500 hover:text-white"
                }`}
                onClick={() => followHandler(postData.createdBy)}
              >
                {!currentUserProfile?.following.includes(postData.createdBy)
                  ? "Follow"
                  : "Unfollow"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div>
              <FontAwesomeIcon
                className={`${currentUser.uid === postData.createdBy ? "flex" : "hidden"} cursor-pointer dark:text-white`}
                icon={faTrashCan}
                onClick={() => {
                  setModalOpen(true);
                  dispatch({ type: "POSTDELETE", payload: postData });
                }}
              />
            </div>
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={() => setPostModalOpen(false)}
            >
              <p className="dark:text-white">
                <FontAwesomeIcon icon={faX} />
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full w-full">
          <div className="flex flex-[1.5] flex-col gap-2 p-2">
            {postData.files?.length > 0 ? (
              <div className="relative">
                {postData.files?.length > 1 ? (
                  <div
                    className="absolute left-0 top-0 flex h-full w-10 cursor-pointer items-center rounded-l-lg border-purple-500 transition-all duration-300 hover:border-l-8"
                    onClick={() => {
                      if (fileIndex > 0) {
                        setFileIndex(fileIndex - 1);
                      } else {
                        setFileIndex(postData.files?.length - 1);
                      }
                    }}
                  ></div>
                ) : null}
                <img
                  src={postData.files[fileIndex]}
                  alt=""
                  className="h-72 w-full rounded-lg border object-contain dark:bg-neutral-600"
                />
                {postData.files?.length > 1 ? (
                  <div
                    className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center rounded-r-lg border-purple-500 transition-all duration-300 hover:border-r-8"
                    onClick={() => {
                      if (fileIndex < postData.files?.length - 1) {
                        setFileIndex(fileIndex + 1);
                      } else {
                        setFileIndex(0);
                      }
                    }}
                  ></div>
                ) : null}
                {postData.files?.length > 1 ? (
                  <div className="absolute bottom-2 flex w-full justify-center gap-1">
                    {postData.files?.map((_, imageIndex) => (
                      <div
                        onClick={() => {
                          setFileIndex(imageIndex);
                        }}
                        key={imageIndex}
                        className={`h-3 w-3 cursor-pointer rounded-full ${fileIndex === imageIndex ? "bg-purple-500" : "bg-gray-500"}`}
                      ></div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="h-72 w-full rounded-lg border"></div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={
                    postData.bookmarks.includes(currentUser.uid)
                      ? faSolidBookmark
                      : faBookmark
                  }
                  className={`cursor-pointer ${postData.bookmarks.includes(currentUser.uid) ? "text-yellow-500" : "dark:text-white"}`}
                  onClick={() => bookmarkHandler(postData)}
                />
                <FontAwesomeIcon
                  icon={
                    postData.likes.includes(currentUser.uid)
                      ? faSolidHeart
                      : faHeart
                  }
                  className={`cursor-pointer ${postData.likes.includes(currentUser.uid) ? "text-red-500" : "dark:text-white"}`}
                  onClick={() => likeHandler(postData)}
                />

                <p className="text-sm dark:text-white">
                  {postData.likes.length} people like it
                </p>
              </div>

              <p className="line-clamp-4 text-ellipsis break-all dark:text-white">
                {postData.text}
              </p>
            </div>
          </div>

          <div className="border-l"></div>

          <div className="flex-1 p-2">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 border-b">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => keyHandler(e, postData)}
                  className="w-full bg-transparent px-1 py-0.5 outline-none placeholder:text-sm dark:text-white"
                  placeholder="Comment"
                />
                <button onClick={() => commentHandler(postData)}>
                  <p className="text-sm dark:text-white">
                    <FontAwesomeIcon icon={faReply} />
                  </p>
                </button>
              </div>

              <ul className="flex h-96 flex-col gap-1 overflow-y-scroll scrollbar-hide">
                {(postData.comments as CommentsProps[])
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map((comments) => (
                    <Comments
                      key={comments.id}
                      comments={comments}
                      data={postData}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
