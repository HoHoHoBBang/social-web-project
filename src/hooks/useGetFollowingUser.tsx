import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../contexts/authContext";
import { UserProfileProps } from "../assets/types/postType";

const useGetFollowingUser = (userId: string) => {
  const { currentUser } = useContext(AuthContext);

  const [followingUser, setFollowingUser] = useState<string[]>([]);
  const [followerUser, setFollowerUser] = useState<string[]>([]);
  const [followingUserProfile, setFollowingUserProfile] =
    useState<DocumentData | null>(null);
  const [followerUserProfile, setFollowerUserProfile] =
    useState<DocumentData | null>(null);
  const [loginUser, setLoginUser] = useState<UserProfileProps[]>([]);
  const [logoutUser, setLogoutUser] = useState<UserProfileProps[]>([]);

  useEffect(() => {
    if (!userId) return;

    setFollowingUser([]);
    setFollowerUser([]);

    const unsub = onSnapshot(
      doc(db, "users", userId),
      (doc) => {
        if (doc.exists()) {
          setFollowingUser(doc.data().following);
          setFollowerUser(doc.data().follower);
        } else {
          setFollowingUser([]);
          setFollowerUser([]);
        }
      },
      (error) => {
        console.log(error);
      },
    );

    return () => {
      unsub();
    };
  }, [userId]);

  useEffect(() => {
    const getUserProfile = async () => {
      const followingList = [];
      const followerList = [];

      if (followingUser && followingUser.length > 0) {
        for (let i = 0; i < followingUser.length; i++) {
          const q = await getDoc(doc(db, "users", followingUser[i]));
          followingList.push(q.data());
        }
      }

      if (followerUser && followerUser.length > 0) {
        for (let i = 0; i < followerUser.length; i++) {
          const q = await getDoc(doc(db, "users", followerUser[i]));
          followerList.push(q.data());
        }
      }

      setFollowingUserProfile(followingList);
      setFollowerUserProfile(followerList);
    };

    getUserProfile();
  }, [followingUser, followerUser]);

  useEffect(() => {
    if (!currentUser) return;

    const online = query(collection(db, "users"), where("online", "==", true));

    const unsub = onSnapshot(online, (snapshot) => {
      const list: UserProfileProps[] = [];

      snapshot.forEach((doc: DocumentData) => {
        const userData = doc.data();

        if (userData.follower && userData.follower.includes(currentUser.uid)) {
          list.push(userData);
        }
      });

      setLoginUser(list);
    });

    return () => unsub();
  }, [currentUser, followingUser]);

  useEffect(() => {
    if (!currentUser) return;

    const offline = query(
      collection(db, "users"),
      where("online", "==", false),
    );

    const unsub = onSnapshot(offline, (snapshot) => {
      const list: UserProfileProps[] = [];
      snapshot.forEach((doc: DocumentData) => {
        const userData = doc.data();

        if (userData.follower && userData.follower.includes(currentUser.uid)) {
          list.push(userData);
        }
      });

      setLogoutUser(list);
    });

    return () => unsub();
  }, [currentUser, followingUser]);

  return { followingUserProfile, followerUserProfile, loginUser, logoutUser };
};

export default useGetFollowingUser;
