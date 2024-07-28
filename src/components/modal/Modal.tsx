import React, { useContext } from "react";
import usePost from "../../hooks/usePost";
import useDeleteUser from "../../hooks/useDeleteUser";
import useLogout from "../../hooks/useLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "../../contexts/modalContext";
import { PostProps } from "../../assets/types/postType";

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: PostProps;
  name: string;
}

const Modal = ({ setModalOpen, setPostModalOpen, data, name }: Props) => {
  const { dispatch } = useContext(ModalContext);
  const { deleteHandler } = usePost();
  const { deleteHandler: userDeleteHandler } = useDeleteUser();
  const { logout } = useLogout();

  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm">
      <div className="flex h-1/4 w-1/3 items-center justify-center rounded-lg border bg-purple-50 dark:bg-neutral-500 max-sm:w-[90%]">
        <div className="flex h-full w-full flex-col justify-between gap-5 p-5">
          <div className="flex w-full items-start gap-2">
            <p className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 text-3xl text-purple-500 dark:bg-neutral-700 dark:text-white">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </p>
            <div className="flex flex-col">
              <p className="text-3xl font-bold dark:text-white">
                {name === "logout"
                  ? "Logout"
                  : name === "postDelete"
                    ? "Post delete"
                    : "Account delete"}
              </p>
              <p className="dark:text-white">
                Are you sure you want{" "}
                {name === "logout"
                  ? "logout"
                  : name === "postDelete"
                    ? "delete Post"
                    : "delete Account"}
                ?
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <p
              onClick={() => {
                setModalOpen(false);
                dispatch({ type: "INITIAL" });
              }}
              className="flex w-20 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-gray-400 px-2 py-1 text-white hover:bg-gray-500 dark:bg-neutral-600 dark:hover:bg-neutral-400"
            >
              Cancel
            </p>
            <p
              onClick={
                name === "logout"
                  ? () => {
                      logout();
                      setModalOpen(false);
                    }
                  : name === "postDelete" && data
                    ? () => {
                        deleteHandler(data);
                        setModalOpen(false);
                        setPostModalOpen(false);
                      }
                    : () => {
                        userDeleteHandler();
                        setModalOpen(false);
                      }
              }
              className="flex w-20 cursor-pointer items-center justify-center rounded-lg border border-purple-500 bg-purple-500 px-2 py-1 text-white hover:bg-purple-600"
            >
              {name === "logout" ? "Logout" : "Delete"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
