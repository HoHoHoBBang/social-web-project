import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { deleteObject, listAll, ref } from "firebase/storage";
import { KeyboardEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { v4 as uuid } from "uuid";
import getTime from "../utils/getTime";
import { PostProps } from "../assets/types/postType";

const usePost = () => {
  const [comment, setComment] = useState("");
  const { nowDate, nowTime } = getTime(new Date());
  const { currentUser } = useContext(AuthContext);

  const likeHandler = async (data: PostProps) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "posts", data.id), {
        likes: data.likes.includes(currentUser.uid)
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });

      if (!data.likes.includes(currentUser.uid)) {
        if (data.createdBy !== currentUser.uid) {
          await updateDoc(doc(db, "notifications", data.createdBy), {
            notification: arrayUnion({
              id: uuid(),
              uid: currentUser.uid,
              postId: data.id,
              date: nowDate,
              time: nowTime,
              createdAt: Date.now(),
              type: "like",
              isChecked: false,
            }),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async (data: PostProps) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "posts", data.id), {
        bookmarks: data.bookmarks.includes(currentUser.uid)
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (data: PostProps) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, "posts", data.id));

      const imageRef = ref(storage, `images/${data.id}/`);

      listAll(imageRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef);
          });
        })
        .catch((error) => {
          console.log(error);
        });

      await updateDoc(doc(db, "users", currentUser.uid), {
        posts: arrayRemove(data.id),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async (data: PostProps) => {
    if (!currentUser) return;

    if (comment.trim() !== "") {
      const newComment = {
        id: uuid(),
        comment,
        createdAt: Date.now(),
        createdBy: currentUser.uid,
      };

      try {
        await updateDoc(doc(db, "posts", data.id), {
          comments: arrayUnion(newComment),
        });

        if (data.createdBy !== currentUser.uid) {
          await updateDoc(doc(db, "notifications", data.createdBy), {
            notification: arrayUnion({
              id: uuid(),
              uid: currentUser.uid,
              postId: data.id,
              date: nowDate,
              time: nowTime,
              createdAt: Date.now(),
              type: "comment",
              isChecked: false,
            }),
          });
        }

        setComment("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const keyHandler = (e: KeyboardEvent, data: PostProps) => {
    if (e.nativeEvent.isComposing) {
      return;
    } else if (comment.trim() !== "") {
      e.code === "Enter" && commentHandler(data);
    }
  };

  return {
    comment,
    setComment,
    likeHandler,
    bookmarkHandler,
    deleteHandler,
    commentHandler,
    keyHandler,
  };
};

export default usePost;
