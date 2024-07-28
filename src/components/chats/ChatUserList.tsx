import person from "../../assets/images/person.png";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useChats from "../../hooks/useChats";
import { UserChatProps } from "../../assets/types/postType";

interface Props {
  data: UserChatProps;
  input: string;
}

const ChatUserList = ({ data, input }: Props) => {
  const { selectHandler } = useChats();
  const { userProfile } = useGetUserProfile(data.uid);

  const searchFriends =
    input &&
    userProfile?.userInfo.displayName
      .toLowerCase()
      .includes(input.trim().toLowerCase());

  if (input && !searchFriends) {
    return null;
  }

  return (
    <li
      onClick={() => selectHandler(data.uid)}
      className="group flex cursor-pointer items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400 max-sm:border-none"
    >
      <div className="flex items-center">
        <img
          className="h-8 w-8 rounded-full border bg-white object-cover"
          src={
            userProfile && userProfile.userInfo.photoURL !== null
              ? userProfile.userInfo.photoURL
              : person
          }
          alt=""
        />
      </div>

      <div className="w-32 overflow-hidden max-sm:w-10">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
          {userProfile?.userInfo.displayName}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500 dark:text-neutral-300 max-sm:hidden">
          {data.lastMessage?.text}
        </p>
      </div>
    </li>
  );
};

export default ChatUserList;
