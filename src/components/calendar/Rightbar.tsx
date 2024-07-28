import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
  EventColorListProps,
  EventInputProps,
  EventReducerActionType,
  EventReducerInitialStateProps,
} from "../../assets/types/postType";

interface Props {
  newDate: Date;
  Week: string[];
  event: EventInputProps[];
  colorList: EventColorListProps[];
  input: EventInputProps;
  setInput: React.Dispatch<React.SetStateAction<EventInputProps>>;
  deleteHandler: (data: EventInputProps) => void;
  cancelHandler: () => void;
  submitHandler: () => void;
  state: EventReducerInitialStateProps;
  dispatch: React.Dispatch<EventReducerActionType>;
}

const Rightbar = ({
  newDate,
  Week,
  event,
  colorList,
  input,
  setInput,
  deleteHandler,
  cancelHandler,
  submitHandler,
  state,
  dispatch,
}: Props) => {
  const [titleLength, setTitleLength] = useState(0);
  const [descLength, setDescLength] = useState(0);

  return (
    <div className="flex h-full w-full border-l-2 px-2 py-1">
      <div className="flex w-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <p className="dark:text-white">
                {newDate.getMonth() + 1}/{newDate.getDate()}
              </p>
              <p
                className={`font-bold ${Week[newDate.getDay()] === "Sun" ? "text-red-500" : Week[newDate.getDay()] === "Sat" ? "text-blue-400" : "text-black dark:text-white"}`}
              >
                ({Week[newDate.getDay()]})
              </p>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                className="cursor-pointer dark:text-white"
                icon={faSquare}
                onClick={() => {
                  state.open
                    ? dispatch({ type: "WIDE" })
                    : dispatch({ type: "OPEN" });
                }}
              />
              <FontAwesomeIcon
                className="cursor-pointer dark:text-white"
                icon={faX}
                onClick={() => dispatch({ type: "INITIAL" })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-44 overflow-y-scroll rounded-lg bg-purple-50 scrollbar-hide dark:bg-neutral-500">
              <ul className="flex w-full flex-col gap-1 p-1">
                {event &&
                  event.map((data: EventInputProps) => (
                    <li
                      key={data.id}
                      className={`${data.color} w-full rounded-lg`}
                    >
                      <div className="flex justify-between px-2">
                        <div
                          className={`${state.wide ? "w-72" : "w-36"} flex flex-col justify-center duration-500`}
                        >
                          <p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                            {data.title}
                          </p>
                          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
                            {data.description}
                          </p>
                        </div>
                        <button
                          className=""
                          onClick={() => deleteHandler(data)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <select
                  name="color"
                  id="color"
                  value={input.color}
                  className={`w-6 ${input.color} rounded border`}
                  onChange={(e) => {
                    setInput({ ...input, color: e.target.value });
                  }}
                >
                  {colorList.map((data: EventColorListProps) => (
                    <option
                      key={data.name}
                      value={data.color}
                      className={data.color}
                    ></option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  maxLength={15}
                  value={input.title}
                  className="w-full rounded-lg bg-purple-50 px-1 py-0.5 outline-none dark:bg-neutral-500 dark:text-white"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInput({ ...input, title: e.target.value });
                    setTitleLength(e.target.value.length);
                  }}
                />
                <div className="flex items-center">
                  <p className="dark:text-white">{titleLength}/15</p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <textarea
                  rows={3}
                  placeholder="Description"
                  maxLength={25}
                  value={input.description}
                  className="resize-none rounded-lg bg-purple-50 p-1 outline-none dark:bg-neutral-500 dark:text-white"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setInput({ ...input, description: e.target.value });
                    setDescLength(e.target.value.length);
                  }}
                />
                <div>
                  <p className="dark:text-white">{descLength}/25</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {
              cancelHandler();
              setTitleLength(0);
              setDescLength(0);
            }}
            className="w-full rounded-lg bg-gray-400 px-1 py-0.5 hover:bg-gray-500"
          >
            <p className="text-white">Cancel</p>
          </button>
          <button
            onClick={() => {
              submitHandler();
              setTitleLength(0);
              setDescLength(0);
            }}
            className="w-full rounded-lg bg-purple-500 px-1 py-0.5 hover:bg-purple-700"
          >
            <p className="text-white">Save</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
