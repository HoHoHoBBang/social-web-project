import React, { useContext } from "react";
import Calendar from "../components/calendar/Calendar";
import Modal from "../components/modal/Modal";
import { ModalContext } from "../contexts/modalContext";
import PostModal from "../components/modal/PostModal";

const Event = () => {
  const { state, modalOpen, setModalOpen, postModalOpen, setPostModalOpen } =
    useContext(ModalContext);

  return (
    <>
      <Calendar />
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

export default Event;
