import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef } from "react";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import timeAgo from "../../utils/timeAgo";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { ModalContext } from "../../contexts/modalContext";
import { CommentsProps, PostProps } from "../../assets/types/postType";

interface Props {
  comments: CommentsProps;
  data: PostProps;
}

const Comments = ({ comments, data }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(comments.createdBy);
  const { setPostModalOpen } = useContext(ModalContext);

  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [comments]);

  const deleteHandler = async (postData: PostProps, commentId: string) => {
    const deleteComment = postData.comments.filter(
      (data) => data.id !== commentId,
    );

    try {
      await updateDoc(doc(db, "posts", postData.id), {
        comments: deleteComment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li ref={ref} className="flex items-center justify-between gap-1">
      <img
        className="h-8 w-8 rounded-full border bg-white object-cover"
        src={
          userProfile && userProfile.userInfo.photoURL !== null
            ? userProfile.userInfo.photoURL
            : person
        }
        alt=""
      />
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1">
          <Link
            to={`/profile/${comments.createdBy}`}
            className="flex items-center"
            onClick={() => setPostModalOpen(false)}
          >
            <p className="text-sm font-bold dark:text-white max-sm:text-sm">
              {userProfile ? userProfile.userInfo.displayName : null}
            </p>
          </Link>
          <p className="text-xs text-gray-500">{timeAgo(comments.createdAt)}</p>
        </div>
        <p className="dark:text-white max-sm:text-sm">{comments.comment}</p>
      </div>
      {currentUser?.uid === comments.createdBy ? (
        <div
          onClick={() => deleteHandler(data, comments.id)}
          className="cursor-pointer"
        >
          <p className="text-sm dark:text-white">
            <FontAwesomeIcon icon={faTrash} />
          </p>
        </div>
      ) : null}
    </li>
  );
};

export default Comments;
