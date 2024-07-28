import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ShareFileProps } from "../assets/types/postType";

const useShare = () => {
  const { currentUser } = useContext(AuthContext);

  const [files, setFiles] = useState<ShareFileProps[]>([]);
  const [text, setText] = useState("");

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [files]);

  const submitHandler = async (e: React.FormEvent) => {
    if (!currentUser) return;

    e.preventDefault();

    if (text.trim() !== "") {
      const newPost = {
        text,
        likes: [],
        bookmarks: [],
        comments: [],
        createdAt: Date.now(),
        createdBy: currentUser.uid,
      };

      try {
        const postDoc = await addDoc(collection(db, "posts"), newPost);

        await updateDoc(doc(db, "users", currentUser.uid), {
          posts: arrayUnion(postDoc.id),
        });

        for (let i = 0; i < files.length; i++) {
          const id = files[i].name;
          const response = await fetch(files[i].url);
          const blob = await response.blob();

          const storageRef = ref(storage, `images/${postDoc.id}/${id}`);

          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                updateDoc(doc(db, "posts", postDoc.id), {
                  files: arrayUnion(downloadURL),
                });
              });
            },
          );
        }

        setText("");
        setFiles([]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const imageUpdateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = e.target.files;
      if (newFiles.length === 0) {
        return;
      }
      for (let i = 0; i < newFiles.length; i++) {
        if (newFiles[i].type.split("/")[0] !== "image") continue;

        if (!files.some((file) => file.name === newFiles[i].name)) {
          setFiles((file) => [
            ...file,
            {
              name: newFiles[i].name,
              url: URL.createObjectURL(newFiles[i]),
            },
          ]);
        }
      }
    }
  };

  const imageDeleteHandler = (image: ShareFileProps) => {
    setFiles(files.filter((data: ShareFileProps) => data.name !== image.name));
  };

  return {
    submitHandler,
    imageUpdateHandler,
    imageDeleteHandler,
    files,
    text,
    setText,
    imageRef,
  };
};

export default useShare;
