import { deleteUser, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase";
import {
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { deleteObject, listAll, ref } from "firebase/storage";
import useGetUserProfile from "./useGetUserProfile";

const useDeleteUser = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");

  const deleteHandler = async () => {
    if (!currentUser) return;

    try {
      userProfile?.posts.forEach(async (postId: string) => {
        const postImageRef = ref(storage, `images/${postId}`);
        const postItems = await listAll(postImageRef);

        postItems.items.forEach((item) => deleteObject(item));
      });

      const imageRef = ref(storage, `images/${currentUser.uid}`);
      const imageItems = await listAll(imageRef);

      imageRef && imageItems.items.forEach((item) => deleteObject(item));

      const userRef = collection(db, "users");
      const postRef = collection(db, "posts");
      const chatsRef = collection(db, "chats");
      const userChatsRef = collection(db, "userChats");
      const notificationsRef = collection(db, "notifications");

      deleteDoc(doc(db, "users", currentUser.uid));
      deleteDoc(doc(db, "notifications", currentUser.uid));
      deleteDoc(doc(db, "userChats", currentUser.uid));
      deleteDoc(doc(db, "events", currentUser.uid));

      const followingQuery = query(
        userRef,
        where("following", "array-contains", currentUser.uid),
      );
      const followerQuery = query(
        userRef,
        where("follower", "array-contains", currentUser.uid),
      );

      const [
        followingDocs,
        followerDocs,
        postDocs,
        chatsDocs,
        userChatsDocs,
        notificationsDocs,
      ] = await Promise.all([
        getDocs(followingQuery),
        getDocs(followerQuery),
        getDocs(query(postRef, where("createdBy", "==", currentUser.uid))),
        getDocs(chatsRef),
        getDocs(userChatsRef),
        getDocs(notificationsRef),
      ]);

      followingDocs.forEach((doc) =>
        updateDoc(doc.ref, {
          following: arrayRemove(currentUser.uid),
        }),
      );

      followerDocs.forEach((doc) =>
        updateDoc(doc.ref, {
          follower: arrayRemove(currentUser.uid),
        }),
      );

      userChatsDocs.forEach((doc) => {
        const combinedId =
          doc.id > currentUser.uid
            ? doc.id + currentUser.uid
            : currentUser.uid + doc.id;

        updateDoc(doc.ref, {
          [combinedId]: deleteField(),
        });
      });

      chatsDocs.forEach((doc) => {
        if (doc.id.includes(currentUser.uid)) {
          deleteDoc(doc.ref);
        }
      });

      postDocs.forEach((doc) => {
        const data = doc.data();
        const newComments = Array.isArray(data?.comments)
          ? data.comments.filter(
              (comment) => comment.createdBy !== currentUser.uid,
            )
          : [];
        updateDoc(doc.ref, {
          comments: newComments,
          bookmarks: arrayRemove(currentUser.uid),
          likes: arrayRemove(currentUser.uid),
        });

        if (data.createdBy.includes(currentUser.uid)) {
          deleteDoc(doc.ref);
        }
      });

      notificationsDocs.forEach((doc) => {
        const data = doc.data();
        const newFollows = Array.isArray(data?.follow)
          ? data.follow.filter((follow) => follow.uid !== currentUser.uid)
          : [];
        const newPosts = Array.isArray(data?.post)
          ? data.post.filter((post) => post.uid !== currentUser.uid)
          : [];
        updateDoc(doc.ref, { follow: newFollows, post: newPosts });
      });

      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch (error) {
      console.log(error);
    }

    signOut(auth);
  };

  return { deleteHandler };
};

export default useDeleteUser;
