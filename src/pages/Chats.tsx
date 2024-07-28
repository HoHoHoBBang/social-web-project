import React, { useContext } from "react";
import Chat from "../components/chats/Chat";
import Modal from "../components/modal/Modal";
import { ModalContext } from "../contexts/modalContext";
import PostModal from "../components/modal/PostModal";

const Chats = () => {
  const { state, modalOpen, setModalOpen, postModalOpen, setPostModalOpen } =
    useContext(ModalContext);

  return (
    <>
      <Chat />
      {modalOpen && (
        <Modal
          name={state.name}
          data={state.data}
          setModalOpen={setModalOpen}
          setPostModalOpen={setPostModalOpen}
        />
      )}
      {postModalOpen && state.data && (
        <PostModal
          data={state.data}
          setModalOpen={setModalOpen}
          setPostModalOpen={setPostModalOpen}
        />
      )}
    </>
  );
};

export default Chats;
