import React, { useContext } from "react";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import { Link } from "react-router-dom";
import useGetFeed from "../../hooks/useGetFeed";
import useGetNotification from "../../hooks/useGetNotification";
import { EditProfileContext } from "../../contexts/editProfileContext";
import { ModalContext } from "../../contexts/modalContext";
import { NotificationProps, PostProps } from "../../assets/types/postType";

interface Props {
  data: NotificationProps;
}

const Notifications = ({ data }: Props) => {
  const { userProfile } = useGetUserProfile(data.uid);
  const { dispatch, setPostModalOpen } = useContext(ModalContext);
  const { feed } = useGetFeed();
  const { checkFollow, checkPost } = useGetNotification();
  const { setEdit } = useContext(EditProfileContext);

  const postData = feed.filter(
    (post: PostProps) => data && post.id === data?.postId,
  )[0];

  const handlePostModal = () => {
    if (postData) {
      dispatch({ type: "VIEWPOST", payload: postData });
    }
  };

  return (
    <>
      <Link
        to={data.type === "follow" ? `/profile/${data.uid}` : ""}
        className="border-b"
        onClick={() => {
          if (data.type === "like" || data.type === "comment") {
            setPostModalOpen(true);
            checkPost(data.id);
            handlePostModal();
          } else {
            setPostModalOpen(false);
            checkFollow(data.id);
            setEdit(false);
          }
        }}
      >
        <div className="group flex items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:bg-neutral-500 dark:hover:bg-neutral-400">
          <img
            className="h-8 w-8 rounded-full border bg-white object-cover"
            src={
              userProfile?.userInfo.photoURL
                ? userProfile?.userInfo.photoURL
                : person
            }
            alt=""
          />
          <div className="group-hover:text-purple-500">
            <div className="flex gap-1">
              <p className="max-w-14 overflow-hidden text-ellipsis whitespace-nowrap font-bold dark:text-neutral-300 dark:group-hover:text-white">
                {userProfile?.userInfo.displayName}
              </p>
              <p className="flex items-center text-sm dark:text-neutral-300 dark:group-hover:text-white">
                {data.type === "like"
                  ? "liked your post"
                  : data.type === "comment"
                    ? "commented your post"
                    : "started following you"}
              </p>
            </div>
            <p className="text-sm dark:text-neutral-300 dark:group-hover:text-white">
              {data.date}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Notifications;
