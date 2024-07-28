import React, { useContext } from "react";
import Share from "./Share";
import Post from "./Post";
import useGetFeed from "../../hooks/useGetFeed";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { PostProps } from "../../assets/types/postType";

const Feed = () => {
  const { currentUser } = useContext(AuthContext);
  const { uid } = useParams() as { uid: string };
  const { feed } = useGetFeed();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="h-dvh flex-[6] overflow-y-scroll bg-white scrollbar-hide dark:bg-black">
      <div className={`${uid ? "mb-96" : "mt-16"}`}>
        <div className="flex w-full flex-col items-center">
          <div className="w-2/3 p-2 max-sm:w-full">
            {currentUser.uid === uid || !uid ? <Share /> : null}
            {feed
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((data: PostProps) => (
                <Post key={data.id} data={data} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
