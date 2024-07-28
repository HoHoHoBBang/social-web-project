import { useContext, useEffect, useState } from "react";
import { PostProps } from "../assets/types/postType";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../contexts/authContext";
import { PageContext } from "../contexts/pageContext";
import useGetUserProfile from "./useGetUserProfile";
import { useParams } from "react-router-dom";

const useGetFeed = () => {
  const { uid } = useParams() as { uid: string };

  const { currentUser } = useContext(AuthContext);
  const { state } = useContext(PageContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");

  const [feed, setFeed] = useState<PostProps[]>([]);
  const [profile, setProfile] = useState<DocumentData | null>(userProfile);

  useEffect(() => {
    if (!currentUser) return;

    const getUserProfile = async () => {
      try {
        if (currentUser.uid) {
          const q = await getDoc(doc(db, "users", currentUser.uid));
          if (q.exists()) {
            setProfile(q.data());
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserProfile();
  }, [currentUser, state]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "posts"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const posts: PostProps[] = [];

      querySnapshot.forEach((doc: DocumentData) => {
        const postData = doc.data();

        if (uid) {
          if (postData.createdBy && postData.createdBy.includes(uid)) {
            posts.push({ ...postData, id: doc.id });
          }
        } else {
          if (state.page === "feed") {
            posts.push({ ...postData, id: doc.id });
          } else if (state.page === "friend" && profile?.following) {
            if (
              postData.createdBy &&
              profile.following.includes(postData.createdBy)
            ) {
              posts.push({ ...postData, id: doc.id });
            }
          } else if (state.page === "like" && postData.likes) {
            if (postData.likes.includes(currentUser.uid)) {
              posts.push({ ...postData, id: doc.id });
            }
          } else if (state.page === "bookmark" && postData.bookmarks) {
            if (postData.bookmarks.includes(currentUser.uid)) {
              posts.push({ ...postData, id: doc.id });
            }
          }
        }
      });

      setFeed(posts);
    });

    return () => unsub();
  }, [currentUser, state.page, profile?.following, uid]);

  return { feed };
};

export default useGetFeed;
