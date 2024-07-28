import React, { useContext } from "react";
import ProfileHome from "../components/profile/ProfileHome";
import { ModalContext } from "../contexts/modalContext";
import Modal from "../components/modal/Modal";
import FollowModal from "../components/modal/FollowModal";
import PostModal from "../components/modal/PostModal";

const Profile = () => {
  const {
    state,
    modalOpen,
    setModalOpen,
    followModalOpen,
    setFollowModalOpen,
    postModalOpen,
    setPostModalOpen,
  } = useContext(ModalContext);

  return (
    <>
      <ProfileHome />
      {modalOpen && (
        <Modal
          name={state.name}
          data={state.data}
          setModalOpen={setModalOpen}
          setPostModalOpen={setPostModalOpen}
        />
      )}
      {followModalOpen && (
        <FollowModal
          name={state.name}
          setFollowModalOpen={setFollowModalOpen}
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

export default Profile;
