import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { NotificationProps } from "../assets/types/postType";

const useGetNotification = () => {
  const [notification, setNotification] = useState<NotificationProps[]>([]);
  const [chatNotification, setChatNotification] = useState<[string, any][]>([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) return;

    const getNotification = () => {
      const unsub = onSnapshot(
        doc(db, "notifications", currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data().notification;

            if (data) {
              setNotification(data);
            } else {
              setNotification([]);
            }
          }
        },
      );

      return () => unsub();
    };

    currentUser.uid && getNotification();
  }, [currentUser]);

  const checkFollow = async (id: string) => {
    if (!currentUser) return;

    const ref = await getDoc(doc(db, "notifications", currentUser.uid));
    const data = ref.data();

    if (ref.exists()) {
      data?.notification
        .filter((items: NotificationProps) => items.type === "follow")
        .forEach(async (notiData: NotificationProps) => {
          if (notiData.id === id) {
            await updateDoc(doc(db, "notifications", currentUser.uid), {
              notification: data.notification.map(
                (items: NotificationProps) => ({
                  ...items,
                  isChecked: items.id === id ? true : items.isChecked,
                }),
              ),
            });
          }
        });
    }
  };

  const checkPost = async (id: string) => {
    if (!currentUser) return;

    const ref = await getDoc(doc(db, "notifications", currentUser.uid));
    const data = ref.data();

    if (ref.exists()) {
      data?.notification
        .filter(
          (items: NotificationProps) =>
            items.type === "like" || items.type === "comment",
        )
        .forEach(async (notiData: NotificationProps) => {
          if (notiData.id === id) {
            await updateDoc(doc(db, "notifications", currentUser.uid), {
              notification: data.notification.map(
                (items: NotificationProps) => ({
                  ...items,
                  isChecked: items.id === id ? true : items.isChecked,
                }),
              ),
            });
          }
        });
    }
  };

  const checkChat = async (userId: string) => {
    if (!currentUser) return;

    const combinedId =
      currentUser.uid > userId
        ? currentUser.uid + userId
        : userId + currentUser.uid;

    const ref = await getDoc(doc(db, "userChats", currentUser.uid));
    const data = ref.data()?.[combinedId];

    if (data && data.userLastMessage && data.uid === userId) {
      data.userLastMessage.isChecked = true;

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId]: data,
      });
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const getChatNotification = async () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc: DocumentData) => {
          const data = doc.data() ? Object.entries(doc.data()) : [];

          if (data[0] && (data[0][1] as any)?.userLastMessage) {
            setChatNotification(data);
          }
        },
      );
      return () => unsub();
    };

    currentUser.uid && getChatNotification();
  }, [currentUser]);

  return {
    notification,
    chatNotification,
    checkFollow,
    checkPost,
    checkChat,
  };
};

export default useGetNotification;
