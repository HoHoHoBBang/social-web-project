import React from "react";
import sliceTime from "../../utils/sliceTime";
import {
  EventInputProps,
  EventReducerActionType,
} from "../../assets/types/postType";

interface Props {
  data: Date;
  newDate: Date;
  setNewDate: React.Dispatch<React.SetStateAction<Date>>;
  allEvent: EventInputProps[];
  input: EventInputProps;
  setInput: React.Dispatch<React.SetStateAction<EventInputProps>>;
  dispatch: React.Dispatch<EventReducerActionType>;
}

const DayList = ({
  data,
  newDate,
  setNewDate,
  allEvent,
  input,
  setInput,
  dispatch,
}: Props) => {
  const date = new Date();

  const sameMonth = data.getMonth() === newDate.getMonth();

  const sameDate =
    data.getFullYear() === date.getFullYear() &&
    data.getDate() === date.getDate() &&
    data.getMonth() === date.getMonth();

  const eventDate = (i: Date) =>
    i.getFullYear() +
    "-" +
    sliceTime(i.getMonth() + 1) +
    "-" +
    sliceTime(i.getDate());

  return (
    <div
      className="m-0.5 h-20 cursor-pointer rounded-lg border-purple-500 p-0.5 hover:border-2"
      onClick={() => {
        setNewDate(data);
        dispatch({ type: "OPEN" });
        setInput({
          ...input,
          date:
            data.getFullYear() +
            "-" +
            sliceTime(data.getMonth() + 1) +
            "-" +
            sliceTime(data.getDate()),
        });
      }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className={`${sameMonth ? "text-black" : "text-gray-300"} flex`}>
          <p
            className={`${sameDate ? "rounded-lg bg-purple-500 text-white" : "dark:text-white"} px-1 py-0.5`}
          >
            {data.getDate()}
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          {allEvent.map((event: EventInputProps, index: number) => {
            if (event.date === eventDate(data)) {
              return (
                <p key={event.id} className={`h-1 w-full ${event.color}`}></p>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default DayList;
