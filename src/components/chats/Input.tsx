import { useContext, useEffect, useRef } from "react";
import useChats from "../../hooks/useChats";
import { ChatContext } from "../../contexts/chatContext";

const Input = () => {
  const { text, setText, sendHandler, keyHandler } = useChats();
  const { state } = useContext(ChatContext);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [state]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-full px-2">
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          className="w-full bg-transparent py-1 outline-none dark:text-white"
          placeholder="Text messages"
          onKeyDown={keyHandler}
          ref={ref}
        />
      </div>
      <div>
        <button
          onClick={sendHandler}
          className="dark:hover:bg-neutral-40 rounded-lg bg-purple-500 px-3 py-1 text-white hover:bg-purple-600 dark:bg-neutral-500 dark:hover:bg-neutral-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
