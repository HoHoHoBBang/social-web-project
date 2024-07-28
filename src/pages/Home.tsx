import React, { useContext } from "react";
import Feed from "../components/feed/Feed";
import Modal from "../components/modal/Modal";
import { ModalContext } from "../contexts/modalContext";
import PostModal from "../components/modal/PostModal";

const Home = () => {
  const { state, modalOpen, setModalOpen, postModalOpen, setPostModalOpen } =
    useContext(ModalContext);

  return (
    <>
      <Feed />
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

export default Home;
